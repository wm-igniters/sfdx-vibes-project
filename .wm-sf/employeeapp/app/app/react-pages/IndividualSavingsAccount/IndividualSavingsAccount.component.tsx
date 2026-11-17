'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import { useAppState } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import BasePage from '@wavemaker-ai/react-runtime/higherOrder/BasePage';
import { formatMessage ,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmAnchor from '@wavemaker-ai/react-runtime/components/basic/anchor';
import WmButton from '@wavemaker-ai/react-runtime/components/form/button';
import WmCheckbox from '@wavemaker-ai/react-runtime/components/input/default/checkbox';
import WmContainer from '@wavemaker-ai/react-runtime/components/container';
import WmForm from '@wavemaker-ai/react-runtime/components/data/form';
import WmFormBody from '@wavemaker-ai/react-runtime/components/data/form/form-body';
import WmFormField from '@wavemaker-ai/react-runtime/components/data/form/form-field';
import WmIcon from '@wavemaker-ai/react-runtime/components/basic/icon';
import WmLabel from '@wavemaker-ai/react-runtime/components/basic/label';
import WmNav from '@wavemaker-ai/react-runtime/components/navbar/nav';
import WmPartialContainer from '@wavemaker-ai/react-runtime/components/page/partial-container';
import WmPicture from '@wavemaker-ai/react-runtime/components/basic/picture';
import WmRadioset from '@wavemaker-ai/react-runtime/components/input/default/radioset';
import WmSelect from '@wavemaker-ai/react-runtime/components/input/select';
import WmText from '@wavemaker-ai/react-runtime/components/input/text';
import WmWizard from '@wavemaker-ai/react-runtime/components/container/wizard';
import WmWizardAction from '@wavemaker-ai/react-runtime/components/container/wizard/wizard-action';
import WmWizardstep from '@wavemaker-ai/react-runtime/components/container/wizard/wizard-step';
import addPageScript from './IndividualSavingsAccount.script';
import "./IndividualSavingsAccount.css";
import getVariables from './IndividualSavingsAccount.variables';

const IndividualSavingsAccountComponent = (props: any) => {
  const fragment = useAppState();
  const Widgets = fragment?.Widgets;
  const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();

},[])

  return (
    <React.Fragment>
        
  <WmContainer listener={fragment} name="page_root" direction="column" gap="0" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-0px wm-pr-0px wm-pb-0px wm-pl-0px' >
    <WmContainer listener={fragment} name="header_layout" direction="row" gap="auto" alignment="start" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-flex-start wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-24px wm-pr-48px wm-pb-16px wm-pl-48px' >
      <WmPicture listener={fragment} name="sjp_logo" picturesource="resources/images/imagelists/sjp-logo.png" shape="none" resizemode="contain" styles={{"height":"110px","width":"180px"}}   ></WmPicture>
      <WmContainer listener={fragment} name="header_right" direction="column" gap="8" alignment="top-right" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-end wm-gap-8px wm-w-fit-content wm-h-fit-content wm-fs-0' >
        <WmNav 
            listener={fragment}
              name="header_nav" type="pills" layout="horizontal" dataset={fragment?.Variables?.navItems?.dataSet} itemlink="link" className='justifiedNav header-links'
              itemlabel={(item: any) => (item.label)}></WmNav>
        <WmLabel listener={fragment} name="header_welcome" caption="Welcome to St. James&apos;s Place new business submission" type="p" ></WmLabel>
        <WmLabel listener={fragment} name="header_illustration" caption="Illustration prepared by: Raj kumar, Abbadi" type="p" ></WmLabel>
        <WmLabel listener={fragment} name="header_page_title" caption="Individual Savings Account" type="p" ></WmLabel>
      </WmContainer>
    </WmContainer>
    <WmContainer listener={fragment} name="page_body" direction="column" gap="24" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-24px wm-pr-48px wm-pb-32px wm-pl-48px' >
      <WmContainer listener={fragment} name="info_content" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0' >
        <WmContainer listener={fragment} name="info_top_row" direction="row" gap="16" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
          <WmContainer listener={fragment} name="notification_card" direction="row" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-fg-1 wm-minw-0 wm-pt-24px wm-pr-24px wm-pb-24px wm-pl-24px' >
            <WmContainer listener={fragment} name="notification_text" direction="column" gap="16" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-16px wm-h-fit-content wm-fg-1 wm-minw-0' >
              <WmLabel listener={fragment} name="notification_msg1" caption="This form is divided into sections. The areas marked in blue contain questions that need to be answered before you can send this form for processing." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
              <WmLabel listener={fragment} name="notification_msg2" caption="Use the links below to jump to a section or &apos;Complete entire form&apos; to review and add information" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
            </WmContainer>
            <WmButton listener={fragment}  name="notification_close" iconclass="fa fa-times" caption="" styles={{"height":"24px","width":"24px"}} className='btn-close-icon'  ></WmButton>
          </WmContainer>
          <WmContainer listener={fragment} name="need_help_card" direction="row" gap="12" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-w-280px wm-h-fit-content wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
            <WmIcon name="help_phone_icon" iconclass="fa fa-mobile" styles={{"height":"fit-content","width":"fit-content"}} className='icon-help-phone'  ></WmIcon>
            <WmContainer listener={fragment} name="help_text" direction="column" gap="2" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-2px wm-h-fit-content wm-fg-1 wm-minw-0' >
              <WmLabel listener={fragment} name="help_title" caption="Need Help?" type="p" styles={{"height":"fit-content","width":"fit-content"}} >
              </WmLabel>
              <WmLabel listener={fragment} name="help_callus" caption="Call us on" type="p" styles={{"height":"fit-content","width":"fit-content"}} >
              </WmLabel>
              <WmLabel listener={fragment} name="help_number" caption="0345 072 1999" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
            </WmContainer>
          </WmContainer>
        </WmContainer>
        <WmContainer listener={fragment} name="info_actions_row" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-0px wm-pb-16px wm-pl-0px' >
          <WmContainer listener={fragment} name="info_actions_left" direction="column" gap="12" alignment="top-left" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-w-fit-content wm-h-fit-content wm-fs-0' >
            <WmButton listener={fragment}  name="print_action" caption="Print" iconclass="fa fa-print" styles={{"height":"fit-content","width":"fit-content"}} className='btn-link-action'  ></WmButton>
            <WmButton listener={fragment}  name="exit_action" caption="Exit" iconclass="fa fa-times" styles={{"height":"fit-content","width":"fit-content"}} className='btn-link-action'  ></WmButton>
          </WmContainer>
          <WmButton listener={fragment}  name="complete_form_btn" caption="Complete entire form" iconclass="fa fa-caret-right" iconposition="right" styles={{"height":"fit-content","width":"fit-content"}} className='btn-navy-cta'  ></WmButton>
        </WmContainer>
      </WmContainer>
      <WmContainer listener={fragment} name="wizard_card" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-24px wm-pr-24px wm-pb-24px wm-pl-24px' >
        <WmWizard listener={fragment} name="isa_wizard" type="static" stepstyle="justified" defaultstepindex="0" cancelable={false} previousbtnlabel="Back" nextbtnlabel="Continue" donebtnlabel="Continue" width="fill" styles={{"height":"fit-content"}} className='wizard-classic' 
              >
          <WmWizardstep name="step_account_owner" title="Account owner" index={0}
                render={(props:Record<string, any>, onLoad:()=>void) => (<>
            <WmContainer listener={fragment} name="ao_step_body" direction="column" gap="0" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-w-100pct wm-h-fit-content wm-fs-0' >
              <WmLabel listener={fragment} name="ao_heading" caption="Account owner" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
              <WmForm listener={fragment} name="account_owner_form" captionposition="left" captionalign="left" width="fill" styles={{"height":"fit-content"}}
                    
                    
                    
                    
                  >
                <WmFormBody name="wm_form_body_bb03807c32">
                  <WmContainer listener={fragment} name="wm_container_3ea7j5a52d" className='form-elements' >
                    <WmContainer listener={fragment} name="ao_form_body" direction="column" gap="0" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-w-100pct wm-h-fit-content wm-fs-0' >
                      <WmContainer listener={fragment} name="row_title" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    widget="text" displayname="Title" disabled={true} width="fill" defaultvalue={((fragment?.Variables?.svGetEBSData?.dataSet?.screens?.[0]?.screen==="account-owner")?fragment?.Variables?.svGetEBSData?.dataSet?.screens?.[0]?.values?.title:"")} name="form_field61" formKey="form_field61" placeholder="Enter value" formName="account_owner_form" loading={fragment?.Variables?.svGetEBSData?.loading || false} renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="form_field61_formWidget" caption={$formField?.displayname} notag="true" name="form_field61_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="form_field61_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_forename" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_forename" widget="text" displayname="Forename(s)" disabled={true} width="fill" defaultvalue={((fragment?.Variables?.svGetEBSData?.dataSet?.screens?.[0]?.screen==="account-owner")?fragment?.Variables?.svGetEBSData?.dataSet?.screens?.[0]?.values?.forename:"")} formKey="ff_forename" placeholder="Enter value" formName="account_owner_form" loading={fragment?.Variables?.svGetEBSData?.loading || false} renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_forename_formWidget" caption={$formField?.displayname} notag="true" name="ff_forename_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_forename_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_surname" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_surname" widget="text" displayname="Surname" disabled={true} width="fill" defaultvalue={((fragment?.Variables?.svGetEBSData?.dataSet?.screens?.[0]?.screen==="account-owner")?fragment?.Variables?.svGetEBSData?.dataSet?.screens?.[0]?.values?.surname:"")} formKey="ff_surname" placeholder="Enter value" formName="account_owner_form" loading={fragment?.Variables?.svGetEBSData?.loading || false} renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_surname_formWidget" caption={$formField?.displayname} notag="true" name="ff_surname_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_surname_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_dob" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_dob" widget="text" displayname="Date of birth" disabled={true} datavalue="05/08/1965" width="fill" formKey="ff_dob" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_dob_formWidget" caption={$formField?.displayname} notag="true" name="ff_dob_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_dob_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_gender" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_gender" widget="radioset" displayname="Gender" disabled={true} dataset="Male,Female" datavalue="Male" width="fill" isDataSetBound={true} displayfield="ff_gender" datafield="ff_gender" formKey="ff_gender" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_gender_formWidget" caption={$formField?.displayname} notag="true" name="ff_gender_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmRadioset  {...$formField} listener={fragment}  name="ff_gender_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_salutation" direction="column" gap="8" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_salutation" widget="text" displayname="Salutation" datavalue="Mr Sthds" width="fill" formKey="ff_salutation" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_salutation_formWidget" caption={$formField?.displayname} notag="true" name="ff_salutation_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_salutation_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                        <WmLabel listener={fragment} name="ao_salutation_help" caption="This is how the client should be addressed in all formal correspondence from the Administration Centres and will appear after &apos;Dear&apos; e.g. Dear Mr Townsend. You do not need to include the &quot;Dear&quot;." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_addressee" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_addressee" widget="text" displayname="Addressee for correspondence" datavalue="Ro V Sthds" width="fill" formKey="ff_addressee" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_addressee_formWidget" caption={$formField?.displayname} notag="true" name="ff_addressee_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_addressee_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_postcode" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_postcode" widget="text" displayname="Postcode" datavalue="DB7 4DJ" width="fill" formKey="ff_postcode" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_postcode_formWidget" caption={$formField?.displayname} notag="true" name="ff_postcode_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_postcode_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_address" direction="column" gap="8" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_address1" widget="text" displayname="Address" datavalue="27 Tnhpfxein Tosj" width="fill" formKey="ff_address1" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_address1_formWidget" caption={$formField?.displayname} notag="true" name="ff_address1_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_address1_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                        <WmFormField  field="true"   role="form-field"    name="ff_address2" widget="text" width="fill" formKey="ff_address2" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_address2_formWidget" caption={$formField?.displayname} notag="true" name="ff_address2_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_address2_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                        <WmFormField  field="true"   role="form-field"    name="ff_address3" widget="text" width="fill" formKey="ff_address3" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_address3_formWidget" caption={$formField?.displayname} notag="true" name="ff_address3_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_address3_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                        <WmFormField  field="true"   role="form-field"    name="ff_address4" widget="text" datavalue="CGXIJPJCXF" width="fill" formKey="ff_address4" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_address4_formWidget" caption={$formField?.displayname} notag="true" name="ff_address4_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_address4_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_county" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_county" widget="text" displayname="County" width="fill" formKey="ff_county" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_county_formWidget" caption={$formField?.displayname} notag="true" name="ff_county_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_county_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_country" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_country" widget="select" displayname="Country" datavalue="United Kingdom" dataset={fragment?.Variables?.countryOptions?.dataSet} width="fill" isDataSetBound={true} displayfield="ff_country" datafield="ff_country" formKey="ff_country" placeholder="Select value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_country_formWidget" caption={$formField?.displayname} notag="true" name="ff_country_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmSelect  {...$formField} name="ff_country_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                
                                
                                ></WmSelect>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_special" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_special" widget="select" displayname="Does your client require special correspondence?" datavalue="None" dataset={fragment?.Variables?.specialCorrespondenceOptions?.dataSet} width="fill" isDataSetBound={true} displayfield="ff_special" datafield="ff_special" formKey="ff_special" placeholder="Select value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_special_formWidget" caption={$formField?.displayname} notag="true" name="ff_special_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmSelect  {...$formField} name="ff_special_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                
                                
                                ></WmSelect>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_preferred" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_preferred" widget="select" displayname="Preferred contact number" required={true} dataset={fragment?.Variables?.preferredContactOptions?.dataSet} width="fill" isDataSetBound={true} displayfield="ff_preferred" datafield="ff_preferred" formKey="ff_preferred" placeholder="Select value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_preferred_formWidget" caption={$formField?.displayname} notag="true" name="ff_preferred_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmSelect  {...$formField} name="ff_preferred_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} placeholder="- Please select -" dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                
                                
                                ></WmSelect>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_email" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_email" widget="text" displayname="Email address" datavalue="zfufniha4@mferjywkmn.bsf" width="fill" formKey="ff_email" placeholder="Enter value" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_email_formWidget" caption={$formField?.displayname} notag="true" name="ff_email_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ff_email_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_ukresident" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_ukresident" widget="radioset" displayname="Is your client a UK resident for tax purposes?" required={true} dataset="Yes,No" width="fill" isDataSetBound={true} displayfield="ff_ukresident" datafield="ff_ukresident" formKey="ff_ukresident" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_ukresident_formWidget" caption={$formField?.displayname} notag="true" name="ff_ukresident_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmRadioset  {...$formField} listener={fragment}  name="ff_ukresident_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                            </>)}></WmFormField>
                      </WmContainer>
                      <WmContainer listener={fragment} name="row_poa" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_poa" widget="radioset" displayname="Is there a Power of Attorney applying to this client?" required={true} dataset="Yes,No" width="fill" isDataSetBound={true} displayfield="ff_poa" datafield="ff_poa" formKey="ff_poa" formName="account_owner_form" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_poa_formWidget" caption={$formField?.displayname} notag="true" name="ff_poa_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmRadioset  {...$formField} listener={fragment}  name="ff_poa_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                            </>)}></WmFormField>
                      </WmContainer>
                    </WmContainer>
                  </WmContainer>
                </WmFormBody>
              </WmForm>
            </WmContainer>
           </>)}/>
          <WmWizardstep name="step_investment" title="Investment" index={1}
                render={(props:Record<string, any>, onLoad:()=>void) => (<>
            <WmContainer listener={fragment} name="inv_step_body" direction="column" gap="24" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-w-100pct wm-h-fit-content wm-fs-0' >
              <WmLabel listener={fragment} name="inv_heading" caption="Investment" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
              <WmForm listener={fragment} name="investment_form" captionposition="left" captionalign="left" width="fill" styles={{"height":"fit-content"}}
                    
                    
                    
                    
                  >
                <WmFormBody name="wm_form_body_j1fh3a8f17">
                  <WmContainer listener={fragment} name="wm_container_bcih6h850f" className='form-elements' >
                    <WmContainer listener={fragment} name="inv_form_body" direction="column" gap="24" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-w-100pct wm-h-fit-content wm-fs-0' >
                      <WmContainer listener={fragment} name="section_account_details" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="acc_details_heading" caption="Account details" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="row_additional_investment" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_additional_investment" widget="radioset" displayname="Is this an additional investment to an existing Individual Savings Account?" dataset="Yes,No" datavalue="No" width="fill" isDataSetBound={true} displayfield="ff_additional_investment" datafield="ff_additional_investment" formKey="ff_additional_investment" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_additional_investment_formWidget" caption={$formField?.displayname} notag="true" name="ff_additional_investment_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_additional_investment_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmLabel listener={fragment} name="acc_details_help" caption="Existing account means a client&apos;s existing ISA holding regardless of whether contributions have been made in the current tax year" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                      </WmContainer>
                      <WmContainer listener={fragment} name="section_aft" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="aft_heading" caption="Automatic fund transfer" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="aft_row" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmLabel listener={fragment} name="aft_question" caption="Do you want to use the Automatic Fund Transfer (AFT) facility for this investment?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          <WmContainer listener={fragment} name="aft_answer" direction="column" gap="6" alignment="top-left" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="aft_single_contrib_lbl" caption="Single contributions" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_aft" widget="radioset" dataset="Yes,No" datavalue="No" isDataSetBound={true} displayfield="ff_aft" datafield="ff_aft" formKey="ff_aft" formName="investment_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_aft_formWidget" caption={$formField?.displayname} notag="true" name="ff_aft_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmRadioset  {...$formField} listener={fragment}  name="ff_aft_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                                </>)}></WmFormField>
                          </WmContainer>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="section_single_contributions" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="sc_heading" caption="Single contributions" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="row_internal_replacement" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_internal_replacement" widget="radioset" displayname="Is the contribution inclusive of an internal replacement?" dataset="Yes,No" datavalue="No" width="fill" isDataSetBound={true} displayfield="ff_internal_replacement" datafield="ff_internal_replacement" formKey="ff_internal_replacement" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_internal_replacement_formWidget" caption={$formField?.displayname} notag="true" name="ff_internal_replacement_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_internal_replacement_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_amount" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_amount" widget="text" displayname="Amount" datavalue="10000.00" width="fill" formKey="ff_amount" placeholder="Enter value" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_amount_formWidget" caption={$formField?.displayname} notag="true" name="ff_amount_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmText  {...$formField} listener={fragment} name="ff_amount_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_concession" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_concession" widget="text" displayname="Concession number:" width="fill" formKey="ff_concession" placeholder="Enter value" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_concession_formWidget" caption={$formField?.displayname} notag="true" name="ff_concession_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmText  {...$formField} listener={fragment} name="ff_concession_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_charges_changing" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_charges_changing" widget="radioset" displayname="Are any of the charges changing from standard rates?" dataset="Yes,No" datavalue="No" width="fill" isDataSetBound={true} displayfield="ff_charges_changing" datafield="ff_charges_changing" formKey="ff_charges_changing" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_charges_changing_formWidget" caption={$formField?.displayname} notag="true" name="ff_charges_changing_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_charges_changing_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="iac_summary" direction="column" gap="8" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="iac_header_row" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="iac_spacer_hdr" caption="" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_total_hdr" caption="Total investment amount" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_std_hdr" caption="Standard IAC rate" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_applied_hdr" caption="IAC rate to be applied" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_tobe_hdr" caption="IAC to be applied" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmContainer listener={fragment} name="iac_value_row" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="iac_spacer_val" caption="" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_total_val" caption="£ 10000.00" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_std_val" caption="3.00 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_applied_val" caption="3.00 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="iac_tobe_val" caption="£ 300.00" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="section_fund_selection" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmContainer listener={fragment} name="fund_sel_header_row" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmLabel listener={fragment} name="fund_sel_heading" caption="Single contribution fund selection" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          <WmLabel listener={fragment} name="fund_sel_accum_hdr" caption="Accumulation" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                        </WmContainer>
                        <WmContainer listener={fragment} name="fund_sel_row" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_fund_selected" widget="text" displayname="Fund selected:" datavalue="Polaris 1" disabled={true} captionposition="left" width="fill" formKey="ff_fund_selected" placeholder="Enter value" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_fund_selected_formWidget" caption={$formField?.displayname} notag="true" name="ff_fund_selected_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmText  {...$formField} listener={fragment} name="ff_fund_selected_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                              </>)}></WmFormField>
                          <WmContainer listener={fragment} name="accum_field" direction="row" gap="6" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                            <WmFormField  field="true"   role="form-field"    name="ff_accumulation" widget="text" datavalue="100" formKey="ff_accumulation" placeholder="Enter value" formName="investment_form" styles={{"width":"80px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_accumulation_formWidget" caption={$formField?.displayname} notag="true" name="ff_accumulation_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_accumulation_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                            <WmLabel listener={fragment} name="accum_pct" caption="%" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="section_tax_year" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="tax_year_heading" caption="Tax year" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="row_tax_year" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_tax_year" widget="select" displayname="Tax year (for ISA contributions):" datavalue="2026/2027" dataset={fragment?.Variables?.taxYearOptions?.dataSet} width="fill" isDataSetBound={true} displayfield="ff_tax_year" datafield="ff_tax_year" formKey="ff_tax_year" placeholder="Select value" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_tax_year_formWidget" caption={$formField?.displayname} notag="true" name="ff_tax_year_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmSelect  {...$formField} name="ff_tax_year_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                  
                                  
                                  ></WmSelect>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="section_payment_details" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="payment_details_heading" caption="Payment details" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmLabel listener={fragment} name="single_payments_heading" caption="Single payments" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="row_payment_method" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_payment_method" widget="select" displayname="Payment method:" required={true} dataset={fragment?.Variables?.paymentMethodOptions?.dataSet} width="fill" isDataSetBound={true} displayfield="ff_payment_method" datafield="ff_payment_method" formKey="ff_payment_method" placeholder="Select value" formName="investment_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_payment_method_formWidget" caption={$formField?.displayname} notag="true" name="ff_payment_method_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmSelect  {...$formField} name="ff_payment_method_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} placeholder="- Please select -" dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                  
                                  
                                  ></WmSelect>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmButton listener={fragment}  name="add_single_payment" caption="Add single payment" iconclass="fa fa-plus" styles={{"height":"fit-content","width":"fit-content"}} className='btn-link-action'  >
                        </WmButton>
                        <WmLabel listener={fragment} name="payment_error1" caption="Please add at least one single payment" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="payment_total_row" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmLabel listener={fragment} name="payment_total_lbl" caption="Total of payments from the account owner:" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmLabel listener={fragment} name="payment_total_val" caption="£ 0.00" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                        </WmContainer>
                        <WmLabel listener={fragment} name="payment_error2" caption="Total payments from account owner does not equal total required." type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                      </WmContainer>
                    </WmContainer>
                  </WmContainer>
                </WmFormBody>
              </WmForm>
            </WmContainer>
           </>)}/>
          <WmWizardstep name="step_benefits" title="Benefits" index={2}
                render={(props:Record<string, any>, onLoad:()=>void) => (<>
            <WmContainer listener={fragment} name="ben_step_body" direction="column" gap="24" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-w-100pct wm-h-fit-content wm-fs-0' >
              <WmLabel listener={fragment} name="ben_heading" caption="Benefits" width="fill" type="p" styles={{"height":"fit-content"}} >
              </WmLabel>
              <WmForm listener={fragment} name="benefits_form" captionposition="left" captionalign="left" width="fill" styles={{"height":"fit-content"}}
                    
                    
                    
                    
                  >
                <WmFormBody name="wm_form_body_460hi8e4b7">
                  <WmContainer listener={fragment} name="wm_container_c1e128hhfi" className='form-elements' >
                    <WmContainer listener={fragment} name="ben_form_body" direction="column" gap="24" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-w-100pct wm-h-fit-content wm-fs-0' >
                      <WmContainer listener={fragment} name="section_regular_withdrawals" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="regular_withdrawals_heading" caption="Regular withdrawals" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="row_regular_withdrawals" direction="column" gap="0" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmFormField  field="true"   role="form-field"    name="ff_regular_withdrawals" widget="radioset" displayname="Does the account owner wish to take regular withdrawals?" dataset="Yes,No" datavalue="No" width="fill" isDataSetBound={true} displayfield="ff_regular_withdrawals" datafield="ff_regular_withdrawals" formKey="ff_regular_withdrawals" formName="benefits_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_regular_withdrawals_formWidget" caption={$formField?.displayname} notag="true" name="ff_regular_withdrawals_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_regular_withdrawals_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmContainer>
                    </WmContainer>
                  </WmContainer>
                </WmFormBody>
              </WmForm>
            </WmContainer>
           </>)}/>
          <WmWizardstep name="step_additional" title="Additional information" index={3}
                render={(props:Record<string, any>, onLoad:()=>void) => (<>
            <WmContainer listener={fragment} name="add_step_body" direction="column" gap="24" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-w-100pct wm-h-fit-content wm-fs-0' >
              <WmLabel listener={fragment} name="add_heading" caption="Additional information" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
              <WmForm listener={fragment} name="additional_form" captionposition="left" captionalign="left" width="fill" styles={{"height":"fit-content"}}
                    
                    
                    
                    
                  >
                <WmFormBody name="wm_form_body_19hb8gd77d">
                  <WmContainer listener={fragment} name="wm_container_9i320i98g8" className='form-elements' >
                    <WmContainer listener={fragment} name="add_form_body" direction="column" gap="24" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-w-100pct wm-h-fit-content wm-fs-0' >
                      <WmContainer listener={fragment} name="section_marketing" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="marketing_heading" caption="Marketing and documentation" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="row_marketing_optout" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmLabel listener={fragment} name="marketing_spacer" caption="" type="p" styles={{"height":"fit-content","width":"260px"}} ></WmLabel>
                          <WmContainer listener={fragment} name="marketing_help_icon" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="marketing_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_marketing_optout" widget="checkbox" caption="Client(s) do not wish to be contacted for marketing purposes?" datavalue="true" width="fill" formKey="ff_marketing_optout" formName="additional_form" renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_marketing_optout_formWidget" caption={$formField?.displayname} notag="true" name="ff_marketing_optout_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmCheckbox  {...$formField} listener={fragment} name="ff_marketing_optout_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} caption={$formField?.caption} checkedvalue={$formField?.checkedvalue || true} uncheckedvalue={$formField?.uncheckedvalue || false} styles={{"height":"100%"}}>
                            </WmCheckbox>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_documents_sent" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmLabel listener={fragment} name="documents_sent_lbl" caption="The new investment documents will be sent to:" type="p" styles={{"height":"fit-content","width":"260px"}} ></WmLabel>
                          <WmContainer listener={fragment} name="documents_help_icon" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="documents_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_documents_sent" widget="select" datavalue="Bmd Sthds" dataset={fragment?.Variables?.documentsSentToOptions?.dataSet} isDataSetBound={true} displayfield="ff_documents_sent" datafield="ff_documents_sent" formKey="ff_documents_sent" placeholder="Select value" formName="additional_form" styles={{"width":"320px"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_documents_sent_formWidget" caption={$formField?.displayname} notag="true" name="ff_documents_sent_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmSelect  {...$formField} name="ff_documents_sent_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                  
                                  
                                  ></WmSelect>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="section_advice" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="advice_heading" caption="Advice" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="row_advice_overseas" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_overseas_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_overseas_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_overseas_lbl" caption="Is anyone involved in this investment overseas?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmContainer listener={fragment} name="advice_overseas_help" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_overseas_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_overseas" widget="radioset" required={true} dataset="Yes,No" isDataSetBound={true} displayfield="ff_advice_overseas" datafield="ff_advice_overseas" formKey="ff_advice_overseas" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_overseas_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_overseas_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_advice_overseas_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_advice_assistance" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_assistance_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_assistance_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_assistance_lbl" caption="Does this investment contain anyone who falls under the client assistance process?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmContainer listener={fragment} name="advice_assistance_help" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_assistance_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_assistance" widget="radioset" required={true} dataset="Yes,No" isDataSetBound={true} displayfield="ff_advice_assistance" datafield="ff_advice_assistance" formKey="ff_advice_assistance" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_assistance_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_assistance_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_advice_assistance_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_advice_care" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_care_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_care_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_care_lbl" caption="Is anyone involved in this investment, receiving or about to receive long term residential / home care?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmContainer listener={fragment} name="advice_care_help" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_care_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_care" widget="radioset" required={true} dataset="Yes,No" isDataSetBound={true} displayfield="ff_advice_care" datafield="ff_advice_care" formKey="ff_advice_care" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_care_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_care_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_advice_care_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_advice_initiated" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_initiated_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_initiated_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_initiated_lbl" caption="Client initiated investment?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_initiated" widget="select" required={true} dataset={fragment?.Variables?.clientInitiatedOptions?.dataSet} isDataSetBound={true} displayfield="ff_advice_initiated" datafield="ff_advice_initiated" formKey="ff_advice_initiated" placeholder="Select value" formName="additional_form" styles={{"width":"320px"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_initiated_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_initiated_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmSelect  {...$formField} name="ff_advice_initiated_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} placeholder="- Please select -" dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                  
                                  
                                  ></WmSelect>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_advice_business" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_business_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_business_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_business_lbl" caption="Has this product or service been sold in relation to a business?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmContainer listener={fragment} name="advice_business_help" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_business_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_business" widget="radioset" required={true} dataset="Yes,No" isDataSetBound={true} displayfield="ff_advice_business" datafield="ff_advice_business" formKey="ff_advice_business" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_business_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_business_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_advice_business_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_advice_specialist" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_specialist_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_specialist_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_specialist_lbl" caption="Has this investment received specialist approval from Business Assurance for any reason?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmContainer listener={fragment} name="advice_specialist_help" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_specialist_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_specialist" widget="radioset" required={true} dataset="Yes,No" isDataSetBound={true} displayfield="ff_advice_specialist" datafield="ff_advice_specialist" formKey="ff_advice_specialist" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_specialist_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_specialist_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_advice_specialist_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_advice_cancelling" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_cancelling_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_cancelling_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_cancelling_lbl" caption="As a consequence of this investment, will your client be cancelling, lapsing, cashing in or partially cashing in any existing investment plan (life, endowment, pension or unit trust)?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_cancelling" widget="radioset" required={true} dataset="Yes,No" isDataSetBound={true} displayfield="ff_advice_cancelling" datafield="ff_advice_cancelling" formKey="ff_advice_cancelling" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_cancelling_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_cancelling_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_advice_cancelling_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_advice_consolidated" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="advice_consolidated_q" direction="row" gap="8" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-420px wm-h-fit-content wm-fs-0' >
                            <WmLabel listener={fragment} name="advice_consolidated_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="advice_consolidated_lbl" caption="Have there been any investments made by this client in the last 6 months that have not been consolidated for the purposes of calculating the IAC?" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_advice_consolidated" widget="radioset" required={true} dataset="Yes,No" isDataSetBound={true} displayfield="ff_advice_consolidated" datafield="ff_advice_consolidated" formKey="ff_advice_consolidated" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_advice_consolidated_formWidget" caption={$formField?.displayname} notag="true" name="ff_advice_consolidated_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_advice_consolidated_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="section_partner" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="partner_heading" caption="Partner details" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="partner_grid" direction="column" gap="8" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmContainer listener={fragment} name="partner_grid_header" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="partner_hdr_spacer" caption="" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                            <WmLabel listener={fragment} name="partner_hdr_id" caption="" type="p" styles={{"height":"fit-content","width":"160px"}} ></WmLabel>
                            <WmLabel listener={fragment} name="partner_hdr_name" caption="" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="partner_hdr_iaf" caption="% of IAF" type="p" styles={{"height":"fit-content","width":"80px"}} ></WmLabel>
                          </WmContainer>
                          <WmContainer listener={fragment} name="partner_row_first" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="partner_first_lbl" caption="First Partner:" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_first_id" widget="text" datavalue="930099U" formKey="ff_partner_first_id" placeholder="Enter value" formName="additional_form" styles={{"width":"160px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_first_id_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_first_id_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_first_id_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                            <WmLabel listener={fragment} name="partner_first_name" caption="Alastair Lindsay LMBU 45" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_first_iaf" widget="text" datavalue="100" formKey="ff_partner_first_iaf" placeholder="Enter value" formName="additional_form" styles={{"width":"80px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_first_iaf_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_first_iaf_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_first_iaf_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                          </WmContainer>
                          <WmContainer listener={fragment} name="partner_row_second" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="partner_second_lbl" caption="Second Partner:" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_second_id" widget="text" disabled={true} formKey="ff_partner_second_id" placeholder="Enter value" formName="additional_form" styles={{"width":"160px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_second_id_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_second_id_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_second_id_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                            <WmLabel listener={fragment} name="partner_second_name" caption="" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_second_iaf" widget="text" disabled={true} formKey="ff_partner_second_iaf" placeholder="Enter value" formName="additional_form" styles={{"width":"80px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_second_iaf_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_second_iaf_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_second_iaf_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                          </WmContainer>
                          <WmContainer listener={fragment} name="partner_row_third" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="partner_third_lbl" caption="Third Partner:" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_third_id" widget="text" disabled={true} formKey="ff_partner_third_id" placeholder="Enter value" formName="additional_form" styles={{"width":"160px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_third_id_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_third_id_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_third_id_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                            <WmLabel listener={fragment} name="partner_third_name" caption="" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_third_iaf" widget="text" disabled={true} formKey="ff_partner_third_iaf" placeholder="Enter value" formName="additional_form" styles={{"width":"80px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_third_iaf_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_third_iaf_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_third_iaf_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                          </WmContainer>
                          <WmContainer listener={fragment} name="partner_row_fourth" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="partner_fourth_lbl" caption="Fourth Partner:" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_fourth_id" widget="text" disabled={true} formKey="ff_partner_fourth_id" placeholder="Enter value" formName="additional_form" styles={{"width":"160px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_fourth_id_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_fourth_id_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_fourth_id_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                            <WmLabel listener={fragment} name="partner_fourth_name" caption="" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmFormField  field="true"   role="form-field"    name="ff_partner_fourth_iaf" widget="text" disabled={true} formKey="ff_partner_fourth_iaf" placeholder="Enter value" formName="additional_form" styles={{"width":"80px"}} renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_fourth_iaf_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_fourth_iaf_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmText  {...$formField} listener={fragment} name="ff_partner_fourth_iaf_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                                </>)}></WmFormField>
                          </WmContainer>
                          <WmContainer listener={fragment} name="partner_total_row" direction="row" gap="16" alignment="middle-right" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-end wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                            <WmLabel listener={fragment} name="partner_total_val" caption="100%" type="p" styles={{"height":"fit-content","width":"80px"}} ></WmLabel>
                          </WmContainer>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_partner_oaf" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmLabel listener={fragment} name="partner_oaf_lbl" caption="Are the Partner remuneration splits for OAF the same as IAF?" type="p" styles={{"height":"fit-content","width":"420px"}} ></WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ff_partner_oaf" widget="radioset" dataset="Yes,No" datavalue="Yes" isDataSetBound={true} displayfield="ff_partner_oaf" datafield="ff_partner_oaf" formKey="ff_partner_oaf" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_oaf_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_oaf_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_partner_oaf_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_partner_servicing" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmLabel listener={fragment} name="partner_servicing_lbl" caption="Client servicing Partner:" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                          <WmContainer listener={fragment} name="partner_servicing_help" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="partner_servicing_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                          <WmFormField  field="true"   role="form-field"    name="ff_partner_servicing_id" widget="text" disabled={true} datavalue="930099U" formKey="ff_partner_servicing_id" placeholder="Enter value" formName="additional_form" styles={{"width":"160px"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_servicing_id_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_servicing_id_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmText  {...$formField} listener={fragment} name="ff_partner_servicing_id_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                              </>)}></WmFormField>
                          <WmLabel listener={fragment} name="partner_servicing_name" caption="Alastair Lindsay" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_partner_account" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmLabel listener={fragment} name="partner_account_lbl" caption="Is the account servicing Partner the same as the client servicing Partner?" type="p" styles={{"height":"fit-content","width":"420px"}} ></WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ff_partner_account" widget="radioset" dataset="Yes,No" datavalue="Yes" isDataSetBound={true} displayfield="ff_partner_account" datafield="ff_partner_account" formKey="ff_partner_account" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_account_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_account_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_partner_account_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="row_partner_advice" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                          <WmLabel listener={fragment} name="partner_advice_lbl" caption="Is the advice Partner the same as the client servicing Partner" type="p" styles={{"height":"fit-content","width":"420px"}} ></WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ff_partner_advice" widget="radioset" dataset="Yes,No" datavalue="Yes" isDataSetBound={true} displayfield="ff_partner_advice" datafield="ff_partner_advice" formKey="ff_partner_advice" formName="additional_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_partner_advice_formWidget" caption={$formField?.displayname} notag="true" name="ff_partner_advice_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_partner_advice_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmContainer>
                    </WmContainer>
                  </WmContainer>
                </WmFormBody>
              </WmForm>
            </WmContainer>
           </>)}/>
          <WmWizardstep name="step_confirm" title="Confirm" index={4}
                render={(props:Record<string, any>, onLoad:()=>void) => (<>
            <WmContainer listener={fragment} name="con_step_body" direction="column" gap="16" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-16px wm-w-100pct wm-h-fit-content wm-fs-0' >
              <WmLabel listener={fragment} name="con_heading" caption="Confirm" width="fill" type="p" styles={{"height":"fit-content"}} >
              </WmLabel>
              <WmContainer listener={fragment} name="con_hdr_account_owner" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                <WmLabel listener={fragment} name="con_ao_title" caption="Account owner" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                <WmContainer listener={fragment} name="con_ao_link" direction="row" gap="6" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                  <WmLabel listener={fragment} name="con_ao_viewdetails" caption="View details" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                  <WmIcon name="con_ao_chevron" iconclass="fa fa-angle-double-down" styles={{"height":"fit-content","width":"fit-content"}}  ></WmIcon>
                </WmContainer>
              </WmContainer>
              <WmContainer listener={fragment} name="con_hdr_investment_payments" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                <WmLabel listener={fragment} name="con_ip_title" caption="Investment payments" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                <WmContainer listener={fragment} name="con_ip_link" direction="row" gap="6" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                  <WmLabel listener={fragment} name="con_ip_viewdetails" caption="View details" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                  <WmIcon name="con_ip_chevron" iconclass="fa fa-angle-double-down" styles={{"height":"fit-content","width":"fit-content"}}  ></WmIcon>
                </WmContainer>
              </WmContainer>
              <WmContainer listener={fragment} name="con_investment_details" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                <WmLabel listener={fragment} name="con_inv_details_heading" caption="Investment details" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                <WmLabel listener={fragment} name="con_single_contrib_heading" caption="Single contributions" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                <WmContainer listener={fragment} name="con_row_internal_replacement" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                  <WmLabel listener={fragment} name="con_internal_replacement_q" caption="Is the contribution inclusive of an internal replacement?" type="p" styles={{"height":"fit-content","width":"320px"}} ></WmLabel>
                  <WmLabel listener={fragment} name="con_internal_replacement_a" caption="No" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                </WmContainer>
                <WmContainer listener={fragment} name="con_row_charges_changing" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} className='app-container-bg-white-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                  <WmLabel listener={fragment} name="con_charges_changing_q" caption="Are any of the charges changing from standard rates?" type="p" styles={{"height":"fit-content","width":"320px"}} ></WmLabel>
                  <WmLabel listener={fragment} name="con_charges_changing_a" caption="No" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                </WmContainer>
                <WmContainer listener={fragment} name="con_charges_table" direction="column" gap="8" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-h-fit-content wm-as-stretch wm-fs-0' >
                  <WmContainer listener={fragment} name="con_charges_header" direction="row" gap="16" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_charges_hdr_label" caption="Charges" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_hdr_std" caption="Standard" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_hdr_applied" caption="Rate to be applied" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="con_charges_row_iac" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_charges_iac_lbl" caption="Initial Advice Charge:" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_iac_std" caption="3.00 %" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_iac_applied" caption="3.00 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="con_charges_row_oac" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_charges_oac_lbl" caption="Ongoing Advice Charge:" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_oac_std" caption="0.80 %" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_oac_applied" caption="0.80 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="con_charges_row_product" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_charges_product_lbl" caption="Product Charge:" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_product_std" caption="0.27 %" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_charges_product_applied" caption="0.27 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                </WmContainer>
                <WmContainer listener={fragment} name="con_fees_table" direction="column" gap="8" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-h-fit-content wm-as-stretch wm-fs-0' >
                  <WmContainer listener={fragment} name="con_fees_header" direction="row" gap="16" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_fees_hdr_label" caption="Fees" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_hdr_std" caption="Standard" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_hdr_applied" caption="Rate to be applied" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="con_fees_row_iaf" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_fees_iaf_lbl" caption="Initial Advice Fee:" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_iaf_std" caption="2.00 %" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_iaf_applied" caption="2.00 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="con_fees_row_credit" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_fees_credit_lbl" caption="Credit:" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_credit_std" caption="2.00 %" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_credit_applied" caption="2.00 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="con_fees_row_oaf" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                    <WmLabel listener={fragment} name="con_fees_oaf_lbl" caption="Ongoing Advice Fee:" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_oaf_std" caption="0.55 %" type="p" styles={{"height":"fit-content","width":"140px"}} ></WmLabel>
                    <WmLabel listener={fragment} name="con_fees_oaf_applied" caption="0.55 %" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  </WmContainer>
                </WmContainer>
                <WmContainer listener={fragment} name="con_fund_sel_header" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0' >
                  <WmLabel listener={fragment} name="con_fund_sel_heading" caption="Single contribution fund selection" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  <WmLabel listener={fragment} name="con_fund_sel_accum_hdr" caption="Accumulation" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                </WmContainer>
                <WmContainer listener={fragment} name="con_fund_sel_row" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                  <WmLabel listener={fragment} name="con_fund_selected_lbl" caption="Fund selected:" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                  <WmLabel listener={fragment} name="con_fund_selected_name" caption="Polaris 1" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  <WmLabel listener={fragment} name="con_fund_selected_pct" caption="100%" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                </WmContainer>
                <WmContainer listener={fragment} name="con_fund_total_row" direction="row" gap="16" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-16px wm-h-fit-content wm-as-stretch wm-fs-0' >
                  <WmLabel listener={fragment} name="con_fund_total_spacer" caption="" type="p" styles={{"height":"fit-content","width":"220px"}} ></WmLabel>
                  <WmLabel listener={fragment} name="con_fund_total_lbl" caption="Fund total:" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                  <WmLabel listener={fragment} name="con_fund_total_pct" caption="100%" type="p" styles={{"height":"fit-content","width":"200px"}} ></WmLabel>
                </WmContainer>
              </WmContainer>
              <WmForm listener={fragment} name="confirm_form" captionposition="left" captionalign="left" width="fill" styles={{"height":"fit-content"}}
                    
                    
                    
                    
                  >
                <WmFormBody name="wm_form_body_4j5c1gegag">
                  <WmContainer listener={fragment} name="wm_container_i633dh41g5" className='form-elements' >
                    <WmContainer listener={fragment} name="con_form_body" direction="column" gap="16" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-16px wm-w-100pct wm-h-fit-content wm-fs-0' >
                      <WmContainer listener={fragment} name="con_confirm_banner1" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_con_banner1" widget="checkbox" caption="" formKey="ff_con_banner1" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_banner1_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_banner1_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmCheckbox  {...$formField} listener={fragment} name="ff_con_banner1_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} caption={$formField?.caption} checkedvalue={$formField?.checkedvalue || true} uncheckedvalue={$formField?.uncheckedvalue || false} styles={{"height":"100%"}}>
                          </WmCheckbox>
                            </>)}></WmFormField>
                        <WmLabel listener={fragment} name="con_banner1_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                        <WmLabel listener={fragment} name="con_banner1_text" caption="I confirm that these investment and remuneration details are correct as they cannot be amended later." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                      </WmContainer>
                      <WmContainer listener={fragment} name="con_hdr_benefits" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmLabel listener={fragment} name="con_ben_title" caption="Benefits" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="con_ben_link" direction="row" gap="6" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                          <WmLabel listener={fragment} name="con_ben_viewdetails" caption="View details" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmIcon name="con_ben_chevron" iconclass="fa fa-angle-double-down" styles={{"height":"fit-content","width":"fit-content"}}  ></WmIcon>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="con_hdr_additional" direction="row" gap="auto" alignment="center" width="fill" styles={{"width":"100%"}} className='app-container-bg-light-primary-0' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmLabel listener={fragment} name="con_add_title" caption="Additional information" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="con_add_link" direction="row" gap="6" alignment="middle-left" layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                          <WmLabel listener={fragment} name="con_add_viewdetails" caption="View details" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmIcon name="con_add_chevron" iconclass="fa fa-angle-double-down" styles={{"height":"fit-content","width":"fit-content"}}  ></WmIcon>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="con_declaration" direction="column" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-16px wm-pr-20px wm-pb-16px wm-pl-20px' >
                        <WmLabel listener={fragment} name="con_decl_heading" caption="Declaration" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmLabel listener={fragment} name="con_decl_intro" caption="By sending this form you confirm that a Confidential Financial Review has been completed/updated and the client has accepted the recommendations based on the information provided." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="con_decl_suitability_row" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmLabel listener={fragment} name="con_decl_suitability_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmLabel listener={fragment} name="con_decl_suitability_q" caption="Has the suitability letter been completed?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ff_con_suitability" widget="radioset" dataset="Yes,No" isDataSetBound={true} displayfield="ff_con_suitability" datafield="ff_con_suitability" formKey="ff_con_suitability" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_suitability_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_suitability_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_con_suitability_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmLabel listener={fragment} name="con_decl_suitability_note" caption="Note: A Suitability Letter (if applicable) must be sent to the Client as soon as possible after the recommendation is made and before the investment issues." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        <WmContainer listener={fragment} name="con_decl_cb_eligible_row" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmFormField  field="true"   role="form-field"    name="ff_con_eligible" widget="checkbox" caption="" formKey="ff_con_eligible" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_eligible_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_eligible_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmCheckbox  {...$formField} listener={fragment} name="ff_con_eligible_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} caption={$formField?.caption} checkedvalue={$formField?.checkedvalue || true} uncheckedvalue={$formField?.uncheckedvalue || false} styles={{"height":"100%"}}>
                            </WmCheckbox>
                              </>)}></WmFormField>
                          <WmLabel listener={fragment} name="con_eligible_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmLabel listener={fragment} name="con_eligible_text" caption="I confirm that the account owner has declared that they are eligible to invest in an ISA" width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          <WmContainer listener={fragment} name="con_eligible_help" direction="column" gap="0" alignment="center" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-center wm-ai-space-between wm-gap-0px wm-w-24px wm-h-24px wm-fs-0' >
                            <WmLabel listener={fragment} name="con_eligible_help_q" caption="?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          </WmContainer>
                        </WmContainer>
                        <WmContainer listener={fragment} name="con_decl_cb_kiids_row" direction="row" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmFormField  field="true"   role="form-field"    name="ff_con_kiids" widget="checkbox" caption="" formKey="ff_con_kiids" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_kiids_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_kiids_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmCheckbox  {...$formField} listener={fragment} name="ff_con_kiids_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} caption={$formField?.caption} checkedvalue={$formField?.checkedvalue || true} uncheckedvalue={$formField?.uncheckedvalue || false} styles={{"height":"100%"}}>
                            </WmCheckbox>
                              </>)}></WmFormField>
                          <WmLabel listener={fragment} name="con_kiids_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmContainer listener={fragment} name="con_kiids_text_col" direction="column" gap="4" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px wm-h-fit-content wm-fg-1 wm-minw-0' >
                            <WmLabel listener={fragment} name="con_kiids_text" caption="I confirm that the client has seen the latest Key Investor Information Documents (KIIDs) for the trusts in which they are investing." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                            <WmLabel listener={fragment} name="con_kiids_note" caption="Note: The relevant KIIDs must be provided to the Client, either via www.sjp.co.uk/KIID or in hard copy, before the plan can be issued." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                          </WmContainer>
                        </WmContainer>
                        <WmContainer listener={fragment} name="con_decl_cb_scdd_row" direction="row" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmFormField  field="true"   role="form-field"    name="ff_con_scdd" widget="checkbox" caption="" formKey="ff_con_scdd" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_scdd_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_scdd_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmCheckbox  {...$formField} listener={fragment} name="ff_con_scdd_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} caption={$formField?.caption} checkedvalue={$formField?.checkedvalue || true} uncheckedvalue={$formField?.uncheckedvalue || false} styles={{"height":"100%"}}>
                            </WmCheckbox>
                              </>)}></WmFormField>
                          <WmLabel listener={fragment} name="con_scdd_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmLabel listener={fragment} name="con_scdd_text" caption="I confirm that the client has received and had explained to them the latest Services and Costs Disclosure Document and that they have clearly understood and agreed to my advice charges as set out in the SCDD and their personalised illustration." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        </WmContainer>
                        <WmContainer listener={fragment} name="con_decl_cb_notrades_row" direction="row" gap="12" alignment="top-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmFormField  field="true"   role="form-field"    name="ff_con_notrades" widget="checkbox" caption="" formKey="ff_con_notrades" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_notrades_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_notrades_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmCheckbox  {...$formField} listener={fragment} name="ff_con_notrades_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} caption={$formField?.caption} checkedvalue={$formField?.checkedvalue || true} uncheckedvalue={$formField?.uncheckedvalue || false} styles={{"height":"100%"}}>
                            </WmCheckbox>
                              </>)}></WmFormField>
                          <WmLabel listener={fragment} name="con_notrades_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmLabel listener={fragment} name="con_notrades_text" caption="No trades will be executed until the full investment amount has been received. Please confirm the client is aware they will remain out of the market until full receipt of all expected monies." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                        </WmContainer>
                        <WmContainer listener={fragment} name="con_decl_partner_row" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0' >
                          <WmLabel listener={fragment} name="con_partner_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmLabel listener={fragment} name="con_partner_q" caption="Has this declaration been completed on behalf of the Partner?" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ff_con_partner" widget="radioset" dataset="Yes,No" isDataSetBound={true} displayfield="ff_con_partner" datafield="ff_con_partner" formKey="ff_con_partner" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_partner_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_partner_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ff_con_partner_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmContainer>
                      <WmContainer listener={fragment} name="con_confirm_banner2" direction="row" gap="12" alignment="middle-left" width="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-h-fit-content wm-as-stretch wm-fs-0 wm-pt-12px wm-pr-16px wm-pb-12px wm-pl-16px' >
                        <WmFormField  field="true"   role="form-field"    name="ff_con_banner2" widget="checkbox" caption="" formKey="ff_con_banner2" formName="confirm_form" styles={{"width":"fit-content"}} renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ff_con_banner2_formWidget" caption={$formField?.displayname} notag="true" name="ff_con_banner2_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmCheckbox  {...$formField} listener={fragment} name="ff_con_banner2_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} caption={$formField?.caption} checkedvalue={$formField?.checkedvalue || true} uncheckedvalue={$formField?.uncheckedvalue || false} styles={{"height":"100%"}}>
                          </WmCheckbox>
                            </>)}></WmFormField>
                        <WmLabel listener={fragment} name="con_banner2_mark" caption="!" type="p" styles={{"height":"fit-content","width":"fit-content"}} ></WmLabel>
                        <WmLabel listener={fragment} name="con_banner2_text" caption="The details of this application cannot be amended once submitted. Please confirm they are correct." width="fill" type="p" styles={{"height":"fit-content"}} ></WmLabel>
                      </WmContainer>
                    </WmContainer>
                  </WmContainer>
                </WmFormBody>
              </WmForm>
            </WmContainer>
           </>)}/>
          <WmWizardAction listener={fragment} actionsalignment={fragment?.Widgets?.isa_wizard?.actionsalignment}  name="wizardaction1" index={5}
          renderActions={(actions: any) => (<>
            <WmAnchor listener={fragment} name="anchor1" caption="Skip »" show={(fragment?.Widgets?.isa_wizard?.skippable || false)} onClick={() => {actions?.skip?.();}} className='app-wizard-skip' ></WmAnchor>
            <WmContainer listener={fragment} name="wizard_actions_container" direction="row" gap="auto" alignment="start" width="fill" wrap={false} layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} className='app-wizard-actions app-container-default' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-flex-start wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-8px wm-pr-0px wm-pb-0px wm-pl-0px' >
              <WmContainer listener={fragment} name="wizard_actions_left" direction="column" gap="8" alignment="top-left" className='app-container-default' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                <WmButton listener={fragment}  name="prev_btn" type="button" iconclass="fa fa-caret-left" caption={fragment?.Widgets?.isa_wizard?.previousbtnlabel} show={(actions?.hasPreviousStep?.() || false)} onClick={() => {actions?.previous?.();}} disabled={actions?.disablePrevious?.()} styles={{"height":"fit-content","width":"fit-content"}} className='btn-navy-cta'  ></WmButton>
                <WmContainer listener={fragment} name="left_links" direction="column" gap="6" alignment="top-left" className='app-container-default' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0 wm-pt-8px wm-pr-0px wm-pb-0px wm-pl-0px' >
                  <WmButton listener={fragment}  name="exit_link" type="button" caption="Exit" iconclass="fa fa-times" styles={{"height":"fit-content","width":"fit-content"}} className='btn-link-action'  ></WmButton>
                  <WmButton listener={fragment}  name="print_link" type="button" caption="Print" iconclass="fa fa-print" styles={{"height":"fit-content","width":"fit-content"}} className='btn-link-action'  ></WmButton>
                </WmContainer>
              </WmContainer>
              <WmContainer listener={fragment} name="wizard_actions_right" direction="column" gap="8" alignment="top-right" className='app-container-default' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-end wm-gap-8px wm-w-fit-content wm-h-fit-content wm-fs-0' >
                <WmButton listener={fragment}  name="next_btn" type="button" iconclass="fa fa-caret-right" iconposition="right" caption={fragment?.Widgets?.isa_wizard?.nextbtnlabel} show={(actions?.hasNextStep?.() || false)} onClick={() => {actions?.next?.();}} disabled={actions?.disableNext?.()} styles={{"height":"fit-content","width":"fit-content"}} className='btn-navy-cta'  ></WmButton>
                <WmButton listener={fragment}  name="done_btn" type="button" iconclass="fa fa-caret-right" iconposition="right" caption={fragment?.Widgets?.isa_wizard?.donebtnlabel} show={(actions?.hasNoNextStep?.() || false)} onClick={() => {actions?.done?.();}} disabled={actions?.disableDone?.()} styles={{"height":"fit-content","width":"fit-content"}} className='btn-navy-cta'  ></WmButton>
                <WmContainer listener={fragment} name="right_links" direction="column" gap="6" alignment="top-right" className='app-container-default' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-end wm-gap-6px wm-w-fit-content wm-h-fit-content wm-fs-0 wm-pt-8px wm-pr-0px wm-pb-0px wm-pl-0px' >
                  <WmButton listener={fragment}  name="save_link" type="button" caption="Save" iconclass="fa fa-save" iconposition="right" styles={{"height":"fit-content","width":"fit-content"}} className='btn-link-action'  >
                  </WmButton>
                  <WmButton listener={fragment}  name="todo_link" type="button" caption="To do list" iconclass="fa fa-list-alt" iconposition="right" styles={{"height":"fit-content","width":"fit-content"}} className='btn-link-action'  ></WmButton>
                </WmContainer>
              </WmContainer>
            </WmContainer>
          </>
          )}
          >
          </WmWizardAction>
        </WmWizard>
      </WmContainer>
    </WmContainer>
  </WmContainer>

    </React.Fragment>
  );
}

const ComponentWithPage = BasePage(
  IndividualSavingsAccountComponent,
  addPageScript,
  getVariables,
  {
    componentName: "IndividualSavingsAccount",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: ['svGetEBSData'],
    componentType:'PAGE',
    
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage    {...props} />;
});
