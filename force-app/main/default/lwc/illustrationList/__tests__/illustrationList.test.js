/* eslint-disable @lwc/lwc/no-unexpected-wire-adapter-usages -- test drives the wire adapter via emit() */
/* global require */
import { createElement } from "@lwc/engine-dom";
import IllustrationList from "c/illustrationList";
import getIllustrations from "@salesforce/apex/IllustrationController.getIllustrations";
import getIllustrationPdf from "@salesforce/apex/IllustrationController.getIllustrationPdf";
import getIllustrationXml from "@salesforce/apex/IllustrationController.getIllustrationXml";
import { refreshApex } from "@salesforce/apex";
import { CurrentPageReference } from "lightning/navigation";

jest.mock(
  "@salesforce/apex",
  () => ({ refreshApex: jest.fn(() => Promise.resolve()) }),
  { virtual: true }
);
jest.mock(
  "@salesforce/apex/IllustrationController.getIllustrations",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return { default: createApexTestWireAdapter(jest.fn()) };
  },
  { virtual: true }
);
jest.mock(
  "@salesforce/apex/IllustrationController.getIllustrationPdf",
  () => ({ default: jest.fn() }),
  {
    virtual: true
  }
);
jest.mock(
  "@salesforce/apex/IllustrationController.getIllustrationXml",
  () => ({ default: jest.fn() }),
  {
    virtual: true
  }
);

const ILLUSTRATIONS = [
  {
    illustrationId: 47,
    illustrationRef: "ILL-47AAAA",
    clientName: "Ann Lee",
    status: "ILLUSTRATED",
    illustratedAt: "2026-11-04T15:05:00Z",
    hasDocuments: false
  },
  {
    illustrationId: 53,
    illustrationRef: "ILL-50D0B93437",
    clientName: "Bmd Sthds",
    status: "ILLUSTRATED",
    illustratedAt: "2026-11-05T09:37:20.507258Z",
    hasDocuments: true
  },
  {
    illustrationId: 9,
    illustrationRef: "ILL-0009",
    clientName: "Zoe Adams",
    status: "IN_PROGRESS",
    illustratedAt: null,
    hasDocuments: true
  }
];

const DATE_TIME = /^\d{2}:\d{2}, \d{2}-\d{2}-\d{4}$/;

const flush = () => new Promise((resolve) => setTimeout(resolve, 0)); // eslint-disable-line @lwc/lwc/no-async-operation

describe("c-illustration-list", () => {
  let clickSpy;
  let saved;

  beforeEach(() => {
    saved = [];
    URL.createObjectURL = jest.fn((blob) => {
      saved.push({ blob });
      return "blob:mock";
    });
    URL.revokeObjectURL = jest.fn();
    clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function () {
        saved[saved.length - 1].fileName = this.download;
        saved[saved.length - 1].href = this.href;
      });
  });

  afterEach(() => {
    while (document.body.firstChild)
      document.body.removeChild(document.body.firstChild);
    jest.clearAllMocks();
    clickSpy.mockRestore();
  });

  async function setup(data = ILLUSTRATIONS) {
    const el = createElement("c-illustration-list", { is: IllustrationList });
    document.body.appendChild(el);
    getIllustrations.emit(data);
    await flush();
    return el;
  }

  const headers = (el) =>
    [...el.shadowRoot.querySelectorAll("thead th")].map((th) =>
      th.textContent.trim()
    );
  const cells = (el) =>
    [...el.shadowRoot.querySelectorAll("tbody tr")].map((tr) =>
      [...tr.querySelectorAll("td")].map((td) => td.textContent.trim())
    );
  const button = (el, id, kind) =>
    el.shadowRoot.querySelector(`button[data-id="${id}"][data-kind="${kind}"]`);

  it("shows Ref, Client Name, Status, Illustrated At and PDF/XML columns, newest first", async () => {
    const el = await setup();
    expect(headers(el)).toEqual([
      "Illustration Ref",
      "Client Name",
      "Status",
      "Illustrated At",
      "PDF",
      "XML"
    ]);
    const rows = cells(el);
    expect(rows.map((r) => [r[0], r[1], r[2], r[4], r[5]])).toEqual([
      ["ILL-50D0B93437", "Bmd Sthds", "Illustrated", "PDF", "XML"],
      ["ILL-47AAAA", "Ann Lee", "Illustrated", "PDF", "XML"],
      ["ILL-0009", "Zoe Adams", "In progress", "PDF", "XML"] // not illustrated yet → last
    ]);
    expect(rows[0][3]).toMatch(DATE_TIME);
    expect(rows[1][3]).toMatch(DATE_TIME);
    expect(rows[2][3]).toBe("");
    expect(el.shadowRoot.querySelector(".dir-count").textContent).toBe(
      "3 illustrations"
    );
  });

  it("sorts by a column header and toggles direction", async () => {
    const el = await setup();
    const sortBy = (field) =>
      el.shadowRoot
        .querySelector(`button.dir-sort[data-field="${field}"]`)
        .click();

    sortBy("clientName");
    await flush();
    expect(cells(el).map((r) => r[1])).toEqual([
      "Ann Lee",
      "Bmd Sthds",
      "Zoe Adams"
    ]);
    sortBy("clientName");
    await flush();
    expect(cells(el).map((r) => r[1])).toEqual([
      "Zoe Adams",
      "Bmd Sthds",
      "Ann Lee"
    ]);
    expect(
      el.shadowRoot.querySelector('th[aria-sort="descending"]').textContent
    ).toContain("Client Name");

    sortBy("illustratedAt");
    await flush();
    expect(cells(el).map((r) => r[0])).toEqual([
      "ILL-47AAAA",
      "ILL-50D0B93437",
      "ILL-0009" // blank dates last
    ]);

    sortBy("status");
    await flush();
    expect(cells(el).map((r) => r[2])).toEqual([
      "Illustrated",
      "Illustrated",
      "In progress"
    ]);
  });

  it("disables both downloads when the illustration has no documents yet", async () => {
    const el = await setup();
    expect(button(el, "47", "pdf").disabled).toBe(true);
    expect(button(el, "47", "xml").disabled).toBe(true);
    expect(button(el, "47", "pdf").getAttribute("aria-label")).toBe(
      "No PDF available yet for ILL-47AAAA"
    );
    expect(button(el, "53", "pdf").disabled).toBe(false);
    expect(button(el, "53", "xml").getAttribute("aria-label")).toBe(
      "Download XML for ILL-50D0B93437"
    );
  });

  it("downloads the PDF in the browser, named after the illustration ref", async () => {
    getIllustrationPdf.mockResolvedValue({
      fileName: "investment-illustration.pdf",
      contentType: "application/pdf",
      base64: btoa("%PDF-1.6 test")
    });
    const el = await setup();

    button(el, "53", "pdf").click();
    await flush();

    expect(getIllustrationPdf).toHaveBeenCalledWith({ illustrationId: 53 });
    expect(saved).toHaveLength(1);
    expect(saved[0].fileName).toBe(
      "ILL-50D0B93437-investment-illustration.pdf"
    );
    expect(saved[0].blob.type).toBe("application/pdf");
    expect(saved[0].blob.size).toBe("%PDF-1.6 test".length);
    expect(button(el, "53", "pdf").disabled).toBe(false); // busy state cleared
  });

  it("downloads the XML with the file name from the API", async () => {
    getIllustrationXml.mockResolvedValue({
      fileName: "ILL-50D0B93437-TXLife-v1.xml",
      contentType: "application/xml",
      base64: btoa("<TXLife/>")
    });
    const el = await setup();

    button(el, "53", "xml").click();
    await flush();

    expect(getIllustrationXml).toHaveBeenCalledWith({ illustrationId: 53 });
    expect(saved[0].fileName).toBe("ILL-50D0B93437-TXLife-v1.xml");
    expect(saved[0].blob.size).toBe("<TXLife/>".length);
  });

  it('shows "Downloading…" while the file is fetched and ignores repeat clicks', async () => {
    let resolve;
    getIllustrationPdf.mockReturnValue(new Promise((r) => (resolve = r)));
    const el = await setup();

    button(el, "53", "pdf").click();
    await flush();
    expect(button(el, "53", "pdf").textContent).toContain("Downloading…");
    expect(button(el, "53", "pdf").disabled).toBe(true);
    button(el, "53", "pdf").click();
    expect(getIllustrationPdf).toHaveBeenCalledTimes(1);

    resolve({
      fileName: "x.pdf",
      contentType: "application/pdf",
      base64: btoa("x")
    });
    await flush();
    expect(button(el, "53", "pdf").textContent).toContain("PDF");
  });

  it("shows an error toast when a download fails", async () => {
    getIllustrationXml.mockRejectedValue({
      body: { message: "No XML is available for illustration 53 yet." }
    });
    const el = await setup();
    const toast = jest.fn();
    el.addEventListener("lightning__showtoast", toast);

    button(el, "53", "xml").click();
    await flush();

    expect(toast).toHaveBeenCalledTimes(1);
    expect(toast.mock.calls[0][0].detail).toMatchObject({
      title: "XML download failed",
      message: "No XML is available for illustration 53 yet.",
      variant: "error"
    });
    expect(saved).toHaveLength(0);
  });

  it("shows the API error message", async () => {
    const el = createElement("c-illustration-list", { is: IllustrationList });
    document.body.appendChild(el);
    getIllustrations.error({
      message: "Illustration service returned 503 Service Unavailable"
    });
    await flush();
    expect(el.shadowRoot.querySelector(".dir-error").textContent).toContain(
      "503"
    );
  });

  describe("refresh on navigation from the WaveMaker app", () => {
    const pageRef = (token) => ({
      type: "standard__navItemPage",
      attributes: { apiName: "illustrationClientList" },
      state: token ? { c__refresh: token } : {}
    });

    it("reloads the list for each new c__refresh token", async () => {
      const el = await setup();
      refreshApex.mockClear();

      CurrentPageReference.emit(pageRef("100"));
      await flush();
      expect(refreshApex).toHaveBeenCalledTimes(1);

      CurrentPageReference.emit(pageRef("100")); // same navigation re-emitted
      await flush();
      expect(refreshApex).toHaveBeenCalledTimes(1);

      CurrentPageReference.emit(pageRef("200")); // navigated here again
      await flush();
      expect(refreshApex).toHaveBeenCalledTimes(2);
      expect(el.shadowRoot.querySelector("table")).not.toBeNull();
    });

    it("does not reload on a plain tab visit", async () => {
      await setup();
      refreshApex.mockClear();
      CurrentPageReference.emit(pageRef(null));
      await flush();
      expect(refreshApex).not.toHaveBeenCalled();
    });

    it("reloads once the first (cached) rows arrive when opened with a token", async () => {
      const el = createElement("c-illustration-list", { is: IllustrationList });
      document.body.appendChild(el);
      refreshApex.mockClear();
      CurrentPageReference.emit(pageRef("300"));
      await flush();
      expect(refreshApex).not.toHaveBeenCalled();
      getIllustrations.emit(ILLUSTRATIONS);
      await flush();
      expect(refreshApex).toHaveBeenCalledTimes(1);
    });
  });

  it("shows an empty state", async () => {
    const el = await setup([]);
    expect(el.shadowRoot.querySelector(".dir-empty").textContent).toBe(
      "No illustrations yet."
    );
    expect(el.shadowRoot.querySelector(".dir-count").textContent).toBe(
      "0 illustrations"
    );
  });
});

describe("formatDateTime / formatStatus", () => {
  const { formatDateTime, formatStatus } = require("../formatDateTime");

  it("formats as HH:MM, DD-MM-YYYY (24-hour) in the given time zone", () => {
    expect(formatDateTime("2026-11-05T09:37:20.507258Z", "UTC")).toBe(
      "09:37, 05-11-2026"
    );
    expect(formatDateTime("2026-11-05T21:07:00Z", "UTC")).toBe(
      "21:07, 05-11-2026"
    );
    expect(formatDateTime("2026-11-05T09:37:20Z", "Europe/London")).toBe(
      "09:37, 05-11-2026"
    );
    expect(formatDateTime("2026-11-05T09:37:20Z", "Asia/Kolkata")).toBe(
      "15:07, 05-11-2026"
    );
    expect(formatDateTime("2026-07-01T23:30:00Z", "Europe/London")).toBe(
      "00:30, 02-07-2026"
    ); // BST
  });

  it("returns blank for missing or invalid dates", () => {
    expect(formatDateTime(null, "UTC")).toBe("");
    expect(formatDateTime("not a date", "UTC")).toBe("");
  });

  it("title-cases the status", () => {
    expect(formatStatus("ILLUSTRATED")).toBe("Illustrated");
    expect(formatStatus("IN_PROGRESS")).toBe("In progress");
    expect(formatStatus(null)).toBe("");
  });
});
