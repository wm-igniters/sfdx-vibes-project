import { createElement } from '@lwc/engine-dom';
import IllustrationSummaryDialog from 'c/illustrationSummaryDialog';
import getIllustrationSummary from '@salesforce/apex/IllustrationController.getIllustrationSummary';
import getIllustrationPdf from '@salesforce/apex/IllustrationController.getIllustrationPdf';
import createSubmission from '@salesforce/apex/IllustrationController.createSubmission';
import { investmentTable, fundTable, contributionLabel, sentenceCase } from '../summaryModel';

jest.mock('@salesforce/apex/IllustrationController.getIllustrationSummary', () => ({ default: jest.fn() }), { virtual: true });
jest.mock('@salesforce/apex/IllustrationController.getIllustrationPdf', () => ({ default: jest.fn() }), { virtual: true });
jest.mock('@salesforce/apex/IllustrationController.createSubmission', () => ({ default: jest.fn() }), { virtual: true });
jest.mock('@salesforce/i18n/timeZone', () => ({ default: 'Europe/London' }), { virtual: true });

const CHARGES = [
    ['INITIAL_ADVICE_CHARGE', 'Initial Advice Charge', 3],
    ['ONGOING_ADVICE_CHARGE', 'Ongoing Advice Charge', 0.8],
    ['PRODUCT_CHARGE', 'Product Charge', 0.27],
    ['INITIAL_ADVICE_FEE', 'Initial Advice Fee', 2],
    ['CREDIT', 'Credit', 2],
    ['ONGOING_ADVICE_FEE', 'Ongoing Advice Fee', 0.55]
].map(([chargeTypeCode, displayName, appliedRatePct]) => ({ chargeTypeCode, displayName, appliedRatePct }));

const SUMMARY = {
    illustrationId: 69,
    illustrationRef: 'ILL-94A090EFA4',
    productDescription: 'Bluedoor Individual Savings Account',
    clientName: 'Bmd Sthds',
    illustrationDate: '2026-10-14T09:37:20.507258Z',
    hasDocuments: true,
    contributions: [
        {
            contributionId: 67,
            contributionType: 'SINGLE',
            grossAmount: 10000,
            contributors: [{ contributorType: 'ACCOUNT_OWNER', contributorName: 'Bmd Sthds', amount: 10000 }],
            charges: CHARGES,
            allocations: [{ fundCode: 'POL1', fundName: 'Polaris 1', shareClass: 'ACCUMULATION', allocationPct: 100 }],
            allocationTotalPct: 100
        }
    ]
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0)); // eslint-disable-line @lwc/lwc/no-async-operation

describe('c-illustration-summary-dialog', () => {
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        jest.clearAllMocks();
    });

    async function setup(props = { illustrationId: '69', showCreateEbs: true }) {
        const el = createElement('c-illustration-summary-dialog', { is: IllustrationSummaryDialog });
        Object.assign(el, props);
        document.body.appendChild(el);
        await flush();
        return el;
    }

    const tables = (el) => [...el.shadowRoot.querySelectorAll('table.sum-table')];
    const headRows = (table) => [...table.querySelectorAll('thead tr')].map((tr) => [...tr.children].map((c) => c.textContent.trim()));
    const bodyRows = (table) => [...table.querySelectorAll('tbody tr')].map((tr) => [...tr.children].map((c) => c.textContent.trim()));

    it('loads the summary and shows the header facts', async () => {
        getIllustrationSummary.mockResolvedValue(SUMMARY);
        const el = await setup();
        expect(getIllustrationSummary).toHaveBeenCalledWith({ illustrationId: 69 });
        expect(el.shadowRoot.querySelector('.sum-title').textContent).toBe('Illustration summary');
        expect(el.shadowRoot.querySelector('.sum-product').textContent).toBe('Bluedoor Individual Savings Account');
        const facts = el.shadowRoot.querySelector('.sum-facts').textContent;
        expect(facts).toContain('Illustration ID:69');
        expect(facts).toContain('Client name:Bmd Sthds');
        expect(facts).toContain('Illustration date:14/10/2026');
    });

    it('renders Investment details and Fund selection as in the design', async () => {
        getIllustrationSummary.mockResolvedValue(SUMMARY);
        const el = await setup();
        const [investment, funds] = tables(el);
        expect(headRows(investment)).toEqual([
            ['Contribution(s)', 'Charges and fees'],
            ['Initial advice charge', 'Ongoing advice charge', 'Product charge', 'Initial advice fee', 'Credit', 'Ongoing advice fee']
        ]);
        expect(bodyRows(investment)).toEqual([['Single: £10,000.00Account owner', '3.00%', '0.80%', '0.27%', '2.00%', '2.00%', '0.55%']]);
        expect(headRows(funds)).toEqual([
            ['Funds selected', 'Single', 'Regular', 'Transfer'],
            ['Income', 'Accumulation', 'Income', 'Accumulation', 'Income', 'Accumulation']
        ]);
        expect(bodyRows(funds)).toEqual([
            ['Polaris 1', '', '100.0%', '', '', '', ''],
            ['Total:', '100.0%', '', '']
        ]);
    });

    const SUBMISSION = { submissionId: 3, submissionRef: 'SUB-1', illustrationId: 69, status: 'DRAFT', currentScreen: 'account-owner' };

    it('Create EBS creates a submission and raises createebs with the whole response', async () => {
        getIllustrationSummary.mockResolvedValue(SUMMARY);
        let resolve;
        createSubmission.mockReturnValue(new Promise((r) => (resolve = r)));
        const el = await setup();
        const onEbs = jest.fn();
        el.addEventListener('createebs', onEbs);

        const button = el.shadowRoot.querySelector('.sum-primary');
        button.click();
        await flush();
        expect(createSubmission).toHaveBeenCalledWith({ illustrationId: 69 });
        expect(button.textContent.trim()).toBe('Creating EBS…');
        expect(button.disabled).toBe(true);
        button.click(); // ignored while busy
        expect(createSubmission).toHaveBeenCalledTimes(1);

        resolve(JSON.stringify(SUBMISSION));
        await flush();
        expect(onEbs).toHaveBeenCalledTimes(1);
        expect(onEbs.mock.calls[0][0].detail).toEqual({
            illustrationId: 69,
            illustrationRef: 'ILL-94A090EFA4',
            clientName: SUMMARY.clientName,
            submission: SUBMISSION
        });
    });

    it('Create EBS shows the API error and stays open', async () => {
        getIllustrationSummary.mockResolvedValue(SUMMARY);
        createSubmission.mockRejectedValue({ body: { message: 'Could not create the EBS: A draft submission already exists.' } });
        const el = await setup();
        const onEbs = jest.fn();
        el.addEventListener('createebs', onEbs);
        el.shadowRoot.querySelector('.sum-primary').click();
        await flush();
        expect(onEbs).not.toHaveBeenCalled();
        expect(el.shadowRoot.querySelector('.sum-ebs-error').textContent).toContain('already exists');
        expect(el.shadowRoot.querySelector('.sum-primary').disabled).toBe(false);
    });

    it('Cancel and close and Escape raise close', async () => {
        getIllustrationSummary.mockResolvedValue(SUMMARY);
        const el = await setup();
        const onClose = jest.fn();
        el.addEventListener('close', onClose);
        el.shadowRoot.querySelector('.sum-close').click();
        el.shadowRoot.querySelector('section').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('hides Create EBS for View summary and shows load errors', async () => {
        getIllustrationSummary.mockRejectedValue({ body: { message: 'Illustration 5 was not found.' } });
        const el = await setup({ illustrationId: '5', showCreateEbs: false });
        expect(el.shadowRoot.querySelector('.sum-primary')).toBeNull();
        expect(el.shadowRoot.querySelector('.sum-error').textContent).toBe('Illustration 5 was not found.');
    });

    it('Print opens the PDF in a new tab, and is disabled without documents', async () => {
        getIllustrationSummary.mockResolvedValue(SUMMARY);
        getIllustrationPdf.mockResolvedValue({ base64: btoa('%PDF'), contentType: 'application/pdf' });
        URL.createObjectURL = jest.fn(() => 'blob:pdf');
        URL.revokeObjectURL = jest.fn();
        const open = jest.spyOn(window, 'open').mockImplementation(() => null);
        const el = await setup();
        el.shadowRoot.querySelector('.sum-print').click();
        await flush();
        expect(getIllustrationPdf).toHaveBeenCalledWith({ illustrationId: 69 });
        expect(open).toHaveBeenCalledWith('blob:pdf', '_blank', 'noopener');
        open.mockRestore();

        getIllustrationSummary.mockResolvedValue({ ...SUMMARY, hasDocuments: false });
        const el2 = await setup();
        expect(el2.shadowRoot.querySelector('.sum-print').disabled).toBe(true);
    });
});

describe('summaryModel', () => {
    it('labels contributions and handles several types', () => {
        expect(sentenceCase('ACCOUNT_OWNER')).toBe('Account owner');
        expect(contributionLabel({ contributionType: 'REGULAR', grossAmount: 250, frequency: 'MONTHLY' })).toBe('Regular: £250.00 monthly');
        expect(contributionLabel({ contributionType: 'TRANSFER', grossAmount: null, transferValue: 40000 })).toBe('Transfer: £40,000.00');
        const summary = {
            contributions: [
                { contributionType: 'SINGLE', grossAmount: 1, charges: [{ chargeTypeCode: 'A', displayName: 'A', appliedRatePct: 1 }],
                  allocations: [{ fundCode: 'F1', fundName: 'Fund 1', shareClass: 'INCOME', allocationPct: 40 }, { fundCode: 'F2', fundName: 'Fund 2', shareClass: 'ACCUMULATION', allocationPct: 60 }] },
                { contributionType: 'REGULAR', grossAmount: 2, charges: [{ chargeTypeCode: 'B', displayName: 'B', appliedRatePct: 2 }],
                  allocations: [{ fundCode: 'F1', fundName: 'Fund 1', shareClass: 'ACCUMULATION', allocationPct: 100 }] }
            ]
        };
        expect(investmentTable(summary).columns.map((c) => c.key)).toEqual(['A', 'B']);
        expect(investmentTable(summary).rows[1].cells.map((c) => c.value)).toEqual(['', '2.00%']);
        const f = fundTable(summary);
        expect(f.rows.map((r) => r.cells.map((c) => c.value))).toEqual([
            ['40.0%', '', '', '100.0%', '', ''],
            ['', '60.0%', '', '', '', '']
        ]);
        expect(f.totalCells.map((c) => c.value)).toEqual(['100.0%', '100.0%', '']);
    });
});
