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
            ebsSubmissionData: new (ModelVariable as any)({
                name: 'ebsSubmissionData',
                _context: App,
                paramProvider: () => (
                        {"submissionId":2,"submissionRef":"SUB-7A4DB89101","illustrationId":76,"productCode":"RA","status":"DRAFT","currentScreen":"account-owner","rowVersion":0,"canSubmit":false,"stale":false,"staleReason":null,"screens":[{"key":"account-owner","label":"Account owner","status":"NOT_STARTED","errorCount":0,"subSections":[{"key":"account-owner","label":"Account owner","status":"NOT_STARTED","errorCount":0}]},{"key":"investment","label":"Investment","status":"NOT_STARTED","errorCount":0,"subSections":[{"key":"account-details","label":"Account details","status":"NOT_STARTED","errorCount":0},{"key":"investment","label":"Investment","status":"NOT_STARTED","errorCount":0},{"key":"payment","label":"Payment","status":"NOT_STARTED","errorCount":0}]},{"key":"benefits","label":"Benefits","status":"NOT_STARTED","errorCount":0,"subSections":[{"key":"regular-withdrawals","label":"Regular withdrawals","status":"NOT_STARTED","errorCount":0}]},{"key":"aml-connected-parties","label":"AML connected parties","status":"NOT_STARTED","errorCount":0,"subSections":[{"key":"aml-connected-parties","label":"AML connected parties","status":"NOT_STARTED","errorCount":0}]},{"key":"additional-info","label":"Additional information","status":"NOT_STARTED","errorCount":0,"subSections":[{"key":"partner-remuneration","label":"Partner & remuneration","status":"NOT_STARTED","errorCount":0},{"key":"advice-information","label":"Advice information","status":"NOT_STARTED","errorCount":0},{"key":"marketing-documentation","label":"Marketing & documentation","status":"NOT_STARTED","errorCount":0}]},{"key":"confirm","label":"Confirm","status":"NOT_STARTED","errorCount":0,"subSections":[{"key":"declaration","label":"Declaration","status":"NOT_STARTED","errorCount":0}]}],"outstanding":[{"screen":"account-owner","subSection":"account-owner","label":"Account owner","status":"NOT_STARTED"},{"screen":"investment","subSection":"account-details","label":"Account details","status":"NOT_STARTED"},{"screen":"investment","subSection":"investment","label":"Investment","status":"NOT_STARTED"},{"screen":"investment","subSection":"payment","label":"Payment","status":"NOT_STARTED"},{"screen":"benefits","subSection":"regular-withdrawals","label":"Regular withdrawals","status":"NOT_STARTED"},{"screen":"aml-connected-parties","subSection":"aml-connected-parties","label":"AML connected parties","status":"NOT_STARTED"},{"screen":"additional-info","subSection":"partner-remuneration","label":"Partner & remuneration","status":"NOT_STARTED"},{"screen":"additional-info","subSection":"advice-information","label":"Advice information","status":"NOT_STARTED"},{"screen":"additional-info","subSection":"marketing-documentation","label":"Marketing & documentation","status":"NOT_STARTED"},{"screen":"confirm","subSection":"declaration","label":"Declaration","status":"NOT_STARTED"}],"updatedAt":"2026-11-13T05:06:10.664116Z","outcome":null}
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
            goToPage_blank: new (NavigationAction as any)({
                name: 'goToPage_blank',
                _context: App,
                operation: "gotoPage",
                paramProvider: () => (
                    {
                        'pageName': "blank",
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
            goToPage_IndividualSavingsAccount: new (NavigationAction as any)({
                name: 'goToPage_IndividualSavingsAccount',
                _context: App,
                operation: "gotoPage",
                paramProvider: () => (
                    {
                        'pageName': "IndividualSavingsAccount",
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
