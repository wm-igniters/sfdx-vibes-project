import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import { CurrentPageReference } from "lightning/navigation";
import getIllustrations from "@salesforce/apex/IllustrationController.getIllustrations";
import getIllustrationPdf from "@salesforce/apex/IllustrationController.getIllustrationPdf";
import getIllustrationXml from "@salesforce/apex/IllustrationController.getIllustrationXml";
import TIME_ZONE from "@salesforce/i18n/timeZone";
import { base64ToBlob, saveBlob } from "./fileDownload";
import { formatDateTime, formatStatus } from "./formatDateTime";

const COLUMNS = [
  { key: "illustrationRef", label: "Illustration Ref", sortable: true },
  { key: "clientName", label: "Client Name", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "illustratedAt", label: "Illustrated At", sortable: true },
  { key: "pdf", label: "PDF", sortable: false },
  { key: "xml", label: "XML", sortable: false }
];

const DOWNLOADS = {
  pdf: { label: "PDF", fetch: getIllustrationPdf },
  xml: { label: "XML", fetch: getIllustrationXml }
};

/**
 * c-illustration-list
 *
 * Illustrations created in the WaveMaker app, loaded through Apex
 * (IllustrationController → WM_Illustration_API Named Credential →
 * GET /api/v1/illustrations). Each row has PDF and XML download buttons:
 *   PDF → /api/v1/illustrations/{illustrationId}/generate-pdf
 *   XML → /api/v1/illustrations/{illustrationId}/txlife/download
 * Apex returns the file base64-encoded; it is saved in the browser as a download.
 * Both documents exist only once a TXLife has been stored for the illustration
 * (hasDocuments); otherwise the buttons are disabled.
 *
 * Refresh: the list reloads from the API whenever the tab is opened with a new
 * `c__refresh` state value — c-illustration-embedding adds one when the WaveMaker
 * app navigates here (`navigatetab`), so a just-created illustration shows up.
 */
export default class IllustrationList extends LightningElement {
  illustrations = [];
  isLoading = true;
  errorMessage;
  sortBy = "illustratedAt";
  sortDirection = "desc"; // newest first
  /** `${illustrationId}:${kind}` → true while that file is being fetched */
  busy = {};

  _wired;
  _lastRefreshToken;
  _refreshPending = false;

  @wire(getIllustrations)
  wiredIllustrations(result) {
    this._wired = result;
    const { data, error } = result;
    if (data) {
      this.isLoading = false;
      this.errorMessage = undefined;
      this.illustrations = this.sorted(data, this.sortBy, this.sortDirection);
      if (this._refreshPending) {
        this._refreshPending = false;
        this.handleRefresh(); // cached rows came first; fetch fresh ones
      }
    } else if (error) {
      this._refreshPending = false;
      this.isLoading = false;
      this.illustrations = [];
      this.errorMessage =
        error.body?.message ?? "Failed to load illustrations.";
    }
  }

  /** Reload when navigated here with a new c__refresh token (from the WaveMaker app). */
  @wire(CurrentPageReference)
  wiredPageRef(pageRef) {
    const token = pageRef?.state?.c__refresh;
    if (!token || token === this._lastRefreshToken) return;
    this._lastRefreshToken = token;
    // Refresh once the first result is in (before that, the wire is still loading).
    if (this._wired?.data || this._wired?.error) {
      this.handleRefresh();
    } else {
      this._refreshPending = true;
    }
  }

  // ─── Table ────────────────────────────────────────────────────────────────

  get columns() {
    return COLUMNS.map((c) => {
      const active = c.sortable && this.sortBy === c.key;
      let ariaSort;
      if (c.sortable) {
        if (!active) ariaSort = "none";
        else
          ariaSort = this.sortDirection === "asc" ? "ascending" : "descending";
      }
      let sortIcon = null;
      if (active)
        sortIcon =
          this.sortDirection === "asc"
            ? "utility:arrowup"
            : "utility:arrowdown";
      return { ...c, thClass: "dir-th", ariaSort, sortIcon };
    });
  }

  get rows() {
    return this.illustrations.map((ill) => {
      const id = ill.illustrationId;
      const pdfBusy = !!this.busy[`${id}:pdf`];
      const xmlBusy = !!this.busy[`${id}:xml`];
      const available = !!ill.hasDocuments;
      const ref = ill.illustrationRef || id;
      return {
        ...ill,
        key: String(id),
        clientName: ill.clientName || "—",
        statusLabel: formatStatus(ill.status),
        illustratedAtLabel: formatDateTime(ill.illustratedAt, TIME_ZONE),
        pdfBusy,
        xmlBusy,
        pdfDisabled: !available || pdfBusy,
        xmlDisabled: !available || xmlBusy,
        pdfLabel: available
          ? `Download PDF for ${ref}`
          : `No PDF available yet for ${ref}`,
        xmlLabel: available
          ? `Download XML for ${ref}`
          : `No XML available yet for ${ref}`,
        pdfText: pdfBusy ? "Downloading…" : "PDF",
        xmlText: xmlBusy ? "Downloading…" : "XML"
      };
    });
  }

  get hasError() {
    return !!this.errorMessage;
  }

  get isEmpty() {
    return !this.isLoading && !this.hasError && this.illustrations.length === 0;
  }

  get countLabel() {
    const n = this.illustrations.length;
    return `${n} illustration${n === 1 ? "" : "s"}`;
  }

  handleSortClick(event) {
    const field = event.currentTarget.dataset.field;
    this.sortDirection =
      this.sortBy === field && this.sortDirection === "asc" ? "desc" : "asc";
    this.sortBy = field;
    this.illustrations = this.sorted(
      this.illustrations,
      field,
      this.sortDirection
    );
  }

  sorted(list, field, direction) {
    const dir = direction === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const x = a[field];
      const y = b[field];
      if (x == null && y == null) return 0;
      if (x == null) return 1; // blanks last
      if (y == null) return -1;
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return (
        String(x).localeCompare(String(y), undefined, {
          numeric: true,
          sensitivity: "base"
        }) * dir
      );
    });
  }

  handleRefresh() {
    if (!this._wired) return Promise.resolve();
    this.isLoading = true;
    return refreshApex(this._wired).finally(() => {
      this.isLoading = false;
    });
  }

  // ─── Downloads ────────────────────────────────────────────────────────────

  async handleDownload(event) {
    const { id, kind } = event.currentTarget.dataset;
    const download = DOWNLOADS[kind];
    const illustration = this.illustrations.find(
      (i) => String(i.illustrationId) === id
    );
    if (!download || !illustration) return;

    const busyKey = `${id}:${kind}`;
    if (this.busy[busyKey]) return;
    this.busy = { ...this.busy, [busyKey]: true };
    try {
      const file = await download.fetch({
        illustrationId: illustration.illustrationId
      });
      if (!file?.base64) throw new Error(`The ${download.label} is empty.`);
      const fileName = this.fileNameFor(kind, file, illustration);
      // XML is saved as a generic binary so the browser just downloads it.
      const type =
        kind === "pdf"
          ? file.contentType || "application/pdf"
          : "application/octet-stream";
      saveBlob(base64ToBlob(file.base64, type), fileName, this.refs?.downloads);
    } catch (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: `${download.label} download failed`,
          message: error?.body?.message ?? error?.message ?? "Unknown error",
          variant: "error"
        })
      );
    } finally {
      const { [busyKey]: removed, ...rest } = this.busy; // eslint-disable-line no-unused-vars
      this.busy = rest;
    }
  }

  /** The API names every PDF "investment-illustration.pdf": prefix the illustration ref. */
  fileNameFor(kind, file, illustration) {
    const ref =
      illustration.illustrationRef ||
      `illustration-${illustration.illustrationId}`;
    if (kind === "pdf") {
      const name = file.fileName || "illustration.pdf";
      return name.startsWith(ref) ? name : `${ref}-${name}`;
    }
    return file.fileName || `${ref}-TXLife.xml`;
  }
}
