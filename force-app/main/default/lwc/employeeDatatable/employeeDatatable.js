import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import USER_FIRST_NAME from '@salesforce/schema/User.FirstName';
import USER_LAST_NAME from '@salesforce/schema/User.LastName';
import USER_NAME from '@salesforce/schema/User.Name';
// Clients come from the WaveMaker illustration API (Apex callout via the
// WM_Illustration_API Named Credential). Row shape: { id, name, displayName,
// externalRef, dateOfBirth, adviserName, ... }
import getClients from '@salesforce/apex/ClientController.getClients';
// Products for "New illustration" (GET /api/v1/products via ProductsController).
// Row shape: { code, description, category, illustrationSource, allowsSecondParty, defaultTermYears }
import getProducts from '@salesforce/apex/ProductsController.getProducts';

// New illustration: product description → c-illustration-dialog ("Select
// illustration parties", first party = the client opened in the header)
// → "Start illustration" → Lightning tab hosting c-illustration-embedding, which
// sends the client + parties + product to the embedded WaveMaker app.
const ILLUSTRATION_TAB = 'Illustration_Embedding';
const NONE = '__none__';

const PRODUCT_COLUMNS = [
    { key: 'code', label: 'Code' },
    { key: 'illustrationSource', label: 'Illustration source' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' }
];

// Left navigation. "New illustration" hosts the products table; "Salesforce" opens
// Salesforce Home in a new tab; the other sections are placeholders for now.
const TABLE_SECTION = 'newIllustration';
const BUSINESS_MANAGER_SECTION = 'businessManager';
const SALESFORCE_SECTION = 'salesforce';
const NAV_ITEMS = [
    { key: 'clientSummary', label: 'Client summary' },
    { key: SALESFORCE_SECTION, label: 'Salesforce', external: true },
    { key: 'clientTracking', label: 'Client tracking' },
    { key: 'businessManager', label: 'Business manager' },
    { key: 'cycManager', label: 'CYC manager' },
    { key: TABLE_SECTION, label: 'New illustration' },
    { key: 'suitabilityLetter', label: 'Suitability letter' },
    { key: 'sendLetter', label: 'Send letter' },
    { key: 'recordManagement', label: 'Record management' },
    { key: 'clientContact', label: 'Client contact' },
    { key: 'clientReports', label: 'Client reports' }
];

// Static application header (top bar + main navigation). "Clients" opens a
// dropdown of the clients from ClientController; the chosen client is shown in
// the client header and is the first party of a new illustration.
const CLIENTS_MENU = 'clients';
const HEADER_NAV_ITEMS = [
    { key: 'home', label: 'Home' },
    { key: CLIENTS_MENU, label: 'Clients', menu: true },
    { key: 'clientContact', label: 'Client contact' },
    { key: 'businessManager', label: 'Business manager' },
    { key: 'adviceSetStatus', label: 'Advice set status' },
    { key: 'workflowManager', label: 'Workflow manager' },
    { key: 'clientAccess', label: 'Client access' }
];
const LOGOUT_URL = '/secur/logout.jsp';

export default class EmployeeDatatable extends NavigationMixin(LightningElement) {
    /**
     * @deprecated No longer used (Employee Name navigation was removed). Kept only
     * because Salesforce blocks removing a property while the component is placed
     * on a Lightning page (Employee_by_AgentforceVibes).
     */
    @api employeeAppUrl;
    /** @deprecated See employeeAppUrl. */
    @api openInNewTab = false;

    /** Title in the centre of the top bar. */
    @api appTitle = 'iBusiness';
    /** Text shown in the logo area when no logoUrl is set. */
    @api brandName = 'Adviser Portal';
    /** Optional logo image (e.g. a Static Resource URL) for the header's logo area. */
    @api logoUrl;

    employees = [];
    activeSection = TABLE_SECTION;
    isLoading = true;
    errorMessage;

    products = [];
    productsLoading = true;
    productsError;

    /** Client opened from the header's Clients dropdown (shown in the client header). */
    selectedClientId;
    clientMenuOpen = false;
    _defaultClientApplied = false;
    clientFilter = '';
    logoutUrl = LOGOUT_URL;
    _currentUser;
    _outsideClickHandler;

    /** Client requested by the tab URL (c__clientId), applied once the clients load. */
    _pendingClientId;
    _lastPageRequest;

    /** Client the "Select illustration parties" dialog is open for (first party). */
    dialogEmployee;
    /** Product whose description was clicked. */
    dialogProduct;
    _returnFocusCode;

    @wire(getClients)
    wiredClients({ data, error }) {
        this.isLoading = false;
        if (data) {
            this.employees = [...data];
            this.errorMessage = undefined;
            if (this.selectedClientId && !data.some((c) => c.id === this.selectedClientId)) {
                this.selectedClientId = undefined; // opened client no longer listed
            }
            this.applyPendingClient();
            // Open the first client by default (once; "Close client" then shows all).
            if (!this._defaultClientApplied && this.employees.length) {
                this._defaultClientApplied = true;
                if (!this.selectedClientId) this.selectedClientId = this.employees[0].id;
            }
        } else if (error) {
            this.errorMessage = error.body?.message ?? 'Failed to load clients.';
            this.employees = [];
        }
    }

    /**
     * Deep link into a left-nav section, e.g. from the WaveMaker app on the Create
     * Illustration tab: state { c__section: 'businessManager', c__clientId, c__refresh }.
     * c__refresh changes on every navigation, so the same link opens/reloads again.
     */
    @wire(CurrentPageReference)
    wiredPageRef(pageRef) {
        const state = pageRef?.state ?? {};
        const section = state.c__section;
        if (!section) return;
        const requestKey = [section, state.c__clientId ?? '', state.c__refresh ?? ''].join('|');
        if (requestKey === this._lastPageRequest) return;
        this._lastPageRequest = requestKey;

        const previousClientId = this.selectedClientId;
        if (state.c__clientId) {
            this._pendingClientId = String(state.c__clientId);
            this.applyPendingClient();
        }
        const item = NAV_ITEMS.find((i) => i.key === section && !i.external);
        if (!item) return;
        this.clientMenuOpen = false;
        // c-business-manager reloads by itself when shown or when its client changes;
        // reload it here when it is already open for the same client.
        const reloadOpenSection =
            section === BUSINESS_MANAGER_SECTION &&
            this.activeSection === section &&
            this.selectedClientId === previousClientId;
        this.activeSection = section;
        if (reloadOpenSection) this.refs?.businessManager?.reload();
    }

    /** Open the client requested by the URL once it is in the loaded list. */
    applyPendingClient() {
        const id = this._pendingClientId;
        if (!id || !this.employees.some((c) => c.id === id)) return;
        this._pendingClientId = undefined;
        this._defaultClientApplied = true;
        this.selectedClientId = id;
    }

    @wire(getProducts)
    wiredProducts({ data, error }) {
        this.productsLoading = false;
        if (data) {
            this.products = [...data];
            this.productsError = undefined;
        } else if (error) {
            this.productsError = error.body?.message ?? 'Failed to load products.';
            this.products = [];
        }
    }

    @wire(getRecord, { recordId: USER_ID, fields: [USER_FIRST_NAME, USER_LAST_NAME, USER_NAME] })
    wiredUser({ data }) {
        if (data) this._currentUser = data;
    }

    connectedCallback() {
        // Close the Clients dropdown on a click anywhere outside this component.
        this._outsideClickHandler = (event) => {
            if (this.clientMenuOpen && !event.composedPath().includes(this.template.host)) {
                this.clientMenuOpen = false;
            }
        };
        document.addEventListener('click', this._outsideClickHandler);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._outsideClickHandler);
    }

    renderedCallback() {
        // Return focus to the product's description after the dialog closes.
        if (!this.dialogEmployee && this._returnFocusCode) {
            const btn = this.template.querySelector(`button[data-code="${this._returnFocusCode}"]`);
            this._returnFocusCode = undefined;
            btn?.focus();
        }
    }

    // ─── Static header ────────────────────────────────────────────────────────

    /** "Last, First" like the top bar in the design; falls back to the full name. */
    get currentUserName() {
        const u = this._currentUser;
        if (!u) return '';
        const first = getFieldValue(u, USER_FIRST_NAME);
        const last = getFieldValue(u, USER_LAST_NAME);
        if (last && first) return `${last}, ${first}`;
        return last || getFieldValue(u, USER_NAME) || '';
    }

    get headerNavItems() {
        return HEADER_NAV_ITEMS.map((item) => ({
            ...item,
            className: item.menu && this.clientMenuOpen ? 'mainnav-item mainnav-item_open' : 'mainnav-item',
            ariaExpanded: item.menu ? String(this.clientMenuOpen) : undefined,
            ariaHasPopup: item.menu ? 'dialog' : undefined,
            showMenu: item.menu && this.clientMenuOpen
        }));
    }

    handleHeaderNavClick(event) {
        const key = event.currentTarget.dataset.header;
        if (key === CLIENTS_MENU) {
            this.clientMenuOpen = !this.clientMenuOpen;
            this.clientFilter = '';
            return;
        }
        const item = HEADER_NAV_ITEMS.find((i) => i.key === key);
        if (item) {
            this.dispatchEvent(new CustomEvent('headernavselect', { detail: { key: item.key, label: item.label } }));
        }
    }

    get clientOptions() {
        const q = this.clientFilter.trim().toLowerCase();
        return this.employees
            .filter((c) => !q || `${c.displayName} ${c.name} ${c.externalRef}`.toLowerCase().includes(q))
            .map((c) => ({
                id: c.id,
                label: c.displayName || c.name,
                ref: c.externalRef,
                selected: c.id === this.selectedClientId,
                className: c.id === this.selectedClientId ? 'client-option client-option_selected' : 'client-option',
                ariaCurrent: c.id === this.selectedClientId ? 'true' : undefined
            }));
    }

    get hasClientOptions() {
        return this.clientOptions.length > 0;
    }

    get clientMenuEmptyText() {
        if (this.isLoading) return 'Loading clients…';
        if (this.hasError) return 'Clients could not be loaded.';
        return this.employees.length ? 'No matching clients.' : 'No clients.';
    }

    handleClientFilter(event) {
        this.clientFilter = event.target.value ?? '';
    }

    handleClientSelect(event) {
        const id = event.currentTarget.dataset.id;
        const client = this.employees.find((c) => c.id === id);
        if (!client) return;
        this.selectedClientId = id;
        this.clientMenuOpen = false; // stay on the current left-nav section
        this.dispatchEvent(new CustomEvent('clientselect', { detail: { clientId: id, client: { ...client } } }));
    }

    handleCloseClient() {
        this.selectedClientId = undefined;
        this.dispatchEvent(new CustomEvent('clientselect', { detail: { clientId: null, client: null } }));
    }

    handleHeaderKeydown(event) {
        if (event.key === 'Escape' && this.clientMenuOpen) {
            this.clientMenuOpen = false;
            this.template.querySelector('button[data-header="clients"]')?.focus();
        }
    }

    get selectedClient() {
        return this.employees.find((c) => c.id === this.selectedClientId);
    }

    get selectedClientName() {
        const c = this.selectedClient;
        return c ? c.displayName || c.name : '';
    }

    // ─── Left navigation ──────────────────────────────────────────────────────

    get navItems() {
        return NAV_ITEMS.map((item) => {
            const active = item.key === this.activeSection;
            return {
                ...item,
                ariaCurrent: active ? 'page' : undefined,
                className: active ? 'nav-item nav-item_active' : 'nav-item',
                ariaLabel: item.external ? `${item.label} (opens in a new tab)` : undefined
            };
        });
    }

    get showTable() {
        return this.activeSection === TABLE_SECTION;
    }

    /** Business manager: the opened client's illustrations (c-business-manager). */
    get showBusinessManager() {
        return this.activeSection === BUSINESS_MANAGER_SECTION;
    }

    get activeSectionLabel() {
        return NAV_ITEMS.find((i) => i.key === this.activeSection)?.label ?? '';
    }

    async handleNavClick(event) {
        const key = event.currentTarget.dataset.key;
        const item = NAV_ITEMS.find((i) => i.key === key);
        if (!item) return;

        this.dispatchEvent(new CustomEvent('navselect', { detail: { key: item.key, label: item.label } }));

        if (key === SALESFORCE_SECTION) {
            const url = await this[NavigationMixin.GenerateUrl]({
                type: 'standard__namedPage',
                attributes: { pageName: 'home' }
            });
            window.open(url, '_blank', 'noopener');
            return;
        }
        // c-business-manager loads fresh data each time it is shown; clicking the
        // section again while it is open reloads it too.
        if (key === BUSINESS_MANAGER_SECTION && this.activeSection === key) {
            this.refs?.businessManager?.reload();
        }
        this.activeSection = key;
    }

    // ─── New illustration: products ───────────────────────────────────────────

    get productColumns() {
        return PRODUCT_COLUMNS;
    }

    /** No client opened in the header → descriptions are disabled. */
    get noClient() {
        return !this.selectedClient;
    }

    get productRows() {
        const client = this.selectedClientName;
        return this.products.map((p) => ({
            ...p,
            linkTitle: client
                ? `Start a ${p.description} illustration for ${client}`
                : 'Choose a client from Clients first'
        }));
    }

    get hasProducts() {
        return this.products.length > 0;
    }

    get hasError() {
        return !!this.errorMessage;
    }

    get productCountLabel() {
        const n = this.products.length;
        return `${n} product${n === 1 ? '' : 's'}`;
    }

    /** Description click → "Select illustration parties" with the opened client prefilled. */
    handleProductClick(event) {
        const code = event.currentTarget.dataset.code;
        const product = this.products.find((p) => p.code === code);
        const client = this.selectedClient;
        if (!product || !client) return;
        this.dialogProduct = product;
        this.dialogEmployee = client;
        this._returnFocusCode = code;
    }

    handleDialogCancel() {
        this.dialogEmployee = undefined;
        this.dialogProduct = undefined;
    }

    /** detail: { firstParty, secondParty, preparedBy, adviser } from c-illustration-dialog */
    handleStartIllustration(event) {
        const { firstParty, secondParty, preparedBy, adviser } = event.detail;
        const product = this.dialogProduct;
        this.dialogEmployee = undefined;
        this.dialogProduct = undefined;
        this._returnFocusCode = undefined;
        this.openIllustration({ firstParty, secondParty, preparedBy, adviser, product });
    }

    /**
     * Open the Illustration tab. c-illustration-embedding reads the state, loads
     * the rows and sends `employeeselect` (employee + parties) to the WaveMaker app.
     * c__requestId makes every start a new request.
     */
    openIllustration({ firstParty, secondParty, preparedBy, adviser, product }) {
        const state = {
            c__employeeId: firstParty.id,
            c__secondPartyId: secondParty?.id ?? NONE,
            c__preparedById: preparedBy?.id ?? NONE,
            c__requestId: String(Date.now())
        };
        if (adviser?.name) state.c__adviser = adviser.name;
        if (product?.code) {
            state.c__productCode = product.code;
            state.c__productName = product.description;
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: { apiName: ILLUSTRATION_TAB },
            state
        });
    }
}
