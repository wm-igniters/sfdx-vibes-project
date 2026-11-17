import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import getClients from '@salesforce/apex/ClientController.getClients';
import { buildEmbeddingSrc } from './embeddingSrc';
import { toEmbeddingProps } from './embeddingProps';

// Window-level event for other components on the same Lightning page.
const EMPLOYEE_SELECTED_EVENT = 'lwc__employeeselected';

// UI Embedding lifecycle events (dotted names → attach in JS, not in the template).
const EMBEDDING_READY = 'sf-embedding.component.ready';
const EMBEDDING_ERROR = 'sf-embedding.component.error';

// <lightning-ui-embedding> has no intrinsic height (it falls back to the browser's
// 150px iframe default), so size it to the space left below it in the viewport.
const MIN_EMBEDDING_HEIGHT = 360; // px
const BOTTOM_RESERVE = 16; // px: breathing room below the frame (no card or status line)

// Connection watchdog. A healthy WaveMaker frame sends its sf-embedding/ready
// heartbeat within a few seconds; occasionally the first load of the frame never
// does (the component then waits 30s and fails with HEARTBEAT_TIMEOUT), while a
// fresh frame connects at once. So if the frame is not ready after
// CONNECT_TIMEOUT_MS, mount a new <lightning-ui-embedding> (new instance, new
// iframe). The last attempt is left to the component's own 30s heartbeat timeout.
const CONNECT_TIMEOUT_MS = 15000;
const MAX_CONNECT_ATTEMPTS = 3;

// Event name used in both directions with the WaveMaker app.
const EMPLOYEE_SELECT_EVENT = 'employeeselect';
// Events this component dispatches *to* the app; the template's onemployeeselect
// listener sits on the same element, so it must ignore them.
const hostDispatchedEvents = new WeakSet();
// Host → app: an EBS submission was created (Business manager → EBS → Create).
const CREATE_EBS_EVENT = 'createEBS';
const NOT_INCLUDED = '__none__';

// App → host `navigatetab` { apiName }: open a Lightning tab. The embedded frame is
// sandboxed (no top navigation / popups), so the host navigates on the app's behalf.
// Only these tabs can be opened from the app; the first one is the default.
const NAVIGABLE_TABS = ['Client_Illustration', 'illustrationClientList', 'Illustration_List'];
// Clients tab (c-employee-datatable): `section` opens one of its left-nav items.
const CLIENTS_TAB = 'Client_Illustration';
const SECTION_PATTERN = /^[A-Za-z][A-Za-z0-9]{0,39}$/;

/**
 * c-illustration-embedding
 *
 * Hosts the WaveMaker app (served as the `employeeapp` UI Bundle) inside
 * Lightning with <lightning-ui-embedding>. The WaveMaker app implements the
 * embedding bridge WITHOUT a Salesforce package: it does the
 * `sf-embedding/ready` → `sf-embedding.bootstrap` handshake and speaks
 * JSON-RPC 2.0 over the transferred MessagePort itself.
 *
 *  Host → app : `props` → delivered as the `ui/subscribe/ui-state` snapshot and
 *               `ui/notifications/ui-state-changed` (full replacement each time)
 *               = { employeesJson, selectedEmployeeId, selectedEmployeeJson,
 *                   selectionPartiesJson, selectionRequestId, locale, source }
 *               (primitives only — objects/arrays as JSON strings, see toEmbeddingProps)
 *               (employees loaded here via Apex — the embedded app never calls Salesforce)
 *  App → host : `ui/events/dispatch` { eventType: 'employeeselect', detail: { employeeId } }
 *               → surfaces here as the DOM event `employeeselect`
 *               `ui/events/dispatch` { eventType: 'trackdirtystate', detail: { isDirty, label, instanceId } }
 *               → surfaces here as the DOM event `trackdirtystate`
 *  Page sync  : listens to / re-broadcasts the window `lwc__employeeselected` event
 *
 *  Tab request: Employee Directory "Create Illustration" → "Select illustration
 *               parties" dialog → "Start illustration" opens this component's tab
 *               with state { c__employeeId, c__secondPartyId, c__preparedById,
 *               c__adviser, c__productCode, c__productName, c__requestId }
 *               ('__none__' = not included). Once the
 *               app is connected, the host dispatches `employeeselect` ON the
 *               <lightning-ui-embedding> element → forwarded to the app as
 *               ui/events/dispatch { eventType: 'employeeselect',
 *               detail: { employeeId, employee, parties, requestId, origin: 'salesforce' } }
 *               parties = { firstParty, secondParty|null, preparedBy|null, adviser,
 *               product: { code, description }|null }.
 *               The same data is also put in props (selectedEmployee/selectionParties/selectionRequestId)
 *               so the app still gets it if it subscribed to events late.
 *
 *  EBS request: Business manager → Illustration summary → "Create EBS" creates the
 *               submission (POST /illustrations/{id}/submissions) and opens this tab
 *               with state { c__ebsRequestId, c__ebsSubmission (JSON), c__illustrationId,
 *               c__clientId }. The host dispatches `createEBS` ON the embedding →
 *               ui/events/dispatch { eventType: 'createEBS', detail: { submission,
 *               illustrationId, clientId, requestId, origin: 'salesforce' } }
 *               (submission = the whole API response). Every request reloads the app
 *               (fresh embedding), like "Start illustration". Also in props as
 *               ebsSubmission/ebsRequestId; the app de-duplicates by requestId.
 *
 *  App ready  : events dispatched before the app has subscribed (ui/events/subscribe)
 *               are dropped by <lightning-ui-embedding>, and the first one is sent as
 *               soon as the frame connects. The app therefore dispatches `appready`
 *               once its pages are up; the host then (re)sends the current
 *               `employeeselect`. The app de-duplicates by requestId.
 */
export default class IllustrationEmbedding extends NavigationMixin(LightningElement) {
    /** Optional explicit URL of the embedded app (App Builder property). */
    @api employeeAppUrl;
    /** UI Bundle API name used to derive the URL when employeeAppUrl is blank. */
    @api appName = 'employeeapp';
    /** Accessible title of the embedded frame (no visible header is rendered). */
    @api cardTitle = 'Employee Illustration';

    /** Fixed after first connect — changing src after mount raises SESSION_BINDING_MUTATED. */
    embedSrc;
    embeddingHeight = MIN_EMBEDDING_HEIGHT;
    embeddingProps = toEmbeddingProps({ employees: [], selectedEmployeeId: null });

    isReady = false;
    isDirty = false;
    dirtyLabel;
    embeddingError;
    loadError;

    _employees = [];
    _employeesLoaded = false;
    _selectedEmployeeId = null;
    _selectedEmployee = null;
    _selectionRequestId = null;
    _selectionParties = null;
    _pendingRequest = null;
    _lastRequestId;
    /** Current EBS request { requestId, submission, illustrationId, clientId } (sent on every ready). */
    _ebsRequest = null;
    _lastEbsRequestId;
    _appReady = false;
    lastSentName;
    _embeddingListenersAttached = false;
    _windowHandler;

    /** Toggled off/on to mount a fresh <lightning-ui-embedding> when a connection attempt stalls. */
    showEmbedding = true;
    connectAttempt = 1;
    _remountPending = false;
    _watchdog;

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    connectedCallback() {
        if (!this.embedSrc) {
            this.embedSrc = buildEmbeddingSrc(this.employeeAppUrl, window.location.hostname, this.appName);
        }
        this._windowHandler = (event) => this.syncSelectionFromPage(event.detail);
        window.addEventListener(EMPLOYEE_SELECTED_EVENT, this._windowHandler);
        this._resizeHandler = () => this.fitToViewport();
        window.addEventListener('resize', this._resizeHandler);
    }

    disconnectedCallback() {
        window.removeEventListener(EMPLOYEE_SELECTED_EVENT, this._windowHandler);
        this._windowHandler = null;
        window.removeEventListener('resize', this._resizeHandler);
        this._resizeHandler = null;
        this.clearWatchdog();
    }

    renderedCallback() {
        if (this._remountPending) {
            // The stalled embedding has been removed; mount a fresh one.
            this._remountPending = false;
            this.showEmbedding = true;
            return;
        }
        this.fitToViewport();
        if (this._embeddingListenersAttached) return;
        const el = this.refs?.embedding;
        if (!el) return;
        this._embeddingListenersAttached = true;
        el.addEventListener(EMBEDDING_READY, this.handleReady);
        el.addEventListener(EMBEDDING_ERROR, this.handleError);
        this.startWatchdog();
    }

    // ─── Connection watchdog / reconnect ──────────────────────────────────────

    startWatchdog() {
        this.clearWatchdog();
        if (this.connectAttempt >= MAX_CONNECT_ATTEMPTS) return; // last try: component's own timeout
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this._watchdog = setTimeout(() => {
            this._watchdog = undefined;
            if (!this.isReady) this.reconnect();
        }, CONNECT_TIMEOUT_MS);
    }

    clearWatchdog() {
        if (this._watchdog) clearTimeout(this._watchdog);
        this._watchdog = undefined;
    }

    /** Replace the embedding with a fresh instance (new iframe, new handshake). */
    reconnect() {
        this.clearWatchdog();
        this.connectAttempt += 1;
        this.isReady = false;
        this._appReady = false;
        this.embeddingError = undefined;
        this._embeddingListenersAttached = false;
        this._remountPending = true;
        this.showEmbedding = false;
    }

    /** "Try again" after all automatic attempts failed. */
    handleRetry() {
        this.connectAttempt = 0;
        this.reconnect();
    }

    // ─── Tab state from "Create Illustration" ─────────────────────────────────

    @wire(CurrentPageReference)
    wiredPageRef(pageRef) {
        if (pageRef?.state?.c__ebsRequestId) {
            this.receiveEbsRequest(pageRef.state);
            return;
        }
        const employeeId = pageRef?.state?.c__employeeId;
        if (!employeeId) return;
        const requestId = pageRef.state.c__requestId || employeeId;
        if (requestId === this._lastRequestId) return; // same request re-emitted (tab revisit)
        const hadPreviousRequest = this._lastRequestId !== undefined;
        this._lastRequestId = requestId;
        this.clearEbsRequest(); // a new illustration replaces any earlier EBS hand-off
        const {
            c__secondPartyId: secondPartyId,
            c__preparedById: preparedById,
            c__adviser: adviser,
            c__productCode: productCode,
            c__productName: productName
        } = pageRef.state;
        const product = productCode ? { code: productCode, description: productName ?? productCode } : null;
        this._pendingRequest = { employeeId, secondPartyId, preparedById, adviser, product, requestId };
        // Every "Start illustration" opens the app from the start. Lightning keeps this
        // tab alive between visits, so if the app was already loaded (an earlier request,
        // or connected), replace the embedding with a fresh instance; the request is
        // delivered once the new frame is ready.
        if (hadPreviousRequest || this.isReady) this.restartEmbedding();
        this.deliverPendingRequest();
    }

    // ─── EBS request from Business manager ─────────────────────────────────────

    receiveEbsRequest(state) {
        const requestId = String(state.c__ebsRequestId);
        if (requestId === this._lastEbsRequestId) return; // same request re-emitted (tab revisit)
        const hadPreviousRequest = this._lastEbsRequestId !== undefined || this._lastRequestId !== undefined;
        this._lastEbsRequestId = requestId;
        let submission;
        try {
            submission = JSON.parse(state.c__ebsSubmission ?? 'null');
        } catch {
            this.loadError = 'The EBS submission could not be read.';
            return;
        }
        const rawId = state.c__illustrationId;
        const illustrationId = rawId && /^\d+$/.test(rawId) ? Number(rawId) : rawId ?? submission?.illustrationId ?? null;
        this._ebsRequest = { requestId, submission, illustrationId, clientId: state.c__clientId ?? null };
        this.loadError = undefined;
        this.updateProps();
        // Like "Start illustration", every "Create EBS" reloads the app from the start:
        // if it was already loaded (an earlier request, or connected), mount a fresh
        // embedding; createEBS is sent once the new frame is ready.
        if (hadPreviousRequest || this.isReady) this.restartEmbedding();
        this.deliverEbsRequest();
    }

    clearEbsRequest() {
        if (!this._ebsRequest) return;
        this._ebsRequest = null;
        this.updateProps();
    }

    /** Send `createEBS` to the app once the frame is connected (re-sent on ready/appready). */
    deliverEbsRequest() {
        const req = this._ebsRequest;
        const el = this.refs?.embedding;
        if (!req || !this.isReady || !el) return;
        const event = new CustomEvent(CREATE_EBS_EVENT, {
            detail: {
                submission: req.submission,
                illustrationId: req.illustrationId,
                clientId: req.clientId,
                requestId: req.requestId,
                origin: 'salesforce',
                source: 'businessManager'
            }
        });
        hostDispatchedEvents.add(event);
        el.dispatchEvent(event);
    }

    /** Mount a brand-new <lightning-ui-embedding> (fresh iframe, app state reset). */
    restartEmbedding() {
        this.connectAttempt = 0; // reconnect() makes this attempt 1
        this.lastSentName = undefined;
        this.reconnect();
    }

    /**
     * Resolve the requested row and hand it to the app: props immediately, the
     * `employeeselect` event as soon as the embedding reports ready.
     */
    deliverPendingRequest() {
        const req = this._pendingRequest;
        if (!req || !this._employeesLoaded) return;

        const employee = this._employees.find((e) => e.id === req.employeeId);
        if (!employee) {
            this._pendingRequest = null;
            this.loadError = `Employee ${req.employeeId} was not found.`;
            return;
        }

        const party = (id) => (id && id !== NOT_INCLUDED ? this._employees.find((e) => e.id === id) ?? null : null);
        const parties = {
            firstParty: { ...employee },
            secondParty: party(req.secondPartyId),
            preparedBy: party(req.preparedById),
            adviser: req.adviser ?? null,
            product: req.product ?? null
        };

        if (this._selectionRequestId !== req.requestId) {
            this._selectedEmployeeId = employee.id;
            this._selectedEmployee = employee;
            this._selectionParties = parties;
            this._selectionRequestId = req.requestId;
            this.updateProps();
            window.dispatchEvent(
                new CustomEvent(EMPLOYEE_SELECTED_EVENT, { detail: this.toSelectionPayload(employee) })
            );
        }

        const el = this.refs?.embedding;
        if (!this.isReady || !el) return; // sent from handleReady
        this._pendingRequest = null;
        this.sendEmployeeToApp(el, employee, req.requestId, parties);
    }

    sendEmployeeToApp(el, employee, requestId, parties = null) {
        const event = new CustomEvent(EMPLOYEE_SELECT_EVENT, {
            detail: {
                employeeId: employee.id,
                employee: { ...employee },
                parties,
                requestId,
                origin: 'salesforce',
                source: 'employeeDatatable'
            }
        });
        hostDispatchedEvents.add(event);
        el.dispatchEvent(event);
        this.lastSentName = employee.name;
    }

    // ─── Data (host fetches, app renders) ─────────────────────────────────────

    @wire(getClients)
    wiredEmployees({ data, error }) {
        if (data) {
            // Plain, serialisable copies — props are posted across the iframe boundary.
            this._employees = JSON.parse(JSON.stringify(data));
            this._employeesLoaded = true;
            this.loadError = undefined;
            this.updateProps();
            this.deliverPendingRequest();
        } else if (error) {
            this.loadError = error.body?.message ?? 'Failed to load clients.';
        }
    }

    updateProps() {
        this.embeddingProps = toEmbeddingProps({
            employees: this._employees,
            selectedEmployeeId: this._selectedEmployeeId,
            selectedEmployee: this._selectedEmployee,
            selectionParties: this._selectionParties,
            selectionRequestId: this._selectionRequestId,
            ebsSubmission: this._ebsRequest?.submission ?? null,
            ebsRequestId: this._ebsRequest?.requestId ?? null
        });
    }

    // ─── Embedding lifecycle ──────────────────────────────────────────────────

    handleReady = (event) => {
        if (event && event.currentTarget !== this.refs?.embedding) return; // stale instance
        this.clearWatchdog();
        this.isReady = true;
        this.embeddingError = undefined;
        this.deliverPendingRequest();
        this.deliverEbsRequest();
    };

    handleError = (event) => {
        if (event.currentTarget !== this.refs?.embedding) return; // stale instance
        const { code, message, phase, retryable } = event.detail ?? {};
        if (retryable && this.connectAttempt < MAX_CONNECT_ATTEMPTS) {
            this.reconnect();
            return;
        }
        this.clearWatchdog();
        this.isReady = false;
        this.embeddingError = {
            code: code ?? 'UNKNOWN',
            message: message ?? 'The embedded app failed to load.',
            phase,
            retryable: !!retryable
        };
    };

    // ─── App → host ───────────────────────────────────────────────────────────

    /** `appready` from the app: it is subscribed and its pages are up — (re)send the current selection. */
    handleAppReady() {
        this._appReady = true;
        this.deliverEbsRequest();
        if (this._pendingRequest) {
            this.deliverPendingRequest();
            return;
        }
        const el = this.refs?.embedding;
        if (el && this._selectedEmployee && this._selectionRequestId) {
            this.sendEmployeeToApp(el, this._selectedEmployee, this._selectionRequestId, this._selectionParties);
        }
    }

    /**
     * `navigatetab` from the app: open an allowed Lightning tab (default: the Clients tab).
     * detail { apiName?, section?, clientId? }:
     *   section  — left-nav item to open on the Clients tab (e.g. 'businessManager')
     *   clientId — client to open there; defaults to the illustration's client
     */
    handleNavigateTab(event) {
        const detail = event.detail ?? {};
        const apiName = detail.apiName ?? NAVIGABLE_TABS[0];
        if (!NAVIGABLE_TABS.includes(apiName)) {
            console.warn(`illustrationEmbedding: navigatetab to "${apiName}" is not allowed`);
            return;
        }
        // c__refresh: a new value on every navigation tells the target tab to reload its
        // data (Lightning keeps tabs alive, so the list would otherwise show cached rows).
        const state = { c__refresh: String(Date.now()) };
        if (apiName === CLIENTS_TAB && detail.section) {
            if (SECTION_PATTERN.test(String(detail.section))) {
                state.c__section = String(detail.section);
                const clientId = detail.clientId ?? this._selectedEmployeeId;
                if (clientId != null && clientId !== '') state.c__clientId = String(clientId);
            } else {
                console.warn(`illustrationEmbedding: navigatetab section "${detail.section}" is not valid`);
            }
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: { apiName },
            state
        });
    }

    /** `trackdirtystate` from the bridge (unsaved changes inside the WaveMaker app). */
    handleTrackDirtyState(event) {
        const { isDirty, label } = event.detail ?? {};
        this.isDirty = !!isDirty;
        this.dirtyLabel = this.isDirty ? label : undefined;
    }

    handleEmployeeSelect(event) {
        // Our own host → app dispatch also hits this listener; only handle app → host.
        if (hostDispatchedEvents.has(event) || event.detail?.origin === 'salesforce') return;
        // detail is structured-cloned from the app; accept { employeeId } (or { id }).
        const detail = event.detail ?? {};
        const employeeId = detail.employeeId ?? detail.id;
        const employee = this._employees.find((e) => e.id === employeeId);
        if (!employee) return;

        this._selectedEmployeeId = employee.id;
        this._selectedEmployee = employee;
        this._selectionRequestId = null; // app-initiated, not a tab request
        this._selectionParties = null;
        this.updateProps(); // round-trip: app re-renders with the host-confirmed selection

        window.dispatchEvent(
            new CustomEvent(EMPLOYEE_SELECTED_EVENT, { detail: this.toSelectionPayload(employee) })
        );
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Employee selected in embedded app',
                message: employee.displayName || employee.name,
                variant: 'success'
            })
        );
    }

    // ─── Page → host → app ────────────────────────────────────────────────────

    syncSelectionFromPage(detail) {
        const employeeId = detail?.employeeId;
        if (!employeeId || employeeId === this._selectedEmployeeId) return;
        this._selectedEmployeeId = employeeId;
        this._selectedEmployee = this._employees.find((e) => e.id === employeeId) ?? null;
        this._selectionRequestId = null;
        this._selectionParties = null;
        this.updateProps();
    }

    toSelectionPayload(employee) {
        return {
            employeeId: employee.id,
            employeeName: employee.name,
            clientId: employee.clientId,
            displayName: employee.displayName,
            title: employee.title,
            forename: employee.forename,
            surname: employee.surname,
            externalRef: employee.externalRef,
            dateOfBirth: employee.dateOfBirth,
            adviserId: employee.adviserId,
            adviserName: employee.adviserName,
            avatarInitials: employee.avatarInitials,
            source: 'illustrationEmbedding',
            timestamp: Date.now()
        };
    }

    // ─── Sizing ───────────────────────────────────────────────────────────────

    /** Make the embedded app fill the height left below the frame's top edge. */
    fitToViewport() {
        const el = this.refs?.embedding;
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        const available = Math.round(window.innerHeight - top - BOTTOM_RESERVE);
        const next = Math.max(MIN_EMBEDDING_HEIGHT, available);
        if (Math.abs(next - this.embeddingHeight) > 2) this.embeddingHeight = next;
    }

    get embeddingStyle() {
        return `display: block; width: 100%; height: ${this.embeddingHeight}px;`;
    }

    // ─── Getters ──────────────────────────────────────────────────────────────

    /** Overlay the frame until the app has connected (also while reconnecting). */
    get showLoading() {
        return !this.isReady && !this.embeddingError;
    }

    get loadingText() {
        return this.connectAttempt > 1
            ? `Reconnecting to the illustration app (attempt ${this.connectAttempt} of ${MAX_CONNECT_ATTEMPTS})…`
            : 'Loading illustration…';
    }

    get hasSrc() {
        return !!this.embedSrc;
    }

    get statusText() {
        if (this.embeddingError) return 'Embedded app unavailable';
        if (!this.isReady) {
            return this.connectAttempt > 1
                ? `Reconnecting to embedded app (attempt ${this.connectAttempt} of ${MAX_CONNECT_ATTEMPTS})…`
                : 'Connecting to embedded app…';
        }
        const count = this._employees.length;
        let base = `Connected · ${count} client${count === 1 ? '' : 's'} shared with the app`;
        if (this.lastSentName) base += ` · Sent ${this.lastSentName}`;
        if (this.isDirty) return `${base} · Unsaved changes${this.dirtyLabel ? ` (${this.dirtyLabel})` : ''}`;
        return base;
    }

}
