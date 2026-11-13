import _ from "lodash-es";
export default function addPageScript(App, Page) {
  //auto refresh functions
  
    /*
   * Use App.getDependency for Dependency Injection
   * eg: let DialogService = App.getDependency('DialogService');
   */
  
  /* perform any action on widgets/variables within this block */
  Page.onReady = function () {
      /*
       * variables can be accessed through 'Page.Variables' property here
       * e.g. to get dataSet in a staticVariable named 'loggedInUser' use following script
       * Page.Variables.loggedInUser.getData()
       *
       * widgets can be accessed through 'Page.Widgets' property here
       * e.g. to get value of text widget named 'username' use following script
       * 'Page.Widgets.username.datavalue'
       */
      let result = App.Variables.illustrationResult.dataSet;
      result = (result && result.dataValue) || result || {};
      Page.populateIllustration(result);
  };
  
  Page.goToIllustrationClick = function ($event, widget) {
      App.salesforce && App.salesforce.dispatchEvent("navigatetab", { apiName: "illustrationClientList" });
  };
  
  Page.btn_printClick = function ($event, widget) {
      Page.Variables.svGetIllustrationPdfById.invoke({}, function (data) {
          const res = (data && data.dataValue) || data || {};
          if (!res.pdfBase64) {
              return;
          }
          const binary = atob(res.pdfBase64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: res.contentType || "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = res.fileName || "illustration.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      }, function (error) {
          console.error("Failed to download illustration PDF", error);
      });
  };
  
  Page.btn_xmlClick = function ($event, widget) {
      Page.Variables.svGetTxLifeXmlByIllustrationId.invoke({}, function (data) {
          let res = (data && data.dataValue !== undefined) ? data.dataValue : data;
          let xml = res;
          if (res && typeof res === "object") {
              xml = res.xml || res.txLifeXml || res.content || res.body || res.data || JSON.stringify(res);
          }
          if (!xml) {
              return;
          }
          const blob = new Blob([xml], { type: "application/xml" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "TxLife_" + ((App.Variables.illustrationResult.dataSet || {}).illustrationId || "illustration") + ".xml";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      }, function (error) {
          console.error("Failed to download TxLife XML", error);
      });
  };
  
  /* ---------- formatting helpers ---------- */
  Page.fmtText = function (v) {
      return (v === null || v === undefined || v === "") ? "-" : String(v);
  };
  
  Page.fmtYesNo = function (v) {
      return v ? "Yes" : "No";
  };
  
  Page.fmtMoney = function (v) {
      if (v === null || v === undefined || v === "" || isNaN(+v)) {
          return "-";
      }
      return "£" + (+v).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  Page.fmtPct = function (v) {
      return (v === null || v === undefined || v === "" || isNaN(+v)) ? "-" : (+v) + "%";
  };
  
  Page.fmtDate = function (v) {
      if (!v) {
          return "-";
      }
      let d = new Date(v);
      if (isNaN(d.getTime())) {
          return String(v);
      }
      let dd = ("0" + d.getUTCDate()).slice(-2);
      let mm = ("0" + (d.getUTCMonth() + 1)).slice(-2);
      return dd + "/" + mm + "/" + d.getUTCFullYear();
  };
  
  Page.fmtDateTime = function (v) {
      if (!v) {
          return "-";
      }
      let d = new Date(v);
      if (isNaN(d.getTime())) {
          return String(v);
      }
      return Page.fmtDate(v) + " " + ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2) + " UTC";
  };
  
  Page.fmtEnum = function (v) {
      if (!v) {
          return "-";
      }
      let s = String(v).replace(/_/g, " ").toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
  };
  
  /* ---------- map the svCreateIllustration response to the card datasets ---------- */
  Page.populateIllustration = function (r) {
      let product = r.product || {};
      let preparedBy = r.preparedBy || {};
      let investment = r.investment || {};
      let benefits = r.benefits || {};
      let parties = r.parties || [];
      let contributions = r.contributions || [];
  
      Page.Variables.accountDetails.dataSet = [
          { label: "Illustration reference", value: Page.fmtText(r.illustrationRef) },
          { label: "Illustration ID", value: Page.fmtText(r.illustrationId) },
          { label: "Status", value: Page.fmtEnum(r.status) },
          { label: "Current step", value: Page.fmtEnum(r.currentStep) },
          { label: "Client ID", value: Page.fmtText(r.clientId) },
          { label: "Product", value: Page.fmtText(product.description) },
          { label: "Product code", value: Page.fmtText(product.code) },
          { label: "Product category", value: Page.fmtText(product.category) },
          { label: "Tax year", value: Page.fmtText(r.taxYear) },
          { label: "Prepared by", value: Page.fmtText(preparedBy.displayName) },
          { label: "Adviser ID", value: Page.fmtText(preparedBy.adviserId) },
          { label: "Include graph", value: Page.fmtYesNo(r.includeGraph) },
          { label: "Created at", value: Page.fmtDateTime(r.createdAt) },
          { label: "Updated at", value: Page.fmtDateTime(r.updatedAt) },
          { label: "Illustrated at", value: Page.fmtDateTime(r.illustratedAt) }
      ];
  
      let partyRows = [];
      parties.forEach(function (p, idx) {
          let prefix = parties.length > 1 ? "Party " + (idx + 1) + " - " : "";
          let fullName = [p.title, p.forename, p.surname].filter(function (x) { return !!x; }).join(" ");
          partyRows.push({ label: prefix + "Name", value: Page.fmtText(fullName) });
          partyRows.push({ label: prefix + "Role", value: Page.fmtEnum(p.role) });
          partyRows.push({ label: prefix + "Date of birth", value: Page.fmtDate(p.dateOfBirth) });
          partyRows.push({ label: prefix + "Client ID", value: Page.fmtText(p.clientId) });
      });
      Page.Variables.partyDetails.dataSet = partyRows;
  
      Page.Variables.investmentDetails.dataSet = [
          { label: "Is this an additional investment to an existing ISA?", value: Page.fmtYesNo(investment.additionalToExistingIsa) },
          { label: "Subscriptions already made this tax year", value: Page.fmtMoney(investment.priorSubscriptionsThisYear) },
          { label: "Commencement date", value: Page.fmtDate(investment.commencementDate) },
          { label: "Term", value: investment.termYears === null || investment.termYears === undefined ? "-" : investment.termYears + " years" },
          { label: "Other new investments in this round?", value: Page.fmtYesNo(investment.otherNewInvestmentsInRound) }
      ];
  
      let withdrawals = benefits.withdrawals || [];
      let benefitRows = [
          { label: "Takes regular withdrawals?", value: Page.fmtYesNo(benefits.takesRegularWithdrawals) },
          { label: "Number of withdrawals", value: String(withdrawals.length) }
      ];
      withdrawals.forEach(function (w, idx) {
          benefitRows.push({ label: "Withdrawal " + (idx + 1), value: typeof w === "object" ? JSON.stringify(w) : String(w) });
      });
      Page.Variables.benefitDetails.dataSet = benefitRows;
  
      let singleRows = [];
      let singleTotal = 0;
      contributions.filter(function (c) { return c.contributionType === "SINGLE"; }).forEach(function (c) {
          singleTotal += (+c.grossAmount || 0);
          singleRows.push({ label: "Single contribution", value: "Gross amount", amount: Page.fmtMoney(c.grossAmount) });
          (c.contributors || []).forEach(function (ct) {
              singleRows.push({ label: Page.fmtText(ct.contributorName), value: Page.fmtEnum(ct.contributorType), amount: Page.fmtMoney(ct.amount) });
          });
      });
      if (singleRows.length) {
          singleRows.push({ label: "Total single contributions", value: "", amount: Page.fmtMoney(singleTotal) });
      }
      Page.Variables.singleContributions.dataSet = singleRows;
  
      Page.Variables.contributionCards.dataSet = contributions.map(function (c) {
          let details = [
              { label: "Contribution ID", value: Page.fmtText(c.contributionId) },
              { label: "Contribution type", value: Page.fmtEnum(c.contributionType) },
              { label: "Gross amount", value: Page.fmtMoney(c.grossAmount) },
              { label: "Internal replacement?", value: Page.fmtYesNo(c.internalReplacement) },
              { label: "Maximise the contribution?", value: Page.fmtYesNo(c.maximise) },
              { label: "Charges non-standard?", value: Page.fmtYesNo(c.chargesNonStandard) },
              { label: "Use AFT?", value: Page.fmtYesNo(c.useAft) },
              { label: "Concession number", value: Page.fmtText(c.concessionNumber) },
              { label: "Frequency", value: Page.fmtEnum(c.frequency) },
              { label: "Start date", value: Page.fmtDate(c.startDate) },
              { label: "Escalation", value: Page.fmtPct(c.escalationPct) },
              { label: "Transfer from provider", value: Page.fmtText(c.transferFromProvider) },
              { label: "Transfer in specie?", value: c.transferInSpecie === null || c.transferInSpecie === undefined ? "-" : Page.fmtYesNo(c.transferInSpecie) },
              { label: "Transfer value", value: Page.fmtMoney(c.transferValue) },
              { label: "Total allocation", value: Page.fmtPct(c.allocationTotalPct) }
          ];
          return {
              title: Page.fmtEnum(c.contributionType) + " contribution",
              details: details,
              contributors: (c.contributors || []).map(function (ct) {
                  return {
                      label: Page.fmtText(ct.contributorName),
                      value: Page.fmtEnum(ct.contributorType) + (ct.systemCalculated ? " (system calculated)" : ""),
                      amount: Page.fmtMoney(ct.amount)
                  };
              }),
              charges: (c.charges || []).map(function (ch) {
                  return {
                      label: Page.fmtText(ch.displayName),
                      value: Page.fmtEnum(ch.kind) + " - standard rate " + Page.fmtPct(ch.standardRatePct),
                      amount: Page.fmtPct(ch.appliedRatePct)
                  };
              }),
              allocations: (c.allocations || []).map(function (a) {
                  return {
                      label: Page.fmtText(a.fundName),
                      value: Page.fmtText(a.fundCode) + " - " + Page.fmtEnum(a.shareClass),
                      amount: Page.fmtPct(a.allocationPct)
                  };
              })
          };
      });
  };
  
}