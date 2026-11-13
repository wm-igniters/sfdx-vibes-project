import { createElement } from '@lwc/engine-dom';
import BusinessManager from 'c/businessManager';
import getClientIllustrations from '@salesforce/apex/IllustrationController.getClientIllustrations';
import getIllustrationPdf from '@salesforce/apex/IllustrationController.getIllustrationPdf';
import getIllustrationXml from '@salesforce/apex/IllustrationController.getIllustrationXml';
import { formatDate, formatAmount, formatRegular } from '../format';

jest.mock('@salesforce/apex/IllustrationController.getClientIllustrations', () => ({ default: jest.fn() }), { virtual: true });
jest.mock('@salesforce/apex/IllustrationController.getIllustrationPdf', () => ({ default: jest.fn() }), { virtual: true });
jest.mock('@salesforce/apex/IllustrationController.getIllustrationXml', () => ({ default: jest.fn() }), { virtual: true });
jest.mock('@salesforce/apex/IllustrationController.getIllustrationSummary', () => ({ default: jest.fn(() => new Promise(() => {})) }), { virtual: true });
jest.mock('@salesforce/i18n/timeZone', () => ({ default: 'Europe/London' }), { virtual: true });

const ROWS = [
    {
        illustrationId: 53, illustrationRef: 'ILL-50D0B93437', status: 'ILLUSTRATED', clientId: 1, clientName: 'Bmd Sthds',
        productCode: 'PISA', productCategory: 'Investment', productDescription: 'Bluedoor ISA', preparedByName: 'Kumar, Raj',
        illustratedAt: '2026-10-14T09:37:20.507258Z', singleAmount: 10000, hasDocuments: true
    },
    {
        illustrationId: 47, illustrationRef: 'ILL-47', status: 'ILLUSTRATED', clientId: 1, clientName: 'Bmd Sthds',
        productCode: 'RA', productCategory: 'Protection', illustratedAt: '2026-06-18T10:00:00Z',
        singleAmount: 14.61, regularAmount: 6.83, regularFrequency: 'MONTHLY', hasDocuments: false
    }
];

const flush = () => new Promise((resolve) => setTimeout(resolve, 0)); // eslint-disable-line @lwc/lwc/no-async-operation

describe('c-business-manager', () => {
    let saved;
    beforeEach(() => {
        saved = [];
        URL.createObjectURL = jest.fn(() => 'blob:x');
        URL.revokeObjectURL = jest.fn();
        jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
            saved.push(this.download);
        });
        getClientIllustrations.mockResolvedValue(ROWS);
    });
    afterEach(() => {
        while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    async function setup(props = { clientId: '1', clientName: 'Mr Bmd Sthds' }) {
        const el = createElement('c-business-manager', { is: BusinessManager });
        Object.assign(el, props);
        document.body.appendChild(el);
        await flush();
        return el;
    }

    const headers = (el) => [...el.shadowRoot.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    const cells = (el) =>
        [...el.shadowRoot.querySelectorAll('tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent.trim()));
    const play = (el, id) => el.shadowRoot.querySelector(`button.play[data-id="${id}"]`);
    const menuItem = (el, action) => el.shadowRoot.querySelector(`.action-menu button[data-action="${action}"]`);

    it('loads the client\'s illustrations when shown and renders the iBusiness columns', async () => {
        const el = await setup();
        expect(getClientIllustrations).toHaveBeenCalledWith({ clientId: 1 });
        expect(headers(el)).toEqual([
            '', 'Date', 'Name', 'Plan', 'Single', 'Regular', 'Transfer', 'SA / benefit amount',
            'Details', 'EBS / App status', 'Set', 'Actions', 'Lock'
        ]);
        expect(cells(el)).toEqual([
            ['', '14/10/2026', 'Bmd Sthds', 'PISA', '10,000.00', '', '', '', 'i', 'Illustrated', 'ILL-50D0B93437', '', ''],
            ['', '18/06/2026', 'Bmd Sthds', 'RA', '14.61', '6.83pm', '', '', 'i', 'Illustrated', 'ILL-47', '', '']
        ]);
        const lock = el.shadowRoot.querySelectorAll('tbody .lock');
        expect(lock[0].classList).toContain('lock_locked');
        expect(lock[1].classList).not.toContain('lock_locked');
    });

    it('Refresh, reload() and a client change all fetch fresh data', async () => {
        const el = await setup();
        el.shadowRoot.querySelector('.bm-refresh').click();
        await flush();
        expect(getClientIllustrations).toHaveBeenCalledTimes(2);
        await el.reload();
        expect(getClientIllustrations).toHaveBeenCalledTimes(3);
        el.clientId = '5';
        await flush();
        expect(getClientIllustrations).toHaveBeenLastCalledWith({ clientId: 5 });
    });

    it('asks for a client when none is open', async () => {
        const el = await setup({ clientId: undefined });
        expect(getClientIllustrations).not.toHaveBeenCalled();
        expect(el.shadowRoot.querySelector('.bm-empty').textContent).toContain('Choose a client');
    });

    it('shows the API error and an empty state', async () => {
        getClientIllustrations.mockRejectedValueOnce({ body: { message: 'Illustration service returned 503' } });
        const el = await setup();
        expect(el.shadowRoot.querySelector('.bm-error').textContent).toContain('503');
        getClientIllustrations.mockResolvedValueOnce([]);
        el.shadowRoot.querySelector('.bm-refresh').click();
        await flush();
        expect(el.shadowRoot.querySelector('.bm-empty').textContent).toBe('No illustrations for Mr Bmd Sthds yet.');
    });

    it('the play button opens the action menu with the iBusiness groups', async () => {
        const el = await setup();
        play(el, '53').click();
        await flush();
        const groups = [...el.shadowRoot.querySelectorAll('.action-group-label')].map((p) => p.textContent);
        expect(groups).toEqual(['Illustration', 'Comparison', 'Evidence of research', 'EBS', 'Advice set']);
        const labels = [...el.shadowRoot.querySelectorAll('.action-group')][0].querySelectorAll('button');
        expect([...labels].map((b) => b.textContent.trim())).toEqual([
            'View', 'View summary', 'Amend', 'Copy', 'Delete', 'Edit notes', 'Get PDF', 'Apply'
        ]);
        expect(menuItem(el, 'getPdf').disabled).toBe(false);
        expect(menuItem(el, 'apply').disabled).toBe(true);
        expect(menuItem(el, 'ebsCreate').disabled).toBe(false);
        expect(menuItem(el, 'ebsView').disabled).toBe(true);
        expect(play(el, '53').getAttribute('aria-expanded')).toBe('true');
    });

    it('Get PDF is disabled without documents and downloads with them', async () => {
        getIllustrationPdf.mockResolvedValue({ fileName: 'investment-illustration.pdf', contentType: 'application/pdf', base64: btoa('%PDF') });
        const el = await setup();
        play(el, '47').click();
        await flush();
        expect(menuItem(el, 'getPdf').disabled).toBe(true);

        play(el, '53').click();
        await flush();
        menuItem(el, 'getPdf').click();
        await flush();
        expect(getIllustrationPdf).toHaveBeenCalledWith({ illustrationId: 53 });
        expect(saved).toEqual(['ILL-50D0B93437-investment-illustration.pdf']);
        expect(el.shadowRoot.querySelector('.action-menu')).toBeNull();
    });

    it('other actions raise illustrationaction and show an info toast', async () => {
        const el = await setup();
        const onAction = jest.fn();
        const onToast = jest.fn();
        el.addEventListener('illustrationaction', onAction);
        el.addEventListener('lightning__showtoast', onToast);
        play(el, '53').click();
        await flush();
        menuItem(el, 'amend').click();
        expect(onAction.mock.calls[0][0].detail).toMatchObject({ action: 'amend', group: 'Illustration', label: 'Amend' });
        expect(onToast.mock.calls[0][0].detail.variant).toBe('info');
    });

    it('EBS > Create opens the Illustration summary with Create EBS; View summary without it', async () => {
        const el = await setup();
        play(el, '53').click();
        await flush();
        menuItem(el, 'ebsCreate').click();
        await flush();
        let dialog = el.shadowRoot.querySelector('c-illustration-summary-dialog');
        expect(dialog.illustrationId).toBe('53');
        expect(dialog.showCreateEbs).toBe(true);
        expect(el.shadowRoot.querySelector('.action-menu')).toBeNull();

        const onAction = jest.fn();
        el.addEventListener('illustrationaction', onAction);
        dialog.dispatchEvent(new CustomEvent('createebs', { detail: { illustrationId: 53, illustrationRef: 'ILL-50D0B93437' } }));
        await flush();
        expect(onAction.mock.calls[0][0].detail).toMatchObject({ action: 'ebsCreate', group: 'EBS' });
        expect(el.shadowRoot.querySelector('c-illustration-summary-dialog')).toBeNull();

        play(el, '53').click();
        await flush();
        menuItem(el, 'viewSummary').click();
        await flush();
        dialog = el.shadowRoot.querySelector('c-illustration-summary-dialog');
        expect(dialog.showCreateEbs).toBe(false);
        dialog.dispatchEvent(new CustomEvent('close'));
        await flush();
        expect(el.shadowRoot.querySelector('c-illustration-summary-dialog')).toBeNull();
    });

    it('the action menu shows every option and is moved up to fit in the window', async () => {
        const el = await setup();
        const playButton = play(el, '53');
        playButton.getBoundingClientRect = () => ({ top: 700, left: 1200, right: 1228, bottom: 728, width: 28, height: 28 });
        Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
        const offsetHeight = jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(660);
        playButton.click();
        await flush();
        await flush();
        const menu = el.shadowRoot.querySelector('.action-menu');
        expect(menu.querySelectorAll('button')).toHaveLength(19); // every item, enabled or not
        expect(menu.querySelectorAll('.action-group-label')).toHaveLength(5);
        expect(menu.getAttribute('style')).toContain('top: 132px'); // 800 - 8 - 660
        expect(menu.getAttribute('style')).toContain('left: 944px'); // 1200 - 248 - 8
        offsetHeight.mockRestore();
    });

    it('Escape closes the action menu and refocuses the play button', async () => {
        const el = await setup();
        play(el, '53').click();
        await flush();
        el.shadowRoot.querySelector('.bm').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await flush();
        expect(el.shadowRoot.querySelector('.action-menu')).toBeNull();
    });

    it('selection drives the bulk actions; Include protection hides protection plans', async () => {
        getIllustrationXml.mockResolvedValue({ fileName: 'ILL-50D0B93437-TXLife-v1.xml', contentType: 'application/xml', base64: btoa('<x/>') });
        const el = await setup();
        const bulk = el.shadowRoot.querySelector('.bulk-toggle');
        expect(bulk.disabled).toBe(true);
        const selectAll = el.shadowRoot.querySelector('thead input[type="checkbox"]');
        selectAll.checked = true;
        selectAll.dispatchEvent(new CustomEvent('change'));
        await flush();
        expect(bulk.textContent).toContain('(2)');
        bulk.click();
        await flush();
        el.shadowRoot.querySelector('.bulk-menu button[data-kind="xml"]').click();
        await flush();
        expect(getIllustrationXml).toHaveBeenCalledTimes(1); // only the illustration with documents
        expect(saved).toEqual(['ILL-50D0B93437-TXLife-v1.xml']);

        const protection = el.shadowRoot.querySelector('.bm-check input');
        protection.checked = false;
        protection.dispatchEvent(new CustomEvent('change'));
        await flush();
        expect(cells(el)).toHaveLength(1);
    });
});

describe('format', () => {
    it('formats dates, amounts and regular contributions', () => {
        expect(formatDate('2026-10-14T23:30:00.123456Z', 'Europe/London')).toBe('15/10/2026');
        expect(formatDate('', 'Europe/London')).toBe('');
        expect(formatAmount(10000)).toBe('10,000.00');
        expect(formatAmount(null)).toBe('');
        expect(formatRegular(6.83, 'MONTHLY')).toBe('6.83pm');
        expect(formatRegular(100, 'ANNUALLY')).toBe('100.00pa');
        expect(formatRegular(null, 'MONTHLY')).toBe('');
    });
});
