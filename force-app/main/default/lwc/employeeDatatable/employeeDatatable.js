import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// Clients come from the WaveMaker illustration API (Apex callout via the
// WM_Illustration_API Named Credential). Row shape: { id, name, displayName,
// externalRef, dateOfBirth, adviserName, ... }
import getClients from '@salesforce/apex/ClientController.getClients';

// "Create Illustration" → c-illustration-dialog ("Select illustration parties")
// → "Start illustration" → Lightning tab hosting c-illustration-embedding, which
// sends the employee + parties to the embedded WaveMaker app.
const ILLUSTRATION_TAB = 'Illustration_Embedding';
const NONE = '__none__';

const COLUMNS = [
    { key: 'displayName', label: 'Client Name', sortable: true },
    { key: 'externalRef', label: 'Client Ref', sortable: true },
    { key: 'dateOfBirth', label: 'Date of Birth', sortable: true },
    { key: 'adviserName', label: 'Adviser', sortable: true },
    { key: 'illustration', label: 'Illustration', sortable: false }
];

// Left navigation. "New illustration" hosts the employee table; "Salesforce" opens
// Salesforce Home in a new tab; the other sections are placeholders for now.
const TABLE_SECTION = 'newIllustration';
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

/** ISO yyyy-mm-dd → "05 Aug 1965" (parsed as a local date to avoid a TZ day-shift). */
function formatDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default class EmployeeDatatable extends NavigationMixin(LightningElement) {
    /**
     * @deprecated No longer used (Employee Name navigation was removed). Kept only
     * because Salesforce blocks removing a property while the component is placed
     * on a Lightning page (Employee_by_AgentforceVibes).
     */
    @api employeeAppUrl;
    /** @deprecated See employeeAppUrl. */
    @api openInNewTab = false;

    employees = [];
    activeSection = TABLE_SECTION;
    isLoading = true;
    errorMessage;
    sortBy;
    sortDirection = 'asc';

    /** Row the "Select illustration parties" dialog is open for. */
    dialogEmployee;
    _returnFocusId;

    @wire(getClients)
    wiredClients({ data, error }) {
        this.isLoading = false;
        if (data) {
            this.employees = [...data];
            this.errorMessage = undefined;
            if (this.sortBy) this.sortData(this.sortBy, this.sortDirection);
        } else if (error) {
            this.errorMessage = error.body?.message ?? 'Failed to load clients.';
            this.employees = [];
        }
    }

    renderedCallback() {
        // Return focus to the row's button after the dialog closes.
        if (!this.dialogEmployee && this._returnFocusId) {
            const btn = this.template.querySelector(`button[data-id="${this._returnFocusId}"]`);
            this._returnFocusId = undefined;
            btn?.focus();
        }
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
        this.activeSection = key;
    }

    // ─── View model ───────────────────────────────────────────────────────────

    get columns() {
        return COLUMNS.map((c) => {
            const active = c.sortable && this.sortBy === c.key;
            return {
                ...c,
                ariaSort: c.sortable ? (active ? (this.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none') : undefined,
                sortIcon: active ? (this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown') : null,
                thClass: c.key === 'illustration' ? 'dir-th dir-th_action' : 'dir-th'
            };
        });
    }

    get rows() {
        return this.employees.map((e) => ({
            ...e,
            dobLabel: formatDate(e.dateOfBirth),
            createLabel: `Create illustration for ${e.displayName || e.name}`
        }));
    }

    get hasError() {
        return !!this.errorMessage;
    }

    get employeeCount() {
        return this.employees.length;
    }

    get countLabel() {
        return `${this.employeeCount} employee${this.employeeCount === 1 ? '' : 's'}`;
    }

    // ─── Create Illustration ──────────────────────────────────────────────────

    handleCreateIllustration(event) {
        const id = event.currentTarget.dataset.id;
        this.dialogEmployee = this.employees.find((e) => e.id === id);
        this._returnFocusId = id;
    }

    handleDialogCancel() {
        this.dialogEmployee = undefined;
    }

    /** detail: { firstParty, secondParty, preparedBy, adviser } from c-illustration-dialog */
    handleStartIllustration(event) {
        const { firstParty, secondParty, preparedBy, adviser } = event.detail;
        this.dialogEmployee = undefined;
        this._returnFocusId = undefined;
        this.openIllustration({ firstParty, secondParty, preparedBy, adviser });
    }

    /**
     * Open the Illustration tab. c-illustration-embedding reads the state, loads
     * the rows and sends `employeeselect` (employee + parties) to the WaveMaker app.
     * c__requestId makes every start a new request.
     */
    openIllustration({ firstParty, secondParty, preparedBy, adviser }) {
        const state = {
            c__employeeId: firstParty.id,
            c__secondPartyId: secondParty?.id ?? NONE,
            c__preparedById: preparedBy?.id ?? NONE,
            c__requestId: String(Date.now())
        };
        if (adviser?.name) state.c__adviser = adviser.name;
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: { apiName: ILLUSTRATION_TAB },
            state
        });
    }

    // ─── Sorting ──────────────────────────────────────────────────────────────

    handleSortClick(event) {
        const field = event.currentTarget.dataset.field;
        this.sortDirection = this.sortBy === field && this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.sortBy = field;
        this.sortData(field, this.sortDirection);
    }

    sortData(field, direction) {
        const multiplier = direction === 'asc' ? 1 : -1;
        this.employees = [...this.employees].sort(
            (a, b) => String(a[field] ?? '').localeCompare(String(b[field] ?? '')) * multiplier
        );
    }
}
