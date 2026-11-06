/* eslint-disable @lwc/lwc/no-unexpected-wire-adapter-usages -- test drives the wire adapter via emit() */
import { createElement } from '@lwc/engine-dom';
import IllustrationDialog from 'c/illustrationDialog';
import { getRecord } from 'lightning/uiRecordApi';

const EMPLOYEES = [
    { id: 'EMP-001', name: 'Alice Johnson', department: 'Engineering', title: 'Senior Engineer' },
    { id: 'EMP-007', name: 'Grace Patel', department: 'HR', title: 'HR Manager' },
    { id: 'EMP-009', name: 'Iris Nakamura', department: 'Engineering', title: 'Staff Engineer' }
];

const USER = {
    apiName: 'User',
    id: '005000000000000000',
    fields: {
        FirstName: { value: 'Devaki' },
        LastName: { value: 'Godhandaraman' },
        Name: { value: 'Devaki Godhandaraman' }
    }
};

const flush = () => Promise.resolve();

describe('c-illustration-dialog', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
    });

    async function setup(employee = EMPLOYEES[1]) {
        const el = createElement('c-illustration-dialog', { is: IllustrationDialog });
        el.employee = employee;
        el.employees = EMPLOYEES;
        document.body.appendChild(el);
        getRecord.emit(USER);
        await flush();
        return el;
    }

    const select = (el, field) => el.shadowRoot.querySelector(`select[data-field="${field}"]`);
    const optionLabels = (el, field) => [...select(el, field).options].map((o) => o.textContent.trim());
    const choose = async (el, field, value) => {
        const s = select(el, field);
        s.value = value;
        s.dispatchEvent(new CustomEvent('change'));
        await flush();
    };
    const start = (el) => el.shadowRoot.querySelector('button.ill-start');

    it('renders the dialog like the design', async () => {
        const el = await setup();
        const root = el.shadowRoot;
        expect(root.querySelector('section[role="dialog"][aria-modal="true"]')).not.toBeNull();
        expect(root.querySelector('.ill-title').textContent).toBe('Select illustration parties');
        expect(root.querySelector('.ill-close').textContent).toContain('Cancel and close');
        expect(start(el).textContent).toContain('Start illustration');
        expect([...root.querySelectorAll('.ill-label')].map((l) => l.textContent)).toEqual([
            'First party*',
            'Second party*',
            'Prepared by*'
        ]);
        expect(root.querySelector('.ill-readonly').value).toBe('Godhandaraman, Devaki');
    });

    it('defaults First party to the clicked row and Second party to "not included"', async () => {
        const el = await setup();
        expect(select(el, 'firstParty').value).toBe('EMP-007');
        expect(optionLabels(el, 'secondParty')).toEqual([
            '(Not included for illustration)',
            'Alice Johnson',
            'Iris Nakamura'
        ]);
        expect(select(el, 'secondParty').value).toBe('__none__');
        expect(optionLabels(el, 'preparedBy')).toEqual([
            'Please select',
            '(Not included for illustration)',
            'Grace Patel'
        ]);
    });

    it('Prepared by offers the selected parties', async () => {
        const el = await setup();
        await choose(el, 'secondParty', 'EMP-009');
        expect(optionLabels(el, 'preparedBy')).toEqual([
            'Please select',
            '(Not included for illustration)',
            'Grace Patel',
            'Iris Nakamura'
        ]);
    });

    it('requires Prepared by before starting', async () => {
        const el = await setup();
        const onStart = jest.fn();
        el.addEventListener('start', onStart);
        start(el).click();
        await flush();
        expect(onStart).not.toHaveBeenCalled();
        expect(el.shadowRoot.textContent).toContain('Complete this field.');
    });

    it('Start illustration emits the selected parties and the adviser', async () => {
        const el = await setup();
        const onStart = jest.fn();
        el.addEventListener('start', onStart);
        await choose(el, 'secondParty', 'EMP-009');
        await choose(el, 'preparedBy', 'EMP-007');
        start(el).click();

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(onStart.mock.calls[0][0].detail).toMatchObject({
            firstParty: { id: 'EMP-007', name: 'Grace Patel' },
            secondParty: { id: 'EMP-009', name: 'Iris Nakamura' },
            preparedBy: { id: 'EMP-007' },
            adviser: { name: 'Godhandaraman, Devaki' }
        });
    });

    it('"(Not included for illustration)" maps to null', async () => {
        const el = await setup();
        const onStart = jest.fn();
        el.addEventListener('start', onStart);
        await choose(el, 'preparedBy', '__none__');
        start(el).click();
        expect(onStart.mock.calls[0][0].detail).toMatchObject({ secondParty: null, preparedBy: null });
    });

    it('Cancel and close / Esc emit cancel', async () => {
        const el = await setup();
        const onCancel = jest.fn();
        el.addEventListener('cancel', onCancel);
        el.shadowRoot.querySelector('.ill-close').click();
        el.shadowRoot
            .querySelector('section')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(onCancel).toHaveBeenCalledTimes(2);
    });
});
