import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import USER_FIRST_NAME from '@salesforce/schema/User.FirstName';
import USER_LAST_NAME from '@salesforce/schema/User.LastName';
import USER_NAME from '@salesforce/schema/User.Name';

const NOT_INCLUDED = '__none__';
const NOT_INCLUDED_LABEL = '(Not included for illustration)';
const REQUIRED_MESSAGE = 'Complete this field.';

/**
 * c-illustration-dialog — "Select illustration parties"
 *
 * Rendered by c-employee-datatable when "Create Illustration" is clicked.
 *   @api employee   the clicked row (default First party)
 *   @api employees  all rows (party options)
 * Events:
 *   start  → detail { firstParty, secondParty|null, preparedBy|null, adviser: { id, name } }
 *   cancel → dialog dismissed ("Cancel and close" or Esc)
 */
export default class IllustrationDialog extends LightningElement {
    @api employee;
    @api employees = [];

    firstPartyId;
    secondPartyId = NOT_INCLUDED;
    preparedById = '';
    showErrors = false;
    _focused = false;

    @wire(getRecord, { recordId: USER_ID, fields: [USER_FIRST_NAME, USER_LAST_NAME, USER_NAME] })
    currentUser;

    connectedCallback() {
        this.firstPartyId = this.employee?.id;
    }

    renderedCallback() {
        if (this._focused) return;
        const first = this.template.querySelector('[data-field="firstParty"]');
        if (first) {
            this._focused = true;
            first.focus();
        }
    }

    // ─── Options ──────────────────────────────────────────────────────────────

    get _list() {
        return Array.isArray(this.employees) && this.employees.length
            ? this.employees
            : this.employee
              ? [this.employee]
              : [];
    }

    _find(id) {
        return this._list.find((e) => e.id === id) ?? null;
    }

    get firstPartyOptions() {
        return this._list.map((e) => ({ value: e.id, label: e.name, selected: e.id === this.firstPartyId }));
    }

    get secondPartyOptions() {
        return [
            { value: NOT_INCLUDED, label: NOT_INCLUDED_LABEL, selected: this.secondPartyId === NOT_INCLUDED },
            ...this._list
                .filter((e) => e.id !== this.firstPartyId)
                .map((e) => ({ value: e.id, label: e.name, selected: e.id === this.secondPartyId }))
        ];
    }

    /** Prepared by: one of the selected parties, or not included. */
    get preparedByOptions() {
        const parties = [this._find(this.firstPartyId), this._find(this.secondPartyId)].filter(Boolean);
        return [
            { value: '', label: 'Please select', selected: !this.preparedById, placeholder: true },
            { value: NOT_INCLUDED, label: NOT_INCLUDED_LABEL, selected: this.preparedById === NOT_INCLUDED },
            ...parties.map((e) => ({ value: e.id, label: e.name, selected: e.id === this.preparedById }))
        ];
    }

    get adviserName() {
        const data = this.currentUser?.data;
        if (!data) return '';
        const first = getFieldValue(data, USER_FIRST_NAME);
        const last = getFieldValue(data, USER_LAST_NAME);
        return last ? [last, first].filter(Boolean).join(', ') : getFieldValue(data, USER_NAME) ?? '';
    }

    // ─── Validation ───────────────────────────────────────────────────────────

    get firstPartyError() {
        return this.showErrors && !this._find(this.firstPartyId) ? REQUIRED_MESSAGE : '';
    }

    get secondPartyError() {
        return this.showErrors && !this.secondPartyId ? REQUIRED_MESSAGE : '';
    }

    get preparedByError() {
        return this.showErrors && !this.preparedById ? REQUIRED_MESSAGE : '';
    }

    get firstPartyClass() {
        return this.firstPartyError ? 'ill-select ill-select_error' : 'ill-select';
    }

    get secondPartyClass() {
        return this.secondPartyError ? 'ill-select ill-select_error' : 'ill-select';
    }

    get preparedByClass() {
        const base = this.preparedById ? 'ill-select' : 'ill-select ill-select_placeholder';
        return this.preparedByError ? `${base} ill-select_error` : base;
    }

    get isValid() {
        return !!this._find(this.firstPartyId) && !!this.secondPartyId && !!this.preparedById;
    }

    // ─── Handlers ─────────────────────────────────────────────────────────────

    handleChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;
        if (field === 'firstParty') {
            this.firstPartyId = value;
            if (this.secondPartyId === value) this.secondPartyId = NOT_INCLUDED;
        } else if (field === 'secondParty') {
            this.secondPartyId = value;
        } else if (field === 'preparedBy') {
            this.preparedById = value;
        }
        // Prepared by must still be one of the selected parties.
        if (
            this.preparedById &&
            this.preparedById !== NOT_INCLUDED &&
            this.preparedById !== this.firstPartyId &&
            this.preparedById !== this.secondPartyId
        ) {
            this.preparedById = '';
        }
    }

    /** Search button: open the select's option list (focus as a fallback). */
    handleSearch(event) {
        const select = this.template.querySelector(`[data-field="${event.currentTarget.dataset.target}"]`);
        if (!select) return;
        select.focus();
        try {
            select.showPicker?.();
        } catch {
            /* showPicker not allowed/supported — focus is enough */
        }
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleStart() {
        if (!this.isValid) {
            this.showErrors = true;
            const firstInvalid = this.template.querySelector('.ill-select_error select');
            firstInvalid?.focus();
            return;
        }
        const pick = (id) => (id && id !== NOT_INCLUDED ? { ...this._find(id) } : null);
        this.dispatchEvent(
            new CustomEvent('start', {
                detail: {
                    firstParty: pick(this.firstPartyId),
                    secondParty: pick(this.secondPartyId),
                    preparedBy: pick(this.preparedById),
                    adviser: { id: USER_ID, name: this.adviserName }
                }
            })
        );
    }

    /** Esc closes; Tab stays inside the dialog. */
    handleKeydown(event) {
        if (event.key === 'Escape') {
            event.stopPropagation();
            this.handleCancel();
            return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...this.template.querySelectorAll('button, select')].filter((el) => !el.disabled);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = this.template.activeElement;
        if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    }
}
