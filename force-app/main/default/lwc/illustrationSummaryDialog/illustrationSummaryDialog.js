import { LightningElement, api } from 'lwc';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import getIllustrationSummary from '@salesforce/apex/IllustrationController.getIllustrationSummary';
import getIllustrationPdf from '@salesforce/apex/IllustrationController.getIllustrationPdf';
import { investmentTable, fundTable, formatDate } from './summaryModel';

/**
 * c-illustration-summary-dialog
 *
 * "Illustration summary" modal: illustration header, Investment details
 * (contributions × charges and fees) and Fund selection, loaded with
 * IllustrationController.getIllustrationSummary.
 *
 * Events: close; createebs { illustrationId, illustrationRef } (footer button).
 */
export default class IllustrationSummaryDialog extends LightningElement {
    @api illustrationId;
    /** Show the footer "Create EBS" button (EBS → Create). */
    @api showCreateEbs = false;

    summary;
    isLoading = true;
    errorMessage;
    isPrinting = false;
    printError;
    _focused = false;

    connectedCallback() {
        this.load();
    }

    renderedCallback() {
        if (this._focused) return;
        const close = this.template.querySelector('.sum-close');
        if (close) {
            this._focused = true;
            close.focus();
        }
    }

    async load() {
        this.isLoading = true;
        this.errorMessage = undefined;
        try {
            this.summary = await getIllustrationSummary({ illustrationId: Number(this.illustrationId) });
        } catch (error) {
            this.summary = undefined;
            this.errorMessage = error?.body?.message ?? error?.message ?? 'Could not load the illustration summary.';
        } finally {
            this.isLoading = false;
        }
    }

    // ─── View model ───────────────────────────────────────────────────────────

    get hasSummary() {
        return !this.isLoading && !!this.summary;
    }

    get productTitle() {
        const s = this.summary;
        return s?.productDescription || s?.productCode || 'Illustration';
    }

    get illustrationDateLabel() {
        return formatDate(this.summary?.illustrationDate, TIME_ZONE);
    }

    get investment() {
        return investmentTable(this.summary);
    }

    get hasContributions() {
        return this.investment.rows.length > 0;
    }

    get funds() {
        return fundTable(this.summary);
    }

    get printDisabled() {
        return this.isPrinting || !this.summary?.hasDocuments;
    }

    get printTitle() {
        return this.summary?.hasDocuments
            ? 'Open the illustration PDF to print it'
            : 'The PDF is available once the illustration has been illustrated';
    }

    // ─── Actions ──────────────────────────────────────────────────────────────

    /** Print: open the illustration PDF in a new browser tab, ready to print. */
    async handlePrint() {
        if (this.printDisabled) return;
        this.isPrinting = true;
        this.printError = undefined;
        try {
            const file = await getIllustrationPdf({ illustrationId: Number(this.illustrationId) });
            const binary = atob(file.base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
            window.open(url, '_blank', 'noopener');
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (error) {
            this.printError = error?.body?.message ?? error?.message ?? 'Could not open the PDF.';
        } finally {
            this.isPrinting = false;
        }
    }

    handleCreateEbs() {
        this.dispatchEvent(
            new CustomEvent('createebs', {
                detail: { illustrationId: this.summary?.illustrationId, illustrationRef: this.summary?.illustrationRef }
            })
        );
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    /** Esc closes; Tab stays inside the dialog. */
    handleKeydown(event) {
        if (event.key === 'Escape') {
            event.stopPropagation();
            this.handleClose();
            return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...this.template.querySelectorAll('button, [tabindex="0"]')].filter((el) => !el.disabled);
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
