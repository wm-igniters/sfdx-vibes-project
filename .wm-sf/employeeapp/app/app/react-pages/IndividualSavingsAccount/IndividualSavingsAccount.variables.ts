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
import { getEBSPrefillDataBySubmissionIdService as getEBSPrefillDataBySubmissionIdService } from '@/services/getEBSPrefillDataBySubmissionId/GetEBSPrefillDataBySubmissionIdService';


export default (Page:any) => {
    return {
        Variables : {
            clientInitiatedOptions: new (ModelVariable as any)({
                name: 'clientInitiatedOptions',
                _context: Page,
                paramProvider: () => (
                        ["Yes","No"]
                ),
                isList: true,


            }),
            countryOptions: new (ModelVariable as any)({
                name: 'countryOptions',
                _context: Page,
                paramProvider: () => (
                        ["United Kingdom","Ireland","France","Germany","Spain","United States"]
                ),
                isList: true,


            }),
            documentsSentToOptions: new (ModelVariable as any)({
                name: 'documentsSentToOptions',
                _context: Page,
                paramProvider: () => (
                        ["Bmd Sthds"]
                ),
                isList: true,


            }),
            navItems: new (ModelVariable as any)({
                name: 'navItems',
                _context: Page,
                paramProvider: () => (
                        [{"label":"Support centre","link":"#"},{"label":"Document library","link":"#"},{"label":"Fund information","link":"#"}]
                ),
                isList: true,


            }),
            paymentMethodOptions: new (ModelVariable as any)({
                name: 'paymentMethodOptions',
                _context: Page,
                paramProvider: () => (
                        ["Cheque","BACS","Debit card","Direct Debit"]
                ),
                isList: true,


            }),
            preferredContactOptions: new (ModelVariable as any)({
                name: 'preferredContactOptions',
                _context: Page,
                paramProvider: () => (
                        ["Home","Mobile","Work"]
                ),
                isList: true,


            }),
            specialCorrespondenceOptions: new (ModelVariable as any)({
                name: 'specialCorrespondenceOptions',
                _context: Page,
                paramProvider: () => (
                        ["None","Braille","Large print","Audio"]
                ),
                isList: true,


            }),
            svGetEBSData: new (ServiceVariable as any)({
                name: 'svGetEBSData',
                _context: Page,
                serviceType: 'RestService',
                operation: "invoke",
                service: "getEBSPrefillDataBySubmissionId",
                maxResults: '20',
                operationId: 'getEBSPrefillDataBySubmissionId_invoke',
                operationType: 'get',
                controller: 'getEBSPrefillDataBySubmissionId',
                paramProvider: () => (
                        {"submissionId":Page.eval(() => Page.Variables.ebsSubmissionData.dataSet.submissionId)}
                ),
                            baseUrl: Page.baseUrl + '/services',
                    getServiceInfo: () => Page.serviceDefinitions['getEBSPrefillDataBySubmissionId_invoke']?.wmServiceOperationInfo,
                    orderBy: '',
                    isStaticParams: false,
                inFlightBehavior: "executeLast",

                invokeHttp: async (...args: any) => {
                    const [requestParams, params] = args;
                    return await getEBSPrefillDataBySubmissionIdService.invoke(params?.["submissionId"], requestParams);
                },

            }),
            taxYearOptions: new (ModelVariable as any)({
                name: 'taxYearOptions',
                _context: Page,
                paramProvider: () => (
                        ["2025/2026","2026/2027","2027/2028"]
                ),
                isList: true,


            }),
            titleOptions: new (ModelVariable as any)({
                name: 'titleOptions',
                _context: Page,
                paramProvider: () => (
                        ["Mr","Mrs","Miss","Ms","Dr"]
                ),
                isList: true,


            }),
        },
        Actions : {
        },
    };
};
