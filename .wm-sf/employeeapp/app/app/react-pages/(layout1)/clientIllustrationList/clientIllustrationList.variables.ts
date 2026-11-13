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
import { getIllustrationsService as getIllustrationsService } from '@/services/getIllustrations/GetIllustrationsService';


export default (Page:any) => {
    return {
        Variables : {
            svGetIllustrationList: new (ServiceVariable as any)({
                name: 'svGetIllustrationList',
                _context: Page,
                serviceType: 'RestService',
                operation: "invoke",
                service: "getIllustrations",
                maxResults: '20',
                operationId: 'getIllustrations_invoke',
                operationType: 'get',
                controller: 'getIllustrations',
                paramProvider: () => (
                        {}
                ),
                            baseUrl: Page.baseUrl + '/services',
                    getServiceInfo: () => Page.serviceDefinitions['getIllustrations_invoke']?.wmServiceOperationInfo,
                    orderBy: '',
                    isStaticParams: true,
                inFlightBehavior: "executeLast",
                isList: true,

                invokeHttp: async (...args: any) => {
                    const [requestParams, params] = args;
                    return await getIllustrationsService.invoke(requestParams);
                },

            }),
        },
        Actions : {
        },
    };
};
