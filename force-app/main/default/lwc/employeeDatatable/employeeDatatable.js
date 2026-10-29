import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getEmployees from '@salesforce/apex/EmployeeController.getEmployees';
import { buildEmployeeAppUrl, deriveEmployeeAppUrl, redirectTo } from './employeeAppLink';

const EMPLOYEE_SELECTED_EVENT = 'lwc__employeeselected'; // window-level event name

const COLUMNS = [
    {
        label: 'Employee Name',
        fieldName: 'name',
        type: 'button',
        typeAttributes: {
            label: { fieldName: 'name' },
            name: 'selectEmployee',
            variant: 'base',
            iconName: 'utility:user',
            iconPosition: 'left'
        },
        sortable: true,
        initialWidth: 200
    },
    {
        label: 'Department',
        fieldName: 'department',
        type: 'text',
        sortable: true,
        initialWidth: 150
    },
    {
        label: 'Title',
        fieldName: 'title',
        type: 'text',
        sortable: true
    },
    {
        label: 'Email',
        fieldName: 'email',
        type: 'email'
    },
    {
        label: 'Phone',
        fieldName: 'phone',
        type: 'phone',
        initialWidth: 140
    },
    {
        label: 'Salary',
        fieldName: 'salary',
        type: 'currency',
        typeAttributes: { currencyCode: 'USD', minimumFractionDigits: 0 },
        sortable: true,
        initialWidth: 130,
        cellAttributes: { alignment: 'right' }
    },
    {
        label: 'Location',
        fieldName: 'location',
        type: 'text',
        sortable: true,
        initialWidth: 140
    },
    {
        label: 'Hire Date',
        fieldName: 'hireDate',
        type: 'date',
        typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' },
        sortable: true,
        initialWidth: 130
    },
    {
        label: 'Status',
        fieldName: 'status',
        type: 'text',
        initialWidth: 100,
        cellAttributes: {
            class: { fieldName: 'statusClass' }
        }
    }
];

export default class EmployeeDatatable extends NavigationMixin(LightningElement) {
    /** Optional override of the employeeapp URL (App Builder property). */
    @api employeeAppUrl;
    /** Open employeeapp in a new tab instead of redirecting the current tab. */
    @api openInNewTab = false;

    @track employees = [];
    @track selectedEmployee;

    columns = COLUMNS;
    isLoading = true;
    errorMessage;
    sortBy;
    sortDirection = 'asc';
    _rawEmployees = [];

    @wire(getEmployees)
    wiredEmployees({ data, error }) {
        this.isLoading = false;
        if (data) {
            this._rawEmployees = data.map(emp => ({
                ...emp,
                statusClass: emp.status === 'Active' ? 'status-active' : 'status-leave'
            }));
            this.employees = [...this._rawEmployees];
            this.errorMessage = undefined;
        } else if (error) {
            this.errorMessage = error.body?.message ?? 'Failed to load employees.';
            this.employees = [];
        }
    }

    // ─── Row Action ───────────────────────────────────────────────────────────

    handleRowAction(event) {
        if (event.detail.action.name === 'selectEmployee') {
            const row = event.detail.row;
            this.selectedEmployee = row;
            this.publishSelection(row);
        }
    }

    publishSelection(employee) {
        const payload = {
            employeeId:     employee.id,
            employeeName:   employee.name,
            department:     employee.department,
            title:          employee.title,
            email:          employee.email,
            phone:          employee.phone,
            salary:         employee.salary,
            location:       employee.location,
            hireDate:       employee.hireDate,
            status:         employee.status,
            avatarInitials: employee.avatarInitials,
            source:         'employeeDatatable',
            timestamp:      Date.now()
        };

        // Broadcast on window so sibling components (including employeeReactBridge)
        // can listen across shadow DOM boundaries without needing LMS metadata.
        window.dispatchEvent(
            new CustomEvent(EMPLOYEE_SELECTED_EVENT, { detail: payload })
        );

        // Also bubble within the LWC tree for parent components
        this.dispatchEvent(
            new CustomEvent('employeeselected', {
                detail: { employee: payload },
                bubbles: true,
                composed: true
            })
        );

        this.openEmployeeApp(payload);
    }

    // ─── Redirect to employeeapp ──────────────────────────────────────────────

    get resolvedEmployeeAppUrl() {
        return (this.employeeAppUrl && this.employeeAppUrl.trim()) ||
            deriveEmployeeAppUrl(window.location.hostname);
    }

    openEmployeeApp(payload) {
        const baseUrl = this.resolvedEmployeeAppUrl;
        let url;
        try {
            url = baseUrl && buildEmployeeAppUrl(baseUrl, payload);
        } catch {
            url = null; // malformed employeeAppUrl
        }

        if (!url) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Employee App URL not configured',
                    message: 'Set the "Employee App URL" property on this component in Lightning App Builder.',
                    variant: 'error',
                    mode: 'sticky'
                })
            );
            return;
        }

        if (this.openInNewTab) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Employee Selected',
                    message: `Opening ${payload.employeeName} in Employee App`,
                    variant: 'success',
                    mode: 'dismissable'
                })
            );
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: { url }
            });
            return;
        }

        // Same-tab redirect
        redirectTo(url);
    }

    // ─── Sorting ──────────────────────────────────────────────────────────────

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(field, direction) {
        const multiplier = direction === 'asc' ? 1 : -1;
        this.employees = [...this.employees].sort((a, b) => {
            const aVal = a[field] ?? '';
            const bVal = b[field] ?? '';
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return (aVal - bVal) * multiplier;
            }
            return String(aVal).localeCompare(String(bVal)) * multiplier;
        });
    }

    // ─── Refresh ──────────────────────────────────────────────────────────────

    handleRefresh() {
        this.isLoading = true;
        this.selectedEmployee = undefined;
        this.employees = [];
        this._rawEmployees = [];
        getEmployees()
            .then(data => {
                this._rawEmployees = data.map(emp => ({
                    ...emp,
                    statusClass: emp.status === 'Active' ? 'status-active' : 'status-leave'
                }));
                this.employees = [...this._rawEmployees];
                this.isLoading = false;
            })
            .catch(err => {
                this.errorMessage = err.body?.message ?? 'Refresh failed.';
                this.isLoading = false;
            });
    }

    // ─── Getters ──────────────────────────────────────────────────────────────

    get hasError() {
        return !!this.errorMessage;
    }

    get employeeCount() {
        return this.employees.length;
    }
}
