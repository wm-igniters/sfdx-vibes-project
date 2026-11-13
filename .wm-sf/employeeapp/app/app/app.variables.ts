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


export default (App:any) => {
    return {
        Variables : {
            currentEmployee: new (ModelVariable as any)({
                name: 'currentEmployee',
                _context: App,
                paramProvider: () => (
                        {"employeeId":"","employeeName":"","initials":"","subtitle":"","title":"","department":"","status":"","email":"","phone":"","location":"","hireDate":"","salary":0,"source":"","receivedAt":""}
                ),


            }),
            illustrationResult: new (ModelVariable as any)({
                name: 'illustrationResult',
                _context: App,
                paramProvider: () => (
                        {"dataValue":{}}
                ),


            }),
            recentEmployees: new (ModelVariable as any)({
                name: 'recentEmployees',
                _context: App,
                paramProvider: () => (
                        []
                ),
                isList: true,


            }),
            selectedEmployee: new (ModelVariable as any)({
                name: 'selectedEmployee',
                _context: App,
                paramProvider: () => (
                        {"adviserId":"1","adviserName":"","avatarInitials":"","clientId":"3","dateOfBirth":"1988-08-20","displayName":"","editableFields":["title","forename"],"externalRef":"","forename":"Michael","id":"","name":"","surname":"Johnson","title":"Mr"}
                ),


            }),
            staticVariable1: new (ModelVariable as any)({
                name: 'staticVariable1',
                _context: App,
                paramProvider: () => (
                        [{"adviserId":1,"adviserName":"Kumar, Raj","avatarInitials":"BS","clientId":1,"dateOfBirth":"1965-08-05","displayName":"Mr Bmd Sthds","editableFields":["title","forename"],"externalRef":"4984048","forename":"Bmd","id":"1","name":"Bmd Sthds","surname":"Sthds"}]
                ),
                isList: true,


            }),
            supportedLocale: new (ModelVariable as any)({
                name: 'supportedLocale',
                _context: App,
                paramProvider: () => (
                        {"en":"English"}
                ),


            }),
        },
        Actions : {
            appNotification: new (NotificationAction as any)({
                name: 'appNotification',
                _context: App,
                operation: "toast",
                paramProvider: () => (
                    {
                        'class': "Error",
                        'toasterPosition': "bottom right",
                    }
                ),
                onOk: (variable, data, options) => {
                    
                },
                 toasterService: () => App.toaster,
                onClose: (variable, data, options) => {
                    
                },


            }),
            goToPage_clientIllustrationList: new (NavigationAction as any)({
                name: 'goToPage_clientIllustrationList',
                _context: App,
                operation: "gotoPage",
                paramProvider: () => (
                    {
                        'pageName': "clientIllustrationList",
                    }
                ),
                appConfig: App.appConfig,


            }),
            goToPage_Illustration: new (NavigationAction as any)({
                name: 'goToPage_Illustration',
                _context: App,
                operation: "gotoPage",
                paramProvider: () => (
                    {
                        'pageName': "Illustration",
                    }
                ),
                appConfig: App.appConfig,


            }),
            goToPage_printIllustration: new (NavigationAction as any)({
                name: 'goToPage_printIllustration',
                _context: App,
                operation: "gotoPage",
                paramProvider: () => (
                    {
                        'pageName': "printIllustration",
                    }
                ),
                appConfig: App.appConfig,


            }),
        },
    };
};
