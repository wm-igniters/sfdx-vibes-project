/* global require */
import { createElement } from '@lwc/engine-dom';
import EmployeeDatatable from 'c/employeeDatatable';
import getEmployees from '@salesforce/apex/EmployeeController.getEmployees';
import {
    buildEmployeeAppUrl,
    deriveEmployeeAppUrl,
    encodeEmployeePayload,
    redirectTo
} from '../employeeAppLink';

jest.mock(
    '@salesforce/apex/EmployeeController.getEmployees',
    () => {
        const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
        return { default: createApexTestWireAdapter(jest.fn()) };
    },
    { virtual: true }
);

jest.mock('../employeeAppLink', () => {
    const actual = jest.requireActual('../employeeAppLink');
    return { ...actual, redirectTo: jest.fn() };
});

const EMPLOYEES = [
    {
        id: 'EMP-001',
        name: 'Alice Johnson',
        department: 'Engineering',
        title: 'Senior Engineer',
        email: 'alice.johnson@company.com',
        phone: '555-0101',
        salary: 95000,
        location: 'New York',
        hireDate: '2020-03-15',
        status: 'Active',
        avatarInitials: 'AJ'
    }
];

function decode(encoded) {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    const utf8 = Array.from(bin, (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    return JSON.parse(decodeURIComponent(utf8));
}

const flush = () => Promise.resolve();

describe('employeeAppLink', () => {
    it('derives the UI bundle URL from Lightning hosts', () => {
        expect(deriveEmployeeAppUrl('acme.lightning.force.com')).toBe(
            'https://acme--c.my.salesforce.app/app/c__employeeapp'
        );
        expect(deriveEmployeeAppUrl('orgfarm-1a2b-dev-ed.develop.lightning.force.com')).toBe(
            'https://orgfarm-1a2b-dev-ed--c.develop.my.salesforce.app/app/c__employeeapp'
        );
        expect(deriveEmployeeAppUrl('acme--uat.sandbox.lightning.force.com')).toBe(
            'https://acme--uat--c.sandbox.my.salesforce.app/app/c__employeeapp'
        );
        expect(deriveEmployeeAppUrl('localhost')).toBeNull();
    });

    it('encodes UTF-8 payloads as base64url', () => {
        const payload = { employeeId: 'E1', employeeName: 'Zoë Ångström' };
        const encoded = encodeEmployeePayload(payload);
        expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
        expect(decode(encoded)).toEqual(payload);
    });

    it('appends the payload to an existing URL', () => {
        const url = new URL(
            buildEmployeeAppUrl('https://x--c.my.salesforce.app/app/c__employeeapp', {
                employeeId: 'E1',
                employeeName: 'A B'
            })
        );
        expect(url.pathname).toBe('/app/c__employeeapp');
        expect(decode(url.searchParams.get('employee')).employeeId).toBe('E1');
    });
});

describe('c-employee-datatable', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        jest.clearAllMocks();
    });

    async function setup(props = {}) {
        const element = createElement('c-employee-datatable', { is: EmployeeDatatable });
        Object.assign(element, props);
        document.body.appendChild(element);
        getEmployees.emit(EMPLOYEES);
        await flush();
        return element;
    }

    function clickName(element) {
        const table = element.shadowRoot.querySelector('lightning-datatable');
        table.dispatchEvent(
            new CustomEvent('rowaction', {
                detail: { action: { name: 'selectEmployee' }, row: EMPLOYEES[0] }
            })
        );
    }

    it('redirects to employeeapp with the selected row when a name is clicked', async () => {
        const element = await setup({
            employeeAppUrl: 'https://wm--c.develop.my.salesforce.app/app/c__employeeapp'
        });
        const windowListener = jest.fn();
        window.addEventListener('lwc__employeeselected', windowListener);

        clickName(element);

        expect(redirectTo).toHaveBeenCalledTimes(1);
        const url = new URL(redirectTo.mock.calls[0][0]);
        expect(url.origin).toBe('https://wm--c.develop.my.salesforce.app');
        expect(url.pathname).toBe('/app/c__employeeapp');
        const payload = decode(url.searchParams.get('employee'));
        expect(payload).toMatchObject({
            employeeId: 'EMP-001',
            employeeName: 'Alice Johnson',
            department: 'Engineering',
            salary: 95000,
            status: 'Active',
            source: 'employeeDatatable'
        });
        // still broadcast for in-page subscribers (employeeReactBridge)
        expect(windowListener).toHaveBeenCalledTimes(1);
        window.removeEventListener('lwc__employeeselected', windowListener);
    });

    it('shows an error toast instead of redirecting when no URL can be resolved', async () => {
        const element = await setup(); // jsdom host is "localhost" → cannot derive
        const toast = jest.fn();
        element.addEventListener('lightning__showtoast', toast);

        clickName(element);

        expect(redirectTo).not.toHaveBeenCalled();
        expect(toast).toHaveBeenCalled();
        expect(toast.mock.calls[0][0].detail.variant).toBe('error');
    });
});
