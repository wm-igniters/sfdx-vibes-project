/* global require */
import { createElement } from '@lwc/engine-dom';
import EmployeeDatatable from 'c/employeeDatatable';
import getClients from '@salesforce/apex/ClientController.getClients';
import { getNavigateCalls, resetNavigateCalls } from 'lightning/navigation';

jest.mock(
    '@salesforce/apex/ClientController.getClients',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
        return { default: createApexTestWireAdapter(jest.fn()) };
    },
    { virtual: true }
);

const EMPLOYEES = [
    {
        id: '2', clientId: 2, name: 'Bob Martinez', displayName: 'Mr Bob Martinez', title: 'Mr',
        externalRef: '5000002', dateOfBirth: '1972-01-30', adviserId: 1, adviserName: 'Kumar, Raj'
    },
    {
        id: '1', clientId: 1, name: 'Bmd Sthds', displayName: 'Mr Bmd Sthds', title: 'Mr',
        externalRef: '4984048', dateOfBirth: '1965-08-05', adviserId: 1, adviserName: 'Kumar, Raj'
    }
];

const flush = () => Promise.resolve();

describe('c-employee-datatable', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        resetNavigateCalls();
    });

    async function setup() {
        const el = createElement('c-employee-datatable', { is: EmployeeDatatable });
        document.body.appendChild(el);
        getClients.emit(EMPLOYEES);
        await flush();
        return el;
    }

    const headers = (el) => [...el.shadowRoot.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    const rows = (el) => [...el.shadowRoot.querySelectorAll('tbody tr')];
    const dialog = (el) => el.shadowRoot.querySelector('c-illustration-dialog');
    const createButton = (el, id) => el.shadowRoot.querySelector(`button.dir-btn[data-id="${id}"]`);

    it('shows Client Name, Client Ref, Date of Birth, Adviser and Illustration from the API', async () => {
        const el = await setup();
        expect(headers(el)).toEqual(['Client Name', 'Client Ref', 'Date of Birth', 'Adviser', 'Illustration']);
        const cells = [...rows(el)[1].querySelectorAll('td')].map((td) => td.textContent.trim());
        expect(cells).toEqual(['Mr Bmd Sthds', '4984048', '05 Aug 1965', 'Kumar, Raj', 'Create Illustration']);
    });

    it('shows the API error message', async () => {
        const el = createElement('c-employee-datatable', { is: EmployeeDatatable });
        document.body.appendChild(el);
        getClients.error({ message: 'Client service returned 503 Service Unavailable' });
        await flush();
        expect(el.shadowRoot.querySelector('.dir-error').textContent).toContain('503');
    });

    it('has no table title or header row above the table', async () => {
        const el = await setup();
        expect(el.shadowRoot.querySelector('.dir-toolbar')).toBeNull();
        expect(el.shadowRoot.textContent).not.toContain('Employee directory');
    });

    it('Employee Name is plain text (no click navigation)', async () => {
        const el = await setup();
        expect(rows(el)[0].querySelector('td.dir-name a, td.dir-name button')).toBeNull();
    });

    it('sorts by a column when its header is clicked', async () => {
        const el = await setup();
        el.shadowRoot.querySelector('button.dir-sort[data-field="displayName"]').click();
        await flush();
        expect(rows(el).map((r) => r.querySelector('td').textContent)).toEqual(['Mr Bmd Sthds', 'Mr Bob Martinez']);
        expect(el.shadowRoot.querySelector('th[aria-sort="ascending"]').textContent).toContain('Client Name');
        el.shadowRoot.querySelector('button.dir-sort[data-field="displayName"]').click();
        await flush();
        expect(rows(el)[0].querySelector('td').textContent).toBe('Mr Bob Martinez');
    });

    it('Create Illustration opens the "Select illustration parties" dialog for the row', async () => {
        const el = await setup();
        expect(dialog(el)).toBeNull();
        createButton(el, '1').click();
        await flush();
        expect(dialog(el)).not.toBeNull();
        expect(dialog(el).employee.id).toBe('1');
        expect(dialog(el).employees).toHaveLength(2);
    });

    it('cancel closes the dialog without navigating', async () => {
        const el = await setup();
        createButton(el, '1').click();
        await flush();
        dialog(el).dispatchEvent(new CustomEvent('cancel'));
        await flush();
        expect(dialog(el)).toBeNull();
        expect(getNavigateCalls()).toHaveLength(0);
    });

    it('Start illustration opens the Illustration tab with the selected parties', async () => {
        const el = await setup();
        createButton(el, '1').click();
        await flush();
        dialog(el).dispatchEvent(
            new CustomEvent('start', {
                detail: {
                    firstParty: EMPLOYEES[1],
                    secondParty: EMPLOYEES[0],
                    preparedBy: null,
                    adviser: { id: '005', name: 'Kumar, Raj' }
                }
            })
        );
        await flush();

        expect(dialog(el)).toBeNull();
        const calls = getNavigateCalls();
        expect(calls).toHaveLength(1);
        expect(calls[0].pageRef).toMatchObject({
            type: 'standard__navItemPage',
            attributes: { apiName: 'Illustration_Embedding' },
            state: {
                c__employeeId: '1',
                c__secondPartyId: '2',
                c__preparedById: '__none__',
                c__adviser: 'Kumar, Raj'
            }
        });
        expect(calls[0].pageRef.state.c__requestId).toMatch(/^\d+$/);
    });

    describe('left navigation', () => {
        const navButtons = (el) => [...el.shadowRoot.querySelectorAll('nav button.nav-item')];
        const nav = (el, key) => el.shadowRoot.querySelector(`nav button[data-key="${key}"]`);

        it('lists the sections with "New illustration" active', async () => {
            const el = await setup();
            expect(navButtons(el).map((b) => b.textContent.trim())).toEqual([
                'Client summary',
                'Salesforce',
                'Client tracking',
                'Business manager',
                'CYC manager',
                'New illustration',
                'Suitability letter',
                'Send letter',
                'Record management',
                'Client contact',
                'Client reports'
            ]);
            expect(nav(el, 'newIllustration').getAttribute('aria-current')).toBe('page');
            expect(el.shadowRoot.querySelector('table')).not.toBeNull();
        });

        it('switches to a placeholder section and back to the table', async () => {
            const el = await setup();
            const onNav = jest.fn();
            el.addEventListener('navselect', onNav);

            nav(el, 'clientSummary').click();
            await flush();
            expect(onNav.mock.calls[0][0].detail).toEqual({ key: 'clientSummary', label: 'Client summary' });
            expect(el.shadowRoot.querySelector('table')).toBeNull();
            expect(el.shadowRoot.querySelector('.placeholder').textContent).toContain('Client summary');
            expect(nav(el, 'clientSummary').getAttribute('aria-current')).toBe('page');

            nav(el, 'newIllustration').click();
            await flush();
            expect(el.shadowRoot.querySelector('table')).not.toBeNull();
        });

        it('Salesforce opens Salesforce Home in a new tab', async () => {
            const open = jest.spyOn(window, 'open').mockImplementation(() => null);
            const el = await setup();
            nav(el, 'salesforce').click();
            await flush();
            await flush();
            expect(open).toHaveBeenCalledWith('https://www.example.com', '_blank', 'noopener');
            expect(nav(el, 'newIllustration').getAttribute('aria-current')).toBe('page');
            open.mockRestore();
        });
    });
});
