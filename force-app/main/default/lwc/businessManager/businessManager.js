import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import getClientIllustrations from '@salesforce/apex/IllustrationController.getClientIllustrations';
import getIllustrationPdf from '@salesforce/apex/IllustrationController.getIllustrationPdf';
import getIllustrationXml from '@salesforce/apex/IllustrationController.getIllustrationXml';
import { base64ToBlob, saveBlob } from './fileDownload';
import { formatDate, formatAmount, formatRegular } from './format';

/**
 * Row action menu (the play button), as in the iBusiness design.
 * `enabled` is either a boolean or 'documents' (only when a TXLife/PDF exists).
 * Only "Get PDF" is wired today; every other action raises `illustrationaction`.
 */
const ACTION_GROUPS = [
    {
        key: 'illustration',
        label: 'Illustration',
        items: [
            { key: 'view', label: 'View', external: true, enabled: true },
            { key: 'viewSummary', label: 'View summary', enabled: true },
            { key: 'amend', label: 'Amend', enabled: true },
            { key: 'copy', label: 'Copy', enabled: true },
            { key: 'delete', label: 'Delete', enabled: true },
            { key: 'editNotes', label: 'Edit notes', enabled: true },
            { key: 'getPdf', label: 'Get PDF', enabled: 'documents' },
            { key: 'apply', label: 'Apply', enabled: false }
        ]
    },
    {
        key: 'comparison',
        label: 'Comparison',
        items: [
            { key: 'comparisonView', label: 'View', enabled: false },
            { key: 'comparisonPdf', label: 'Get PDF', enabled: false }
        ]
    },
    {
        key: 'evidence',
        label: 'Evidence of research',
        items: [{ key: 'evidenceView', label: 'View', external: true, enabled: false }]
    },
    {
        key: 'ebs',
        label: 'EBS',
        items: [
            { key: 'ebsCreate', label: 'Create', enabled: true },
            { key: 'ebsView', label: 'View', enabled: false },
            { key: 'ebsAmend', label: 'Amend', enabled: false },
            { key: 'ebsDelete', label: 'Delete', enabled: false }
        ]
    },
    {
        key: 'adviceSet',
        label: 'Advice set',
        items: [
            { key: 'adviceSetCreate', label: 'Create', enabled: true },
            { key: 'adviceSetView', label: 'View', enabled: false },
            { key: 'adviceSetTracking', label: 'Tracking', enabled: false },
            { key: 'adviceSetLink', label: 'Link', enabled: true }
        ]
    }
];

const MENU_WIDTH = 248; // px, matches .action-menu width in CSS
const VIEWPORT_GAP = 8; // px kept free around the action menu

const titleCase = (s) => {
    const t = String(s || '').replace(/_/g, ' ').toLowerCase();
    return t.charAt(0).toUpperCase() + t.slice(1);
};

/**
 * c-business-manager
 *
 * One client's illustrations (IllustrationController.getClientIllustrations),
 * styled after the iBusiness Business manager table. Data is reloaded whenever
 * the section is shown (each mount), when the client changes, and on Refresh.
 */
// Create Illustration tab (c-illustration-embedding hosts the WaveMaker app).
const ILLUSTRATION_TAB = 'Illustration_Embedding';

export default class BusinessManager extends NavigationMixin(LightningElement) {
    illustrations = [];
    isLoading = false;
    errorMessage;
    includeProtection = true;
    selectedIds = new Set();
    bulkMenuOpen = false;

    /** Illustration shown in the "Illustration summary" dialog (EBS → Create, View summary). */
    summaryIllustrationId;
    summaryForEbs = false;

    /** Row whose action menu is open, and where to draw it (relative to the host). */
    menuRowId;
    menuStyle = '';

    _clientId;
    _requestNo = 0;
    _outsideClick;
    _closeOnViewportChange;
    /** Where the play button was when the menu opened (viewport coordinates). */
    _menuAnchor;
    _placeMenu = false;

    /** The client opened in the header (ClientController id, a string). */
    @api
    get clientId() {
        return this._clientId;
    }
    set clientId(value) {
        const changed = value !== this._clientId;
        this._clientId = value;
        if (changed && this._connected) this.reload();
    }

    @api clientName;

    connectedCallback() {
        this._connected = true;
        this._outsideClick = (event) => {
            if ((this.menuRowId || this.bulkMenuOpen) && !event.composedPath().includes(this.template.host)) {
                this.closeMenus();
            }
        };
        document.addEventListener('click', this._outsideClick);
        // The action menu is fixed to the viewport, so close it when the page scrolls or resizes.
        this._closeOnViewportChange = (event) => {
            if (!this.menuRowId) return;
            const menu = this.template.querySelector('.action-menu');
            if (event.type === 'scroll' && menu && event.composedPath().includes(menu)) return;
            this.closeMenus();
        };
        window.addEventListener('scroll', this._closeOnViewportChange, true);
        window.addEventListener('resize', this._closeOnViewportChange);
        this.reload();
    }

    renderedCallback() {
        if (this._placeMenu) this.placeMenu();
    }

    disconnectedCallback() {
        this._connected = false;
        document.removeEventListener('click', this._outsideClick);
        window.removeEventListener('scroll', this._closeOnViewportChange, true);
        window.removeEventListener('resize', this._closeOnViewportChange);
    }

    // ─── Data ─────────────────────────────────────────────────────────────────

    /** Fetch fresh rows (also called by c-employee-datatable when the section is re-selected). */
    @api
    async reload() {
        this.closeMenus();
        this.selectedIds = new Set();
        if (!this._clientId) {
            this.illustrations = [];
            this.errorMessage = undefined;
            this.isLoading = false;
            return;
        }
        const requestNo = ++this._requestNo;
        this.isLoading = true;
        this.errorMessage = undefined;
        try {
            const data = await getClientIllustrations({ clientId: Number(this._clientId) });
            if (requestNo !== this._requestNo) return; // a newer load is under way
            this.illustrations = data ?? [];
        } catch (error) {
            if (requestNo !== this._requestNo) return;
            this.illustrations = [];
            this.errorMessage = error?.body?.message ?? error?.message ?? 'Failed to load illustrations.';
        } finally {
            if (requestNo === this._requestNo) this.isLoading = false;
        }
    }

    handleRefresh() {
        this.reload();
    }

    handleIncludeProtection(event) {
        this.includeProtection = event.target.checked;
    }

    // ─── View model ───────────────────────────────────────────────────────────

    get hasClient() {
        return !!this._clientId;
    }

    get hasError() {
        return !!this.errorMessage;
    }

    get visibleIllustrations() {
        return this.includeProtection
            ? this.illustrations
            : this.illustrations.filter((i) => String(i.productCategory || '').toLowerCase() !== 'protection');
    }

    get rows() {
        return this.visibleIllustrations.map((ill) => {
            const id = String(ill.illustrationId);
            const selected = this.selectedIds.has(id);
            const locked = !!ill.hasDocuments;
            const ref = ill.illustrationRef || id;
            const info = [
                ill.illustrationRef && `Ref ${ill.illustrationRef}`,
                ill.productDescription,
                ill.status && titleCase(ill.status),
                ill.preparedByName && `Prepared by ${ill.preparedByName}`,
                ill.taxYear && `Tax year ${ill.taxYear}`
            ]
                .filter(Boolean)
                .join(' · ');
            return {
                id,
                selected,
                rowClass: [selected ? 'row_selected' : '', this.menuRowId === id ? 'row_active' : ''].join(' ').trim(),
                dateLabel: formatDate(ill.illustratedAt || ill.createdAt, TIME_ZONE),
                clientName: ill.clientName,
                plan: ill.productCode || '',
                single: formatAmount(ill.singleAmount),
                regular: formatRegular(ill.regularAmount, ill.regularFrequency),
                transfer: formatAmount(ill.transferAmount),
                info: info || 'Illustration',
                status: titleCase(ill.status),
                setRef: ill.illustrationRef || '',
                selectLabel: `Select illustration ${ref}`,
                actionsLabel: `Actions for illustration ${ref}`,
                menuExpanded: String(this.menuRowId === id),
                lockIcon: locked ? 'utility:lock' : 'utility:unlock',
                lockClass: locked ? 'lock lock_locked' : 'lock',
                lockLabel: locked ? 'Illustrated: documents stored' : 'Not yet illustrated'
            };
        });
    }

    get isEmpty() {
        return !this.isLoading && !this.hasError && this.hasClient && this.visibleIllustrations.length === 0;
    }

    get emptyText() {
        return `No illustrations for ${this.clientName || 'this client'} yet.`;
    }

    get allSelected() {
        const rows = this.visibleIllustrations;
        return rows.length > 0 && rows.every((i) => this.selectedIds.has(String(i.illustrationId)));
    }

    get noneSelected() {
        return this.selectedIds.size === 0;
    }

    get bulkExpanded() {
        return String(this.bulkMenuOpen);
    }

    get bulkLabel() {
        return this.noneSelected ? 'Selected illustrations actions' : `Selected illustrations actions (${this.selectedIds.size})`;
    }

    // ─── Selection ────────────────────────────────────────────────────────────

    handleSelectRow(event) {
        const id = event.target.dataset.id;
        const next = new Set(this.selectedIds);
        if (event.target.checked) next.add(id);
        else next.delete(id);
        this.selectedIds = next;
    }

    handleSelectAll(event) {
        this.selectedIds = event.target.checked
            ? new Set(this.visibleIllustrations.map((i) => String(i.illustrationId)))
            : new Set();
    }

    handleBulkToggle() {
        if (this.noneSelected) return;
        this.menuRowId = undefined;
        this.bulkMenuOpen = !this.bulkMenuOpen;
    }

    async handleBulkAction(event) {
        const kind = event.currentTarget.dataset.kind;
        this.bulkMenuOpen = false;
        const targets = this.illustrations.filter((i) => this.selectedIds.has(String(i.illustrationId)));
        const withDocs = targets.filter((i) => i.hasDocuments);
        if (withDocs.length < targets.length) {
            this.toast(
                'Some files skipped',
                `${targets.length - withDocs.length} selected illustration(s) have no ${kind.toUpperCase()} yet.`,
                'warning'
            );
        }
        for (const ill of withDocs) {
            // eslint-disable-next-line no-await-in-loop
            await this.download(kind, ill);
        }
    }

    // ─── Row action menu ──────────────────────────────────────────────────────

    get menuGroups() {
        const ill = this.illustrations.find((i) => String(i.illustrationId) === this.menuRowId);
        if (!ill) return [];
        return ACTION_GROUPS.map((group) => ({
            ...group,
            items: group.items.map((item) => {
                const enabled = item.enabled === 'documents' ? !!ill.hasDocuments : item.enabled;
                return { ...item, disabled: !enabled, className: enabled ? 'action-item' : 'action-item action-item_disabled' };
            })
        }));
    }

    menuPosition(top, left) {
        return `top: ${Math.round(top)}px; left: ${Math.round(left)}px; width: ${MENU_WIDTH}px;`;
    }

    /** Shift the opened menu up/left as needed so every option is visible. */
    placeMenu() {
        this._placeMenu = false;
        const menu = this.template.querySelector('.action-menu');
        if (!menu || !this._menuAnchor) return;
        const height = menu.offsetHeight;
        const maxTop = window.innerHeight - height - VIEWPORT_GAP;
        const top = Math.max(VIEWPORT_GAP, Math.min(this._menuAnchor.top - 12, maxTop));
        const left = Math.max(VIEWPORT_GAP, this._menuAnchor.left - MENU_WIDTH - VIEWPORT_GAP);
        const style = this.menuPosition(top, left);
        if (style !== this.menuStyle) this.menuStyle = style;
    }

    get menuIllustrationLabel() {
        const ill = this.illustrations.find((i) => String(i.illustrationId) === this.menuRowId);
        return ill ? `Actions for ${ill.illustrationRef || ill.illustrationId}` : 'Actions';
    }

    handleOpenActions(event) {
        event.stopPropagation();
        const id = event.currentTarget.dataset.id;
        if (this.menuRowId === id) {
            this.closeMenus();
            return;
        }
        // The menu is fixed to the viewport (so no container can clip it) and drawn to
        // the left of the play button; placeMenu() then keeps all of it on screen.
        const r = event.currentTarget.getBoundingClientRect();
        this._menuAnchor = { top: r.top, left: r.left };
        this.menuStyle = this.menuPosition(r.top - 12, r.left - MENU_WIDTH - VIEWPORT_GAP);
        this._placeMenu = true;
        this.bulkMenuOpen = false;
        this.menuRowId = id;
    }

    async handleAction(event) {
        const action = event.currentTarget.dataset.action;
        const ill = this.illustrations.find((i) => String(i.illustrationId) === this.menuRowId);
        this.closeMenus();
        if (!ill) return;
        if (action === 'getPdf') {
            await this.download('pdf', ill);
            return;
        }
        if (action === 'ebsCreate' || action === 'viewSummary') {
            this.summaryForEbs = action === 'ebsCreate';
            this.summaryIllustrationId = String(ill.illustrationId);
            return;
        }
        const item = ACTION_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label }))).find((i) => i.key === action);
        this.dispatchEvent(
            new CustomEvent('illustrationaction', {
                detail: { action, group: item?.group, label: item?.label, illustration: { ...ill } }
            })
        );
        this.toast(`${item?.group}: ${item?.label}`, `This action isn't connected yet for ${ill.illustrationRef}.`, 'info');
    }

    // ─── Illustration summary dialog ──────────────────────────────────────────

    get showSummary() {
        return !!this.summaryIllustrationId;
    }

    handleSummaryClose() {
        const id = this.summaryIllustrationId;
        this.summaryIllustrationId = undefined;
        Promise.resolve().then(() => this.template.querySelector(`button.play[data-id="${id}"]`)?.focus());
    }

    /**
     * Footer "Create EBS" succeeded (the dialog created the submission):
     * detail { illustrationId, illustrationRef, clientName, submission }.
     * Open the Create Illustration tab; c-illustration-embedding sends the whole
     * submission response to the WaveMaker app as the `createEBS` event.
     */
    handleCreateEbs(event) {
        const detail = event.detail ?? {};
        const ill = this.illustrations.find((i) => String(i.illustrationId) === this.summaryIllustrationId);
        this.dispatchEvent(
            new CustomEvent('illustrationaction', {
                detail: { action: 'ebsCreate', group: 'EBS', label: 'Create', illustration: ill ? { ...ill } : { ...detail } }
            })
        );
        this.summaryIllustrationId = undefined;
        const ref = detail.submission?.submissionRef;
        this.toast('EBS created', ref ? `${ref} for ${detail.illustrationRef ?? 'the illustration'}.` : 'Opening the EBS…', 'success');

        const state = {
            c__ebsRequestId: String(Date.now()),
            c__ebsSubmission: JSON.stringify(detail.submission ?? null),
            c__illustrationId: String(detail.illustrationId ?? ill?.illustrationId ?? '')
        };
        if (this.clientId != null && this.clientId !== '') state.c__clientId = String(this.clientId);
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: { apiName: ILLUSTRATION_TAB },
            state
        });
    }

    handleKeydown(event) {
        if (event.key === 'Escape' && (this.menuRowId || this.bulkMenuOpen)) {
            const id = this.menuRowId;
            this.closeMenus();
            if (id) this.template.querySelector(`button.play[data-id="${id}"]`)?.focus();
        }
    }

    closeMenus() {
        this.menuRowId = undefined;
        this.bulkMenuOpen = false;
    }

    // ─── Downloads ────────────────────────────────────────────────────────────

    async download(kind, ill) {
        const fetchFile = kind === 'pdf' ? getIllustrationPdf : getIllustrationXml;
        try {
            const file = await fetchFile({ illustrationId: ill.illustrationId });
            if (!file?.base64) throw new Error(`The ${kind.toUpperCase()} is empty.`);
            const ref = ill.illustrationRef || `illustration-${ill.illustrationId}`;
            let name = file.fileName || `${ref}.${kind}`;
            if (kind === 'pdf' && !name.startsWith(ref)) name = `${ref}-${name}`;
            const type = kind === 'pdf' ? file.contentType || 'application/pdf' : 'application/octet-stream';
            saveBlob(base64ToBlob(file.base64, type), name, this.refs?.downloads);
        } catch (error) {
            this.toast(`${kind.toUpperCase()} download failed`, error?.body?.message ?? error?.message ?? 'Unknown error', 'error');
        }
    }

    toast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
