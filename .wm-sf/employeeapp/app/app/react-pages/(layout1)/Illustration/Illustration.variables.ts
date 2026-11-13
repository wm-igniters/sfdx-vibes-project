import React from 'react';
import { ModelVariable  } from '@wavemaker-ai/react-runtime/variables/model-variable';
import { ServiceVariable } from '@wavemaker-ai/react-runtime/variables/service-variable';
import { NavigationAction  } from '@wavemaker-ai/react-runtime/actions/navigation-action';
import {TimerAction} from '@wavemaker-ai/react-runtime/actions/timer-action'
import {NotificationAction} from '@wavemaker-ai/react-runtime/actions/notification-action'
import { LoginAction  } from '@wavemaker-ai/react-runtime/actions/login-action';
import { LogoutAction  } from '@wavemaker-ai/react-runtime/actions/logout-action';
import LiveVariable from '@wavemaker-ai/react-runtime/variables/live-variable';
import CrudVariable from "@wavemaker-ai/react-runtime/variables/crud-variable"
import {
  getEntityPropertyMap,
  getEntityRelatedTables,
} from '@/libs/metadata/entities/entity-provider';
import { createIllustrationService as createIllustrationService } from '@/services/CreateIllustration/CreateIllustrationService';


export default (Page:any) => {
    return {
        Variables : {
            createIllustrationVar: new (ServiceVariable as any)({
                name: 'createIllustrationVar',
                _context: Page,
                serviceType: 'RestService',
                operation: "invoke",
                service: "CreateIllustration",
                maxResults: '20',
                operationId: 'CreateIllustration_invoke',
                operationType: 'post',
                controller: 'CreateIllustration',
                paramProvider: () => (
                        {"RequestBody":Page.eval(() => ({"clientId":1,"productCode":"PISA","preparedByAdviserId":1,"accountOwner":{"title":"Mr","forename":"Bmd"},"investment":{"additionalToExistingIsa":false,"commencementDate":"2026-10-14","termYears":10,"otherNewInvestmentsInRound":false,"singleContribution":{"internalReplacement":false,"maximise":false,"accountOwnerAmount":15000,"chargesNonStandard":false},...Page.eval(() => ({"additionalToExistingIsa":Page.eval(() => (Page.Widgets.accountAdditionalForm.formWidgets.ffAccountAdditional.datavalue==="Yes")),"commencementDate":Page.eval(() => Page.Widgets.illustrationBasisForm.formWidgets.ffCommencementDate.datavalue),"termYears":Page.eval(() => Page.Widgets.illustrationBasisForm.formWidgets.ffTermYears.datavalue),"otherNewInvestmentsInRound":Page.eval(() => (Page.Widgets.basisOtherInvestmentsForm.formWidgets.ffBasisOtherInvestments.datavalue==="Yes"))}))},"benefits":{"takesRegularWithdrawals":false,...Page.eval(() => ({"takesRegularWithdrawals":Page.eval(() => (Page.Widgets.regularWithdrawalsForm.formWidgets.ffRegularWithdrawals.datavalue==="Yes"))}))},"charges":[{"contributionType":"SINGLE","charges":[{"chargeTypeCode":"INITIAL_ADVICE_CHARGE","appliedRatePct":3}]}],"fundSelection":{"includeGraph":true,"contributions":[{"contributionType":"SINGLE","useAft":false,"allocations":[{"fundId":4,"shareClass":"ACCUMULATION","allocationPct":50},{"fundId":2,"shareClass":"ACCUMULATION","allocationPct":30},{"fundId":3,"shareClass":"INCOME","allocationPct":20}]}]},"illustrate":true}))}
                ),
                            baseUrl: Page.baseUrl + '/services',
                    getServiceInfo: () => Page.serviceDefinitions['CreateIllustration_invoke']?.wmServiceOperationInfo,
                    orderBy: '',
                    isStaticParams: false,
                inFlightBehavior: "executeLast",

                invokeHttp: async (...args: any) => {
                    const [requestParams, params] = args;
                    return await createIllustrationService.invoke(params?.["RequestBody"], requestParams);
                },

            }),
            fundIncomeTotal: new (ModelVariable as any)({
                name: 'fundIncomeTotal',
                _context: Page,
                paramProvider: () => (
                        {"dataValue":0}
                ),


            }),
            illustrationResultMessage: new (ModelVariable as any)({
                name: 'illustrationResultMessage',
                _context: Page,
                paramProvider: () => (
                        {"dataValue":""}
                ),


            }),
            individualFundsExpanded: new (ModelVariable as any)({
                name: 'individualFundsExpanded',
                _context: Page,
                paramProvider: () => (
                        {"dataValue":true}
                ),


            }),
            svCreateIllustration: new (ServiceVariable as any)({
                name: 'svCreateIllustration',
                _context: Page,
                serviceType: 'RestService',
                operation: "invoke",
                service: "CreateIllustration",
                maxResults: '20',
                operationId: 'CreateIllustration_invoke',
                operationType: 'post',
                controller: 'CreateIllustration',
                paramProvider: () => (
                        {}
                ),
                            baseUrl: Page.baseUrl + '/services',
                    getServiceInfo: () => Page.serviceDefinitions['CreateIllustration_invoke']?.wmServiceOperationInfo,
                    orderBy: '',
                    isStaticParams: true,
                    dataBinding: {"RequestBody":{"clientId":1,"productCode":"PISA","preparedByAdviserId":1,"accountOwner":{"title":"Mr","forename":"Bmd"},"investment":{"additionalToExistingIsa":false,"commencementDate":"2026-10-14","termYears":10,"otherNewInvestmentsInRound":false,"singleContribution":{"internalReplacement":false,"maximise":false,"accountOwnerAmount":15000,"chargesNonStandard":false}},"benefits":{"takesRegularWithdrawals":false},"charges":[{"contributionType":"SINGLE","charges":[{"chargeTypeCode":"INITIAL_ADVICE_CHARGE","appliedRatePct":3}]}],"fundSelection":{"includeGraph":true,"contributions":[{"contributionType":"SINGLE","useAft":false,"allocations":[{"fundId":4,"shareClass":"ACCUMULATION","allocationPct":50},{"fundId":2,"shareClass":"ACCUMULATION","allocationPct":30},{"fundId":3,"shareClass":"INCOME","allocationPct":20}]}]},"illustrate":true}},
                inFlightBehavior: "executeLast",

                invokeHttp: async (...args: any) => {
                    const [requestParams, params] = args;
                    return await createIllustrationService.invoke(params?.["RequestBody"], requestParams);
                },

            }),
        },
        Actions : {
        },
    };
};
