import { LightningElement, api, track } from 'lwc';
import REACT_APP_RESOURCE from '@salesforce/resourceUrl/EmployeeReactApp';

const EMPLOYEE_SELECTED_EVENT = 'lwc__employeeselected'; // must match datatable

export default class EmployeeReactBridge extends LightningElement {
    /** Override the default static-resource URL with an external React app URL. */
    @api externalAppUrl;

    @track selectedEmployee;

    _boundHandler;

    connectedCallback() {
        this._boundHandler = (event) => this.handleEmployeeSelected(event.detail);
        window.addEventListener(EMPLOYEE_SELECTED_EVENT, this._boundHandler);
    }

    disconnectedCallback() {
        window.removeEventListener(EMPLOYEE_SELECTED_EVENT, this._boundHandler);
        this._boundHandler = null;
    }

    // ─── Event handler ────────────────────────────────────────────────────────

    handleEmployeeSelected(payload) {
        this.selectedEmployee = payload;
        this.postToReactApp(payload);
    }

    // ─── postMessage bridge ───────────────────────────────────────────────────

    postToReactApp(employeeData) {
        const iframe = this.refs.reactIframe;
        if (!iframe) return;

        const targetOrigin = this.externalAppUrl
            ? new URL(this.externalAppUrl).origin
            : window.location.origin; // static resource is same origin

        iframe.contentWindow.postMessage(
            { type: 'EMPLOYEE_SELECTED', payload: employeeData },
            targetOrigin
        );
    }

    // ─── Getters ──────────────────────────────────────────────────────────────

    get reactAppUrl() {
        return this.externalAppUrl || REACT_APP_RESOURCE;
    }
}
