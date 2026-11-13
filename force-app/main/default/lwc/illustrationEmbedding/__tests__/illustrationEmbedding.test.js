/* global require */
/* eslint-disable @lwc/lwc/no-unexpected-wire-adapter-usages -- test drives the wire adapter via emit() */
import { createElement } from '@lwc/engine-dom';
import IllustrationEmbedding from 'c/illustrationEmbedding';
import getClients from '@salesforce/apex/ClientController.getClients';
import { CurrentPageReference, getNavigateCalls, resetNavigateCalls } from 'lightning/navigation';
import { buildEmbeddingSrc, deriveEmployeeAppUrl } from '../embeddingSrc';

jest.mock(
    '@salesforce/apex/ClientController.getClients',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
        return { default: createApexTestWireAdapter(jest.fn()) };
    },
    { virtual: true }
);

const APP_URL = 'https://wm--c.develop.my.salesforce.app/app/c__employeeapp';
const EMPLOYEES = [
    { id: 'EMP-001', name: 'Alice Johnson', department: 'Engineering', title: 'Senior Engineer', salary: 95000, status: 'Active' },
    { id: 'EMP-007', name: 'Grace Patel', department: 'HR', title: 'HR Manager', salary: 82000, status: 'On Leave' }
];

const flush = () => Promise.resolve();

describe('embeddingSrc', () => {
    it('derives the employeeapp URL from Lightning hosts', () => {
        expect(deriveEmployeeAppUrl('acme-dev-ed.develop.lightning.force.com')).toBe(
            'https://acme-dev-ed--c.develop.my.salesforce.app/app/c__employeeapp'
        );
        expect(deriveEmployeeAppUrl('localhost')).toBeNull();
    });

    it('uses the URL as-is (no query params) and rejects non-https / same-origin / invalid URLs', () => {
        expect(buildEmbeddingSrc(APP_URL, 'localhost')).toBe(APP_URL);
        expect(buildEmbeddingSrc('', 'acme.lightning.force.com')).toBe(
            'https://acme--c.my.salesforce.app/app/c__employeeapp'
        );
        expect(buildEmbeddingSrc('', 'acme.lightning.force.com', 'wmEmployeeApp')).toBe(
            'https://acme--c.my.salesforce.app/app/c__wmEmployeeApp'
        );
        expect(buildEmbeddingSrc('https://acme.lightning.force.com/x', 'acme.lightning.force.com')).toBeNull();
        expect(buildEmbeddingSrc('http://insecure.example.com', 'localhost')).toBeNull();
        expect(buildEmbeddingSrc('not a url', 'localhost')).toBeNull();
        expect(buildEmbeddingSrc(undefined, 'localhost')).toBeNull();
    });
});

describe('c-illustration-embedding', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        jest.clearAllMocks();
    });

    async function setup(props = { employeeAppUrl: APP_URL }) {
        const element = createElement('c-illustration-embedding', { is: IllustrationEmbedding });
        Object.assign(element, props);
        document.body.appendChild(element);
        await flush();
        return element;
    }

    // Props are primitives only; *Json values are decoded back to objects for the assertions.
    const decode = (props) => {
        const out = { ...props };
        Object.keys(props).forEach((key) => {
            if (key.endsWith('Json')) out[key.slice(0, -4)] = JSON.parse(props[key]);
        });
        return out;
    };
    const rawEmbedding = (el) => el.shadowRoot.querySelector('lightning-ui-embedding');
    const embedding = (el) => {
        const emb = rawEmbedding(el);
        if (emb && !Object.getOwnPropertyDescriptor(emb, 'decodedProps')) {
            Object.defineProperty(emb, 'decodedProps', { get: () => decode(emb.props) });
        }
        return emb;
    };
    const statusText = (el) => el.shadowRoot.querySelector('p[aria-live]').textContent;

    it('renders lightning-ui-embedding with src, title and Apex employees as props', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();

        const emb = embedding(el);
        expect(emb.src).toBe(APP_URL);
        expect(emb.title).toBe('Employee Illustration');
        expect(emb.decodedProps.employees.map((e) => e.id)).toEqual(['EMP-001', 'EMP-007']);
        expect(emb.decodedProps.selectedEmployeeId).toBeNull();
        expect(statusText(el)).toBe('Connecting to embedded app…');
    });

    it('handles the ready and error lifecycle events', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();

        embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
        await flush();
        expect(statusText(el)).toBe('Connected · 2 clients shared with the app');

        embedding(el).dispatchEvent(
            new CustomEvent('sf-embedding.component.error', {
                detail: { phase: 'handshake', code: 'SAME_ORIGIN_SRC', message: 'bad src', retryable: false }
            })
        );
        await flush();
        expect(el.shadowRoot.querySelector('.slds-alert_error').textContent).toContain('SAME_ORIGIN_SRC');
        expect(statusText(el)).toBe('Embedded app unavailable');
    });

    it('handles employeeselect from the app: updates props, broadcasts and toasts', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();
        const pageListener = jest.fn();
        const toast = jest.fn();
        window.addEventListener('lwc__employeeselected', pageListener);
        el.addEventListener('lightning__showtoast', toast);

        embedding(el).dispatchEvent(new CustomEvent('employeeselect', { detail: { employeeId: 'EMP-007' } }));
        await flush();

        expect(embedding(el).decodedProps.selectedEmployeeId).toBe('EMP-007');
        expect(pageListener).toHaveBeenCalledTimes(1);
        expect(pageListener.mock.calls[0][0].detail).toMatchObject({
            employeeId: 'EMP-007',
            employeeName: 'Grace Patel',
            source: 'illustrationEmbedding'
        });
        expect(toast).toHaveBeenCalledTimes(1);

        // Unknown ids are ignored
        embedding(el).dispatchEvent(new CustomEvent('employeeselect', { detail: { employeeId: 'NOPE' } }));
        await flush();
        expect(pageListener).toHaveBeenCalledTimes(1);
        window.removeEventListener('lwc__employeeselected', pageListener);
    });

    it('shows unsaved-changes state from the bridge trackdirtystate event', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();
        embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
        embedding(el).dispatchEvent(
            new CustomEvent('trackdirtystate', { detail: { isDirty: true, label: 'Employee form', instanceId: 'i1' } })
        );
        await flush();
        expect(statusText(el)).toBe('Connected · 2 clients shared with the app · Unsaved changes (Employee form)');

        embedding(el).dispatchEvent(new CustomEvent('trackdirtystate', { detail: { isDirty: false, instanceId: 'i1' } }));
        await flush();
        expect(statusText(el)).toBe('Connected · 2 clients shared with the app');
    });

    it('accepts { id } as well as { employeeId } in the app event detail', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();
        embedding(el).dispatchEvent(new CustomEvent('employeeselect', { detail: { id: 'EMP-001' } }));
        await flush();
        expect(embedding(el).decodedProps.selectedEmployeeId).toBe('EMP-001');
    });

    it('syncs selections made elsewhere on the page (Employee Directory) into props', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();

        window.dispatchEvent(new CustomEvent('lwc__employeeselected', { detail: { employeeId: 'EMP-001' } }));
        await flush();
        expect(embedding(el).decodedProps.selectedEmployeeId).toBe('EMP-001');
    });

    describe('connection watchdog', () => {
        afterEach(() => jest.useRealTimers());

        // Remount takes two render passes (remove, then re-add) plus the ref wiring.
        const settle = () => flush().then(flush).then(flush).then(flush);

        it('mounts a fresh embedding when the frame is not ready in time, then connects', async () => {
            jest.useFakeTimers();
            const el = await setup();
            getClients.emit(EMPLOYEES);
            await flush();
            const first = embedding(el);

            jest.advanceTimersByTime(15000);
            await settle();
            const second = embedding(el);
            expect(second).not.toBeNull();
            expect(second).not.toBe(first);
            expect(second.decodedProps.employees).toHaveLength(2);
            expect(statusText(el)).toBe('Reconnecting to embedded app (attempt 2 of 3)…');

            // A late event from the discarded instance is ignored.
            first.dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            expect(statusText(el)).toBe('Reconnecting to embedded app (attempt 2 of 3)…');

            second.dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            expect(statusText(el)).toBe('Connected · 2 clients shared with the app');
            jest.advanceTimersByTime(60000);
            await settle();
            expect(embedding(el)).toBe(second);
        });

        it('retries a retryable HEARTBEAT_TIMEOUT, then shows the error with Try again', async () => {
            jest.useFakeTimers();
            const el = await setup();
            getClients.emit(EMPLOYEES);
            await flush();
            const heartbeatTimeout = () =>
                new CustomEvent('sf-embedding.component.error', {
                    detail: { code: 'HEARTBEAT_TIMEOUT', message: 'no heartbeat', retryable: true }
                });

            embedding(el).dispatchEvent(heartbeatTimeout()); // attempt 1 → 2
            await settle();
            embedding(el).dispatchEvent(heartbeatTimeout()); // attempt 2 → 3
            await settle();
            expect(statusText(el)).toBe('Reconnecting to embedded app (attempt 3 of 3)…');

            // Last attempt: no watchdog, the component's own timeout decides.
            const last = embedding(el);
            jest.advanceTimersByTime(20000);
            await settle();
            expect(embedding(el)).toBe(last);

            last.dispatchEvent(heartbeatTimeout());
            await settle();
            expect(el.shadowRoot.querySelector('.slds-alert_error').textContent).toContain('HEARTBEAT_TIMEOUT');
            expect(statusText(el)).toBe('Embedded app unavailable');

            el.shadowRoot.querySelector('.slds-alert_error button').click();
            await settle();
            expect(el.shadowRoot.querySelector('.slds-alert_error')).toBeNull();
            expect(embedding(el)).not.toBe(last);
            expect(statusText(el)).toBe('Connecting to embedded app…');
        });

        it('re-delivers the requested client to the new instance', async () => {
            jest.useFakeTimers();
            const el = await setup();
            CurrentPageReference.emit({ state: { c__employeeId: 'EMP-007', c__requestId: 'w1' } });
            getClients.emit(EMPLOYEES);
            await flush();

            jest.advanceTimersByTime(15000);
            await settle();
            const fresh = embedding(el);
            expect(fresh.decodedProps.selectedEmployee.id).toBe('EMP-007');
            const handler = jest.fn();
            fresh.addEventListener('employeeselect', handler);
            fresh.dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail).toMatchObject({ employeeId: 'EMP-007', requestId: 'w1' });
        });
    });

    describe('"Create Illustration" tab request', () => {
        const tabState = (employeeId, requestId) => ({
            type: 'standard__navItemPage',
            attributes: { apiName: 'Illustration_Embedding' },
            state: { c__employeeId: employeeId, c__requestId: requestId }
        });

        // Captures host → app dispatches on whichever embedding instance is mounted
        // (a new "Start illustration" replaces the instance).
        afterEach(() => jest.restoreAllMocks());

        // eslint-disable-next-line no-unused-vars -- el kept for call-site readability
        function captureAppEvents(el) {
            const sent = [];
            const original = EventTarget.prototype.dispatchEvent;
            jest.spyOn(EventTarget.prototype, 'dispatchEvent').mockImplementation(function (event) {
                if (
                    this.tagName === 'LIGHTNING-UI-EMBEDDING' &&
                    event.type === 'employeeselect' &&
                    event.detail?.origin === 'salesforce'
                ) {
                    sent.push(event.detail);
                }
                return original.call(this, event);
            });
            return sent;
        }
        const settle = () => flush().then(flush).then(flush).then(flush);

        it('puts the row in props at once and dispatches employeeselect to the app when ready', async () => {
            const el = await setup();
            const sent = captureAppEvents(el);
            const toast = jest.fn();
            el.addEventListener('lightning__showtoast', toast);

            CurrentPageReference.emit(tabState('EMP-007', 'r1'));
            getClients.emit(EMPLOYEES);
            await flush();

            expect(embedding(el).decodedProps.selectedEmployeeId).toBe('EMP-007');
            expect(embedding(el).decodedProps.selectedEmployee).toMatchObject({ id: 'EMP-007', name: 'Grace Patel' });
            expect(embedding(el).decodedProps.selectionRequestId).toBe('r1');
            expect(sent).toHaveLength(0); // app not connected yet

            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();

            expect(sent).toHaveLength(1);
            expect(sent[0]).toMatchObject({
                employeeId: 'EMP-007',
                requestId: 'r1',
                origin: 'salesforce',
                employee: { id: 'EMP-007', name: 'Grace Patel', department: 'HR', salary: 82000 }
            });
            expect(statusText(el)).toBe('Connected · 2 clients shared with the app · Sent Grace Patel');
            // our own dispatch must not be treated as an app → host selection
            expect(toast).not.toHaveBeenCalled();
        });

        it('every new "Start illustration" loads a fresh embedding and sends the row once it is ready', async () => {
            const el = await setup();
            const sent = captureAppEvents(el);
            getClients.emit(EMPLOYEES);
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            const first = embedding(el);

            CurrentPageReference.emit(tabState('EMP-001', 'r2'));
            await settle();
            const second = embedding(el);
            expect(second).not.toBe(first); // app restarted from the start
            expect(second.decodedProps.selectionRequestId).toBe('r2');
            expect(el.shadowRoot.querySelector('[data-id="loading-overlay"]')).not.toBeNull();
            expect(sent).toHaveLength(0); // waits for the new frame
            second.dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            expect(sent.map((d) => d.requestId)).toEqual(['r2']);

            CurrentPageReference.emit(tabState('EMP-001', 'r2')); // tab revisit, same request
            await settle();
            expect(embedding(el)).toBe(second); // not reloaded

            CurrentPageReference.emit(tabState('EMP-007', 'r3')); // clicked again
            await settle();
            const third = embedding(el);
            expect(third).not.toBe(second);
            third.dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            expect(sent.map((d) => d.requestId)).toEqual(['r2', 'r3']);
            expect(third.decodedProps.selectedEmployee.id).toBe('EMP-007');
            expect(statusText(el)).toBe('Connected · 2 clients shared with the app · Sent Grace Patel');
        });

        it('passes the parties chosen in the dialog to the app', async () => {
            const el = await setup();
            const sent = captureAppEvents(el);
            getClients.emit(EMPLOYEES);
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            CurrentPageReference.emit({
                type: 'standard__navItemPage',
                attributes: { apiName: 'Illustration_Embedding' },
                state: {
                    c__employeeId: 'EMP-001',
                    c__secondPartyId: 'EMP-007',
                    c__preparedById: '__none__',
                    c__adviser: 'Kumar, Raj',
                    c__productCode: 'PISA',
                    c__productName: 'Bluedoor Individual Savings Account',
                    c__requestId: 'r9'
                }
            });
            await settle();
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready')); // fresh instance
            await flush();

            expect(sent[0].parties).toMatchObject({
                firstParty: { id: 'EMP-001' },
                secondParty: { id: 'EMP-007', name: 'Grace Patel' },
                preparedBy: null,
                adviser: 'Kumar, Raj',
                product: { code: 'PISA', description: 'Bluedoor Individual Savings Account' }
            });
            expect(embedding(el).decodedProps.selectionParties).toMatchObject({
                secondParty: { id: 'EMP-007' },
                product: { code: 'PISA' }
            });
        });

        it('re-sends the current employee when the app reports appready', async () => {
            const el = await setup();
            const sent = captureAppEvents(el);
            CurrentPageReference.emit(tabState('EMP-007', 'r20'));
            getClients.emit(EMPLOYEES);
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            expect(sent.map((d) => d.requestId)).toEqual(['r20']); // may be dropped by the frame

            embedding(el).dispatchEvent(new CustomEvent('appready', { detail: {} }));
            await flush();
            expect(sent.map((d) => d.requestId)).toEqual(['r20', 'r20']);
            expect(sent[1]).toMatchObject({ employeeId: 'EMP-007', employee: { name: 'Grace Patel' }, origin: 'salesforce' });
        });

        it('appready before the frame-ready event still delivers once', async () => {
            const el = await setup();
            const sent = captureAppEvents(el);
            getClients.emit(EMPLOYEES);
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            await flush();
            embedding(el).dispatchEvent(new CustomEvent('appready', { detail: {} }));
            await flush();
            expect(sent).toHaveLength(0); // nothing selected yet

            CurrentPageReference.emit(tabState('EMP-001', 'r21'));
            await settle();
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready')); // fresh instance
            await flush();
            expect(sent.map((d) => d.requestId)).toEqual(['r21']);
        });

        it('reports an unknown employee id', async () => {
            const el = await setup();
            const sent = captureAppEvents(el);
            getClients.emit(EMPLOYEES);
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            CurrentPageReference.emit(tabState('EMP-999', 'r4'));
            await flush();
            expect(sent).toHaveLength(0);
            expect(el.shadowRoot.querySelector('.slds-alert_warning').textContent).toContain('EMP-999');
        });

        it('ignores pages without tab state', async () => {
            const el = await setup();
            const sent = captureAppEvents(el);
            getClients.emit(EMPLOYEES);
            embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
            CurrentPageReference.emit({ type: 'standard__appPage', attributes: {}, state: {} });
            await flush();
            expect(sent).toHaveLength(0);
            expect(embedding(el).decodedProps.selectedEmployee).toBeNull();
        });
    });

    it('sizes the embedded app to fill the height left in the viewport', async () => {
        const el = await setup();
        await flush();
        // jsdom: frame top = 0, innerHeight = 768 → 768 - 16 bottom reserve
        expect(embedding(el).style.height).toBe(`${window.innerHeight - 16}px`);
        expect(embedding(el).style.width).toBe('100%');

        const original = window.innerHeight;
        window.innerHeight = 300; // smaller than the minimum
        window.dispatchEvent(new CustomEvent('resize'));
        await flush();
        expect(embedding(el).style.height).toBe('360px');
        window.innerHeight = original;
    });

    it('shows a loading overlay until the app connects, and again while reconnecting', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();
        const overlay = () => el.shadowRoot.querySelector('[data-id="loading-overlay"]');
        expect(overlay()).not.toBeNull();
        expect(overlay().querySelector('lightning-spinner')).not.toBeNull();
        expect(overlay().textContent).toContain('Loading illustration…');

        embedding(el).dispatchEvent(new CustomEvent('sf-embedding.component.ready'));
        await flush();
        expect(overlay()).toBeNull();

        embedding(el).dispatchEvent(
            new CustomEvent('sf-embedding.component.error', {
                detail: { code: 'HEARTBEAT_TIMEOUT', message: 'no heartbeat', retryable: true }
            })
        );
        await flush().then(flush).then(flush);
        expect(overlay().textContent).toContain('attempt 2 of 3');
    });

    it('hides the loading overlay when the embedding fails for good', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();
        embedding(el).dispatchEvent(
            new CustomEvent('sf-embedding.component.error', {
                detail: { code: 'SAME_ORIGIN_SRC', message: 'bad src', retryable: false }
            })
        );
        await flush();
        expect(el.shadowRoot.querySelector('[data-id="loading-overlay"]')).toBeNull();
        expect(el.shadowRoot.querySelector('.slds-alert_error')).not.toBeNull();
    });

    it('keeps every prop a primitive (nested values as JSON strings) so it can cross the MessagePort', async () => {
        const el = await setup();
        CurrentPageReference.emit({ state: { c__employeeId: 'EMP-007', c__secondPartyId: 'EMP-001', c__requestId: 'j1' } });
        getClients.emit(EMPLOYEES);
        await flush();
        const props = rawEmbedding(el).props;
        Object.values(props).forEach((v) => expect(v === null || typeof v !== 'object').toBe(true));
        expect(Object.keys(props).sort()).toEqual([
            'employeesJson',
            'locale',
            'selectedEmployeeId',
            'selectedEmployeeJson',
            'selectionPartiesJson',
            'selectionRequestId',
            'source'
        ]);
        expect(JSON.parse(props.selectedEmployeeJson)).toMatchObject({ id: 'EMP-007', name: 'Grace Patel' });
        expect(JSON.parse(props.selectionPartiesJson).secondParty).toMatchObject({ id: 'EMP-001' });
        expect(JSON.parse(props.employeesJson)).toHaveLength(2);
    });

    describe('navigatetab from the app', () => {
        beforeEach(() => resetNavigateCalls());

        it('opens the client list tab by default', async () => {
            const el = await setup();
            embedding(el).dispatchEvent(new CustomEvent('navigatetab', { detail: {} }));
            expect(getNavigateCalls().map((c) => c.pageRef)).toEqual([
                {
                    type: 'standard__navItemPage',
                    attributes: { apiName: 'Client_Illustration' },
                    state: { c__refresh: expect.stringMatching(/^\d+$/) }
                }
            ]);
        });

        it('opens another allowed tab by API name', async () => {
            const el = await setup();
            embedding(el).dispatchEvent(new CustomEvent('navigatetab', { detail: { apiName: 'Illustration_List' } }));
            expect(getNavigateCalls()[0].pageRef.attributes.apiName).toBe('Illustration_List');
        });

        it('opens a left-nav section of the Clients tab for the illustration\'s client', async () => {
            const el = await setup();
            CurrentPageReference.emit({ state: { c__employeeId: 'EMP-007', c__requestId: 'r31' } });
            getClients.emit(EMPLOYEES);
            await flush();
            resetNavigateCalls();
            embedding(el).dispatchEvent(
                new CustomEvent('navigatetab', { detail: { apiName: 'Client_Illustration', section: 'businessManager' } })
            );
            expect(getNavigateCalls()[0].pageRef).toEqual({
                type: 'standard__navItemPage',
                attributes: { apiName: 'Client_Illustration' },
                state: { c__refresh: expect.stringMatching(/^\d+$/), c__section: 'businessManager', c__clientId: 'EMP-007' }
            });
        });

        it('uses the clientId the app sends and drops an invalid section', async () => {
            const el = await setup();
            const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
            embedding(el).dispatchEvent(
                new CustomEvent('navigatetab', { detail: { section: 'businessManager', clientId: 12 } })
            );
            embedding(el).dispatchEvent(new CustomEvent('navigatetab', { detail: { section: '../x' } }));
            expect(getNavigateCalls()[0].pageRef.state).toMatchObject({ c__section: 'businessManager', c__clientId: '12' });
            expect(getNavigateCalls()[1].pageRef.state).toEqual({ c__refresh: expect.stringMatching(/^\d+$/) });
            warn.mockRestore();
        });

        it('ignores tabs that are not allowed', async () => {
            const el = await setup();
            const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
            embedding(el).dispatchEvent(new CustomEvent('navigatetab', { detail: { apiName: 'Setup' } }));
            expect(getNavigateCalls()).toHaveLength(0);
            warn.mockRestore();
        });
    });

    it('renders only the embedding: no card header or visible status line', async () => {
        const el = await setup();
        getClients.emit(EMPLOYEES);
        await flush();
        expect(el.shadowRoot.querySelector('lightning-card')).toBeNull();
        expect(el.shadowRoot.textContent).not.toContain('Employee Illustration');
        expect(el.shadowRoot.querySelector('p[aria-live]').classList).toContain('slds-assistive-text');
        expect(embedding(el).title).toBe('Employee Illustration'); // still the frame's accessible name
    });

    it('shows a configuration error and no embedding when no URL can be resolved', async () => {
        const el = await setup({}); // jsdom host "localhost"
        expect(embedding(el)).toBeNull();
        expect(el.shadowRoot.textContent).toContain('Embedded app URL not configured');
    });
});
