import _ from "lodash-es";
export default function addPageScript(App, Page) {
  //auto refresh functions
  
    /*
   * Use App.getDependency for Dependency Injection
   * eg: var DialogService = App.getDependency('DialogService');
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
  };
  
  Page.hideFundsToggleClick = function ($event, widget) {
      Page.Variables.individualFundsExpanded.dataSet = {
          dataValue: !Page.Variables.individualFundsExpanded.dataSet.dataValue
      };
  };
  
  Page.fundIncomeValues = {};
  
  Page.updateFundIncomeTotal = function (fundKey, newVal) {
      Page.fundIncomeValues[fundKey] = Number(newVal) || 0;
      const total = _.sum(_.values(Page.fundIncomeValues));
      Page.Variables.fundIncomeTotal.dataSet = {
          dataValue: Math.round(total * 100) / 100
      };
  };
  
  Page.ffAdventurousIncomeChange = function ($event, widget, newVal, oldVal) {
      Page.updateFundIncomeTotal("adventurous", newVal);
  };
  
  Page.ffBalancedIncomeChange = function ($event, widget, newVal, oldVal) {
      Page.updateFundIncomeTotal("balanced", newVal);
  };
  
  Page.ffConservativeIncomeChange = function ($event, widget, newVal, oldVal) {
      Page.updateFundIncomeTotal("conservative", newVal);
  };
  
  Page.ffManagedFundsIncomeChange = function ($event, widget, newVal, oldVal) {
      Page.updateFundIncomeTotal("managedFunds", newVal);
  };
  
  Page.ffStrategicGrowthIncomeChange = function ($event, widget, newVal, oldVal) {
      Page.updateFundIncomeTotal("strategicGrowth", newVal);
  };
  
  
  Page.btnDoneClick = function ($event, widget) {
      const owner = Page.Widgets.accountOwnerForm.formWidgets;
      const basis = Page.Widgets.illustrationBasisForm.formWidgets;
      const benefits = Page.Widgets.regularWithdrawalsForm.formWidgets;
      const charges = Page.Widgets.chargesForm.formWidgets;
  
  
      Page.Variables.svCreateIllustration.setInput({
          RequestBody: {
              "clientId": App.Variables.selectedEmployee.dataSet.clientId, // fetch client id from salesforce app and pass here
              "productCode": "RA",
              "preparedByAdviserId": App.Variables.selectedEmployee.dataSet.adviserId,
              "accountOwner": {
                  "title": owner.ffTitle.datavalue,
                  "forename": owner.ffForename.datavalue,
                  "surname": owner.ffSurname.datavalue,
                  "dateOfBirth": owner.ffDob.datavalue
              },
              "investment": {
                  "additionalToExistingIsa": Page.Widgets.accountAdditionalForm.formWidgets.ffAccountAdditional.datavalue === "Yes",
                  "commencementDate": basis.ffCommencementDate.datavalue,
                  "termYears": basis.ffTermYears.datavalue,
                  "otherNewInvestmentsInRound": Page.Widgets.basisOtherInvestmentsForm.formWidgets.ffBasisOtherInvestments.datavalue === "Yes",
                  "singleContribution": {
                      "internalReplacement": false,
                      "maximise": false,
                      "accountOwnerAmount": 15000.0,
                      "chargesNonStandard": false
                  }
              },
              "benefits": {
                  "takesRegularWithdrawals": benefits.ffRegularWithdrawals.datavalue === "Yes",
              },
              "charges": [
                  {
                      "contributionType": "SINGLE",
                      "charges": [
                          {
                              "chargeTypeCode": "INITIAL_ADVICE_CHARGE",
                              "appliedRatePct": 3.0,
                              //"appliedRatePct": +charges.ffInitialAdviceCharge.datavalue,
                          },
                          // {
                          //     "chargeTypeCode": "ONGOING_ADVICE_CHARGE",
                          //     "appliedRatePct": +charges.ffOngoingAdviceCharge.datavalue,
                          // },
                          // {
                          //     "chargeTypeCode": "PRODUCT_CHARGE",
                          //     "appliedRatePct": +charges.ffProductCharge.datavalue,
                          // }
                      ],
                      // "fees": [
                      //     {
                      //         "chargeTypeCode": "INITIAL_ADVICE_FEE",
                      //         "appliedRatePct": +charges.ffInitialAdviceFee.datavalue
                      //     },
                      //     {
                      //         "chargeTypeCode": "CREDIT",
                      //         "appliedRatePct": +charges.ffCredit.datavalue
                      //     },
                      //     {
                      //         "chargeTypeCode": "ONGOING_ADVICE_FEE",
                      //         "appliedRatePct": +charges.ffOngoingAdviceFee.datavalue
                      //     }
                      // ]
                  }
              ],
              "fundSelection": {
                  "includeGraph": true,
                  "contributions": [
                      {
                          "contributionType": "SINGLE",
                          "useAft": false,
                          "allocations": [
                              {
                                  "fundId": 4,
                                  "shareClass": "ACCUMULATION",
                                  "allocationPct": 50
                              },
                              {
                                  "fundId": 2,
                                  "shareClass": "ACCUMULATION",
                                  "allocationPct": 30
                              },
                              {
                                  "fundId": 3,
                                  "shareClass": "INCOME",
                                  "allocationPct": 20
                              }
                          ]
                      }
                  ]
              },
              "illustrate": true
          }
      });
  
      Page.Variables.svCreateIllustration.invoke({}, function (data) {
          // hand the whole response to printIllustration via app-scope variable, then navigate
          App.Variables.illustrationResult.dataSet = {
              dataValue: data
          };
          App.Actions.goToPage_printIllustration.invoke();
      },
          function () {
              Page.Variables.illustrationResultMessage.dataSet = {
                  dataValue: "Failed to create illustration. Please try again."
              };
              Page.Widgets.illustrationResultDialog.open();
          }
      )
  };
  
  Page.illustrationResultOkClick = function ($event, widget) {
      Page.Widgets.illustrationResultDialog.close();
      window.location.reload();
  };
  
}