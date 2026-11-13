'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import BasePartial from "@wavemaker-ai/react-runtime/higherOrder/BasePage";
import { useAppContext } from "@wavemaker-ai/react-runtime/context/AppContext";
import { useAppState,useProxy } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import { formatMessage,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmAlertDialog from '@wavemaker-ai/react-runtime/components/dialogs/alert-dialog';
import WmButton from '@wavemaker-ai/react-runtime/components/form/button';
import WmComposite from '@wavemaker-ai/react-runtime/components/input/composite';
import WmConfirmDialog from '@wavemaker-ai/react-runtime/components/dialogs/confirm-dialog';
import WmContainer from '@wavemaker-ai/react-runtime/components/container';
import WmDialogActions from '@wavemaker-ai/react-runtime/components/dialogs/dialog-actions';
import WmForm from '@wavemaker-ai/react-runtime/components/data/form';
import WmFormBody from '@wavemaker-ai/react-runtime/components/data/form/form-body';
import WmLabel from '@wavemaker-ai/react-runtime/components/basic/label';
import WmLoginDialog from '@wavemaker-ai/react-runtime/components/dialogs/login-dialog';
import WmMessage from '@wavemaker-ai/react-runtime/components/basic/message';
import WmPartial from '@wavemaker-ai/react-runtime/components/page/partial';
import WmText from '@wavemaker-ai/react-runtime/components/input/text';
import addPartialScript from './Common.script';
import "./Common.css";
import getVariables from './Common.variables';

const CommonComponent = (props:any) => {
  const pageContext = useAppState();
  const notification= useAppContext()?.notification;
  const fragment = { ...pageContext, notification: notification };

const stateProxy = useProxy()
const Widgets = fragment?.Widgets;
const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();
},[])


  return (
    <React.Fragment>
      
  <WmPartial iswidget="false" data-role="partial"  name="CommonPage" >
    <WmLoginDialog eventsource={fragment?.Actions?.loginAction} listener={fragment} modal={true} name="CommonLoginDialog" iconclass="wi wi-sign-in" title="Login" >
      <WmForm listener={fragment} name="loginform"
            
            
            
            
          >
        <WmFormBody name="wm_form_body_j3ac22ac89">
          <WmContainer listener={fragment} name="wm_container_0110d3026j" className='form-elements' >
            <WmMessage show={false} name="loginmessage" className='app-login-dialog-message'></WmMessage>
            <WmContainer listener={fragment} direction="column" alignment="top-left" gap="4" name="containerlayout1" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px' >
              <WmContainer listener={fragment} direction="row" alignment="top-left" gap="4" name="containerrow1" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px wm-as-stretch' >
                <WmContainer listener={fragment} direction="row" alignment="top-left" gap="4" name="containercolumn1" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px wm-w-fit-content wm-fs-0' >
                  <WmComposite  name="usernamefield">
                    <WmLabel listener={fragment} caption="Username" name="usernamelabel" type="p" className='col-md-3 control-label' ></WmLabel>
                    <WmContainer listener={fragment} name="container1" alignment="top-left" width="fill" layoutWidth="fill" styles={{"width":"100%"}} className='col-md-9' layoutClassName='wm-w-100pct' >
                      <WmText  listener={fragment} placeholder="Enter username" name="j_username" autocomplete="off" autocorrect="off" updateon="default" autocapitalize="off" required={true} className='col-md-8 app-login-dialog-username' ></WmText>
                    </WmContainer>
                  </WmComposite>
                </WmContainer>
              </WmContainer>
              <WmContainer listener={fragment} direction="row" alignment="top-left" gap="4" name="containerrow2" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px wm-as-stretch' >
                <WmContainer listener={fragment} direction="row" alignment="top-left" gap="4" name="containercolumn2" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px wm-w-fit-content wm-fs-0' >
                  <WmComposite  name="passwordfield">
                    <WmLabel listener={fragment} caption="Password" name="passwordlabel" type="p" className='col-md-3 control-label' ></WmLabel>
                    <WmContainer listener={fragment} name="container2" alignment="top-left" width="fill" layoutWidth="fill" styles={{"width":"100%"}} className='col-md-9' layoutClassName='wm-w-100pct' >
                      <WmText  listener={fragment} type="password" placeholder="Enter password" name="j_password" autocomplete="off" autocorrect="off" updateon="default" autocapitalize="off" required={true} className='col-md-8 app-login-dialog-password' ></WmText>
                    </WmContainer>
                  </WmComposite>
                </WmContainer>
              </WmContainer>
            </WmContainer>
          </WmContainer>
        </WmFormBody>
      </WmForm>
      <WmDialogActions   name="dialogactions1">
        <WmButton listener={fragment}  caption="Sign in" data-role="loginbutton" onClick={() => {fragment?.doLogin?.()}} name="button1" className='btn-primary btn-filled'  ></WmButton>
      </WmDialogActions>
    </WmLoginDialog>
    <WmAlertDialog listener={fragment} name="CommonAlertDialog" controller="NotificationDialogController" notificationdialog="alert" message={fragment?.notification?.text} title={fragment?.notification?.title} oktext={fragment?.notification?.okButtonText} alerttype={fragment?.notification?.alerttype} onOk={fragment?.notification?.onOk} onClose={fragment?.notification?.onClose}
    />
    <WmConfirmDialog listener={fragment} name="CommonConfirmDialog" controller="NotificationDialogController" notificationdialog="confirm" message={fragment?.notification?.text} title={fragment?.notification?.title} oktext={fragment?.notification?.okButtonText} canceltext={fragment?.notification?.cancelButtonText} onOk={fragment?.notification?.onOk} onCancel={fragment?.notification?.onCancel}
    />
  </WmPartial>

    </React.Fragment>
  );
}

const ComponentWithPage = BasePartial(
  CommonComponent,
  addPartialScript,
  getVariables,
  {
    componentName: "Common",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:"PARTIAL",
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage {...props}  />;
});
