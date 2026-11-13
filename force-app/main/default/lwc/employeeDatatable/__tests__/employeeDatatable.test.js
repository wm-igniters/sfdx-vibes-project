/* eslint-disable @lwc/lwc/no-unexpected-wire-adapter-usages -- test drives the wire adapters via emit() */
/* global require */
import { createElement } from '@lwc/engine-dom';
import EmployeeDatatable from 'c/employeeDatatable';
import getClients from '@salesforce/apex/ClientController.getClients';
import getProducts from '@salesforce/apex/ProductsController.getProducts';
import { CurrentPageReference, getNavigateCalls, resetNavigateCalls } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';

jest.mock(
    '@salesforce/apex/ClientController.getClients',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
        return { default: createApexTestWireAdapter(jest.fn()) };
    },
    { virtual: true }
);

jest.mock(
    '@salesforce/apex/ProductsController.getProducts',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
        return { default: createApexTestWireAdapter(jest.fn()) };
    },
    { virtual: true }
);

jest.mock('@salesforce/apex/IllustrationController.getClientIllustrations', () => ({ default: jest.fn(() => Promise.resolve([])) }), {
    virtual: true
});

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

const PRODUCTS = [
    { code: 'PISA', description: 'Bluedoor Individual Savings Account', category: 'Investment', illustrationSource: 'Platform', allowsSecondParty: true },
    { code: 'RA', description: 'Retirement Account', category: 'Pension', illustrationSource: 'Platform', allowsSecondParty: false },
    { code: 'PENSION', description: 'Miscellaneous Pension', category: 'Pension', illustrationSource: 'Miscellaneous', allowsSecondParty: false }
];

const flush = () => Promise.resolve();

describe('c-employee-datatable', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        resetNavigateCalls();
    });

    // The first client (id 2) opens by default; allClients closes it.
    async function setup({ allClients = false } = {}) {
        const el = createElement('c-employee-datatable', { is: EmployeeDatatable });
        document.body.appendChild(el);
        getClients.emit(EMPLOYEES);
        getProducts.emit(PRODUCTS);
        await flush();
        if (allClients) {
            el.shadowRoot.querySelector('.client-close').click();
            await flush();
        }
        return el;
    }

    const headers = (el) => [...el.shadowRoot.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    const rows = (el) => [...el.shadowRoot.querySelectorAll('tbody tr')];
    const dialog = (el) => el.shadowRoot.querySelector('c-illustration-dialog');

    const description = (el, code) => el.shadowRoot.querySelector(`button.dir-link[data-code="${code}"]`);

    describe('New illustration: products', () => {
        it('shows Code, Illustration source, Category and Description from ProductsController', async () => {
            const el = await setup();
            expect(headers(el)).toEqual(['Code', 'Illustration source', 'Category', 'Description']);
            expect(rows(el)).toHaveLength(3);
            const cells = [...rows(el)[0].querySelectorAll('td')].map((td) => td.textContent.trim());
            expect(cells).toEqual(['PISA', 'Platform', 'Investment', 'Bluedoor Individual Savings Account']);
            expect(rows(el)[2].textContent).toContain('Miscellaneous');
            expect(el.shadowRoot.querySelector('.dir-count').textContent).toBe('3 products');
        });

        it('shows the products API error message', async () => {
            const el = createElement('c-employee-datatable', { is: EmployeeDatatable });
            document.body.appendChild(el);
            getClients.emit(EMPLOYEES);
            getProducts.error({ message: 'Product service returned 503 Service Unavailable' });
            await flush();
            expect(el.shadowRoot.querySelector('.dir-error').textContent).toContain('503');
        });

        it('shows an empty state when there are no products', async () => {
            const el = await setup();
            getProducts.emit([]);
            await flush();
            expect(el.shadowRoot.querySelector('table')).toBeNull();
            expect(el.shadowRoot.querySelector('.dir-empty').textContent).toBe('No products available.');
        });

        it('description opens "Select illustration parties" with the opened client prefilled', async () => {
            const el = await setup();
            expect(dialog(el)).toBeNull();
            expect(el.shadowRoot.querySelector('.dir-notice')).toBeNull();
            description(el, 'RA').click();
            await flush();
            expect(dialog(el)).not.toBeNull();
            expect(dialog(el).employee.id).toBe('2');
            expect(dialog(el).employees).toHaveLength(2);
        });

        it('with no client opened the descriptions are disabled and a notice is shown', async () => {
            const el = await setup({ allClients: true });
            expect(el.shadowRoot.querySelector('.dir-notice').textContent).toContain('Choose a client from Clients');
            expect(description(el, 'PISA').disabled).toBe(true);
            description(el, 'PISA').click();
            await flush();
            expect(dialog(el)).toBeNull();
        });

        it('cancel closes the dialog without navigating', async () => {
            const el = await setup();
            description(el, 'PISA').click();
            await flush();
            dialog(el).dispatchEvent(new CustomEvent('cancel'));
            await flush();
            expect(dialog(el)).toBeNull();
            expect(getNavigateCalls()).toHaveLength(0);
        });

        it('Start illustration opens the Illustration tab with the parties and the product', async () => {
            const el = await setup();
            description(el, 'PISA').click();
            await flush();
            dialog(el).dispatchEvent(
                new CustomEvent('start', {
                    detail: {
                        firstParty: EMPLOYEES[0],
                        secondParty: EMPLOYEES[1],
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
                    c__employeeId: '2',
                    c__secondPartyId: '1',
                    c__preparedById: '__none__',
                    c__adviser: 'Kumar, Raj',
                    c__productCode: 'PISA',
                    c__productName: 'Bluedoor Individual Savings Account'
                }
            });
            expect(calls[0].pageRef.state.c__requestId).toMatch(/^\d+$/);
        });

        it('the description follows the client chosen in the header', async () => {
            const el = await setup();
            el.shadowRoot.querySelector('button[data-header="clients"]').click();
            await flush();
            el.shadowRoot.querySelector('.client-menu button[data-id="1"]').click();
            await flush();
            description(el, 'RA').click();
            await flush();
            expect(dialog(el).employee.id).toBe('1');
        });
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

        it('Business manager shows the opened client\'s illustrations and reloads on every visit', async () => {
            const getClientIllustrations = require('@salesforce/apex/IllustrationController.getClientIllustrations').default;
            getClientIllustrations.mockClear();
            const el = await setup(); // first client (id 2) is open
            nav(el, 'businessManager').click();
            await flush();
            const bm = el.shadowRoot.querySelector('c-business-manager');
            expect(bm).not.toBeNull();
            expect(bm.clientId).toBe('2');
            expect(el.shadowRoot.querySelector('table.dir-table')).toBeNull();
            expect(getClientIllustrations).toHaveBeenCalledTimes(1);

            nav(el, 'businessManager').click(); // clicked again while open
            await flush();
            expect(getClientIllustrations).toHaveBeenCalledTimes(2);

            nav(el, 'newIllustration').click();
            await flush();
            nav(el, 'businessManager').click(); // come back
            await flush();
            expect(getClientIllustrations).toHaveBeenCalledTimes(3);
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

    describe('deep link from the Create Illustration tab (c__section / c__clientId)', () => {
        const nav = (el, key) => el.shadowRoot.querySelector(`nav button[data-key="${key}"]`);
        const link = (refresh, extra = {}) =>
            CurrentPageReference.emit({
                type: 'standard__navItemPage',
                attributes: { apiName: 'Client_Illustration' },
                state: { c__section: 'businessManager', c__refresh: refresh, ...extra }
            });

        it('opens Business manager for the requested client', async () => {
            const getClientIllustrations = require('@salesforce/apex/IllustrationController.getClientIllustrations').default;
            getClientIllustrations.mockClear();
            const el = await setup();
            link('100', { c__clientId: '1' });
            await flush();
            expect(nav(el, 'businessManager').getAttribute('aria-current')).toBe('page');
            expect(el.shadowRoot.querySelector('.client-header-title').textContent).toBe('Mr Bmd Sthds');
            expect(el.shadowRoot.querySelector('c-business-manager').clientId).toBe('1');
            expect(getClientIllustrations).toHaveBeenLastCalledWith({ clientId: 1 });
        });

        it('applies the client when the link arrives before the clients load', async () => {
            const el = createElement('c-employee-datatable', { is: EmployeeDatatable });
            document.body.appendChild(el);
            link('101', { c__clientId: '1' });
            getClients.emit(EMPLOYEES);
            getProducts.emit(PRODUCTS);
            await flush();
            expect(el.shadowRoot.querySelector('.client-header-title').textContent).toBe('Mr Bmd Sthds');
            expect(el.shadowRoot.querySelector('c-business-manager').clientId).toBe('1');
        });

        it('reloads Business manager when the same link is followed again', async () => {
            const getClientIllustrations = require('@salesforce/apex/IllustrationController.getClientIllustrations').default;
            await setup();
            link('102', { c__clientId: '2' });
            await flush();
            getClientIllustrations.mockClear();
            link('103', { c__clientId: '2' });
            await flush();
            expect(getClientIllustrations).toHaveBeenCalledTimes(1);
        });

        it('ignores unknown sections and the external Salesforce item', async () => {
            const el = await setup();
            link('104', { c__section: 'nope' });
            await flush();
            link('105', { c__section: 'salesforce' });
            await flush();
            expect(nav(el, 'newIllustration').getAttribute('aria-current')).toBe('page');
        });
    });

    describe('static header and client header', () => {
        const headerButton = (el, key) => el.shadowRoot.querySelector(`button[data-header="${key}"]`);
        const clientOptions = (el) => [...el.shadowRoot.querySelectorAll('.client-menu button.client-option')];
        const clientHeader = (el) => el.shadowRoot.querySelector('.client-header');

        it('shows the logged-in user, title, log out and the main navigation', async () => {
            const el = await setup({ allClients: true });
            getRecord.emit({
                apiName: 'User',
                fields: {
                    FirstName: { value: 'Devak' },
                    LastName: { value: 'Godhandaraman' },
                    Name: { value: 'Devak Godhandaraman' }
                }
            });
            await flush();
            expect(el.shadowRoot.querySelector('.topbar-user').textContent).toContain('You are logged in as Godhandaraman, Devak');
            expect(el.shadowRoot.querySelector('.topbar-title').textContent).toBe('iBusiness');
            expect(el.shadowRoot.querySelector('.topbar-logout').getAttribute('href')).toBe('/secur/logout.jsp');
            expect([...el.shadowRoot.querySelectorAll('button.mainnav-item')].map((b) => b.textContent.trim())).toEqual([
                'Home',
                'Clients',
                'Client contact',
                'Business manager',
                'Advice set status',
                'Workflow manager',
                'Client access'
            ]);
            expect(clientHeader(el).textContent).toContain('No client selected');
        });

        it('opens the first client by default', async () => {
            const el = await setup();
            expect(el.shadowRoot.querySelector('.client-header-title').textContent).toBe('Mr Bob Martinez');

            headerButton(el, 'clients').click();
            await flush();
            expect(el.shadowRoot.querySelector('.client-menu button[data-id="2"]').getAttribute('aria-current')).toBe('true');
        });

        it('after Close client, reloading the clients does not reopen the first one', async () => {
            const el = await setup({ allClients: true });
            getClients.emit([...EMPLOYEES]);
            await flush();
            expect(el.shadowRoot.querySelector('.client-header-title')).toBeNull();
        });

        it('Clients opens a dropdown of the clients from ClientController', async () => {
            const el = await setup();
            expect(el.shadowRoot.querySelector('.client-menu')).toBeNull();
            headerButton(el, 'clients').click();
            await flush();
            expect(headerButton(el, 'clients').getAttribute('aria-expanded')).toBe('true');
            expect(clientOptions(el).map((b) => b.querySelector('.client-option-name').textContent)).toEqual([
                'Mr Bob Martinez',
                'Mr Bmd Sthds'
            ]);
        });

        it('filters the dropdown by name or ref', async () => {
            const el = await setup();
            headerButton(el, 'clients').click();
            await flush();
            const search = el.shadowRoot.querySelector('.client-search');
            search.value = '4984048';
            search.dispatchEvent(new CustomEvent('input'));
            await flush();
            expect(clientOptions(el).map((b) => b.dataset.id)).toEqual(['1']);
            search.value = 'nobody';
            search.dispatchEvent(new CustomEvent('input'));
            await flush();
            expect(el.shadowRoot.querySelector('.client-empty').textContent).toBe('No matching clients.');
        });

        it('selecting a client shows it in the client header; Close client resets', async () => {
            const el = await setup({ allClients: true });
            const handler = jest.fn();
            el.addEventListener('clientselect', handler);
            headerButton(el, 'clients').click();
            await flush();
            el.shadowRoot.querySelector('.client-menu button[data-id="1"]').click();
            await flush();

            expect(el.shadowRoot.querySelector('.client-menu')).toBeNull();
            expect(el.shadowRoot.querySelector('.client-header-title').textContent).toBe('Mr Bmd Sthds');
            expect(handler.mock.calls[0][0].detail.clientId).toBe('1');

            el.shadowRoot.querySelector('.client-close').click();
            await flush();
            expect(el.shadowRoot.querySelector('.client-header-title')).toBeNull();
            expect(rows(el)).toHaveLength(3); // products stay listed
            expect(handler.mock.calls[1][0].detail.clientId).toBeNull();
        });

        it('choosing another client keeps the current left-nav section', async () => {
            const el = await setup();
            el.shadowRoot.querySelector('nav button[data-key="businessManager"]').click();
            await flush();
            headerButton(el, 'clients').click();
            await flush();
            el.shadowRoot.querySelector('.client-menu button[data-id="1"]').click();
            await flush();
            expect(el.shadowRoot.querySelector('nav button[data-key="businessManager"]').getAttribute('aria-current')).toBe('page');
            expect(el.shadowRoot.querySelector('c-business-manager').clientId).toBe('1');
            expect(el.shadowRoot.querySelector('.client-header-title').textContent).toBe('Mr Bmd Sthds');
        });

        it('Escape and an outside click close the dropdown', async () => {
            const el = await setup();
            headerButton(el, 'clients').click();
            await flush();
            el.shadowRoot.querySelector('header').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            await flush();
            expect(el.shadowRoot.querySelector('.client-menu')).toBeNull();

            headerButton(el, 'clients').click();
            await flush();
            document.body.dispatchEvent(new CustomEvent('click', { bubbles: true }));
            await flush();
            expect(el.shadowRoot.querySelector('.client-menu')).toBeNull();
        });

        it('other header items are static and only report the click', async () => {
            const el = await setup();
            const handler = jest.fn();
            el.addEventListener('headernavselect', handler);
            headerButton(el, 'businessManager').click();
            expect(handler.mock.calls[0][0].detail).toEqual({ key: 'businessManager', label: 'Business manager' });
            expect(el.shadowRoot.querySelector('table')).not.toBeNull();
        });
    });
});
