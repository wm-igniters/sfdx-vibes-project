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
import { getPdfByIllustrationIdService as getPdfByIllustrationIdService } from '@/services/getPdfByIllustrationId/GetPdfByIllustrationIdService';
import { getTxlifeXmlByIllustrationIdService as getTxlifeXmlByIllustrationIdService } from '@/services/getTxlifeXmlByIllustrationId/GetTxlifeXmlByIllustrationIdService';


export default (Page:any) => {
    return {
        Variables : {
            accountDetails: new (ModelVariable as any)({
                name: 'accountDetails',
                _context: Page,
                paramProvider: () => (
                        []
                ),
                isList: true,


            }),
            benefitDetails: new (ModelVariable as any)({
                name: 'benefitDetails',
                _context: Page,
                paramProvider: () => (
                        []
                ),
                isList: true,


            }),
            contributionCards: new (ModelVariable as any)({
                name: 'contributionCards',
                _context: Page,
                paramProvider: () => (
                        []
                ),
                isList: true,


            }),
            investmentDetails: new (ModelVariable as any)({
                name: 'investmentDetails',
                _context: Page,
                paramProvider: () => (
                        []
                ),
                isList: true,


            }),
            partyDetails: new (ModelVariable as any)({
                name: 'partyDetails',
                _context: Page,
                paramProvider: () => (
                        []
                ),
                isList: true,


            }),
            singleContributions: new (ModelVariable as any)({
                name: 'singleContributions',
                _context: Page,
                paramProvider: () => (
                        []
                ),
                isList: true,


            }),
            svGetIllustrationPdfById: new (ServiceVariable as any)({
                name: 'svGetIllustrationPdfById',
                _context: Page,
                serviceType: 'RestService',
                operation: "invoke",
                service: "getPdfByIllustrationId",
                maxResults: '20',
                operationId: 'getPdfByIllustrationId_invoke',
                operationType: 'get',
                controller: 'getPdfByIllustrationId',
                paramProvider: () => (
                        {}
                ),
                            baseUrl: Page.baseUrl + '/services',
                    getServiceInfo: () => Page.serviceDefinitions['getPdfByIllustrationId_invoke']?.wmServiceOperationInfo,
                    orderBy: '',
                    isStaticParams: true,
                    dataBinding: {"illustrationId":"7"},
                inFlightBehavior: "executeLast",

                invokeHttp: async (...args: any) => {
                    const [requestParams, params] = args;
                    return await getPdfByIllustrationIdService.invoke(params?.["illustrationId"], requestParams);
                },

            }),
            svGetTxLifeXmlByIllustrationId: new (ServiceVariable as any)({
                name: 'svGetTxLifeXmlByIllustrationId',
                _context: Page,
                serviceType: 'RestService',
                operation: "invoke",
                service: "getTxlifeXmlByIllustrationId",
                maxResults: '20',
                operationId: 'getTxlifeXmlByIllustrationId_invoke',
                operationType: 'get',
                controller: 'getTxlifeXmlByIllustrationId',
                paramProvider: () => (
                        {}
                ),
                            baseUrl: Page.baseUrl + '/services',
                    getServiceInfo: () => Page.serviceDefinitions['getTxlifeXmlByIllustrationId_invoke']?.wmServiceOperationInfo,
                    orderBy: '',
                    isStaticParams: true,
                    dataBinding: {"id":"7"},
                inFlightBehavior: "executeLast",

                invokeHttp: async (...args: any) => {
                    const [requestParams, params] = args;
                    return await getTxlifeXmlByIllustrationIdService.invoke(params?.["id"], requestParams);
                },

            }),
        },
        Actions : {
        },
    };
};
