'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import { useAppState } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import BasePage from '@wavemaker-ai/react-runtime/higherOrder/BasePage';
import { formatMessage ,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmAnchor from '@wavemaker-ai/react-runtime/components/basic/anchor';
import WmButton from '@wavemaker-ai/react-runtime/components/form/button';
import WmContainer from '@wavemaker-ai/react-runtime/components/container';
import WmDate from '@wavemaker-ai/react-runtime/components/input/epoch/date';
import WmDialog from '@wavemaker-ai/react-runtime/components/dialogs/dialog';
import WmDialogActions from '@wavemaker-ai/react-runtime/components/dialogs/dialog-actions';
import WmDialogBody from '@wavemaker-ai/react-runtime/components/dialogs/dialog-body';
import WmForm from '@wavemaker-ai/react-runtime/components/data/form';
import WmFormBody from '@wavemaker-ai/react-runtime/components/data/form/form-body';
import WmFormField from '@wavemaker-ai/react-runtime/components/data/form/form-field';
import WmIcon from '@wavemaker-ai/react-runtime/components/basic/icon';
import WmLabel from '@wavemaker-ai/react-runtime/components/basic/label';
import WmNumber from '@wavemaker-ai/react-runtime/components/input/number';
import WmPageContent from '@wavemaker-ai/react-runtime/components/page/page-content';
import WmRadioset from '@wavemaker-ai/react-runtime/components/input/default/radioset';
import WmSelect from '@wavemaker-ai/react-runtime/components/input/select';
import WmText from '@wavemaker-ai/react-runtime/components/input/text';
import WmWizard from '@wavemaker-ai/react-runtime/components/container/wizard';
import WmWizardAction from '@wavemaker-ai/react-runtime/components/container/wizard/wizard-action';
import WmWizardstep from '@wavemaker-ai/react-runtime/components/container/wizard/wizard-step';
import addPageScript from './Illustration.script';
import "./Illustration.css";
import getVariables from './Illustration.variables';

const IllustrationComponent = (props: any) => {
  const fragment = useAppState();
  const Widgets = fragment?.Widgets;
  const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();

},[])

  return (
    <React.Fragment>
        
<WmPageContent columnwidth={12} name="pagecontent" pagetitle="Illustration" >
<WmContainer listener={fragment} name="pageSurface" direction="column" bind="&apos;app-illustration-surface&apos;" layoutWidth="100%" layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-fs-0' >
          <WmWizard listener={fragment} name="illustrationWizard" defaultstep="stepAccountOwner" cancelbtnlabel="Close" nextbtnlabel="Continue" styles={{"width":"100%"}} className='wizard-classic' 
                >
            <WmWizardstep name="stepAccountOwner" title="Account owner" index={0}
                  render={(props:Record<string, any>, onLoad:()=>void) => (<>
              <WmContainer listener={fragment} name="accountOwnerBody" direction="column" layoutWidth="100%" className='illustration-step-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-fs-0' >
                <WmContainer listener={fragment} name="accountOwnerPanel" direction="column" className='illustration-section-panel illustration-owner-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblAccountOwner" caption="Account owner" type="p" className='illustration-owner-heading' >
                  </WmLabel>
                  <WmForm listener={fragment} name="accountOwnerForm" captionposition="left" styles={{"width":"100%"}} className='illustration-owner-form'
                        
                        
                        
                        
                      >
                    <WmFormBody name="wm_form_body_jd95g707b2">
                      <WmContainer listener={fragment} name="wm_container_994cg14452" className='form-elements' >
                        <WmFormField  field="true"   role="form-field"    name="ffTitle" widget="select" displayname="Title:" dataset="Mr,Mrs,Miss,Ms,Dr" defaultvalue={fragment?.Variables?.selectedEmployee?.dataSet?.title} isDataSetBound={true} displayfield="ffTitle" datafield="ffTitle" formKey="ffTitle" placeholder="Select value" formName="accountOwnerForm" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffTitle_formWidget" caption={$formField?.displayname} notag="true" name="ffTitle_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmSelect  {...$formField} name="ffTitle_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield} listener={fragment}
                                
                                
                                ></WmSelect>
                            </>)}></WmFormField>
                        <WmFormField  field="true"   role="form-field"    name="ffForename" widget="text" displayname="Forename(s):" defaultvalue={fragment?.Variables?.selectedEmployee?.dataSet?.forename} formKey="ffForename" placeholder="Enter value" formName="accountOwnerForm" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffForename_formWidget" caption={$formField?.displayname} notag="true" name="ffForename_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ffForename_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                        <WmFormField  field="true"   role="form-field"    name="ffSurname" widget="text" displayname="Surname:" readonly={true} defaultvalue={fragment?.Variables?.selectedEmployee?.dataSet?.surname} formKey="ffSurname" placeholder="Enter value" formName="accountOwnerForm" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffSurname_formWidget" caption={$formField?.displayname} notag="true" name="ffSurname_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmText  {...$formField} listener={fragment} name="ffSurname_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon} maxchars={$formField?.maxchars} ></WmText>
                            </>)}></WmFormField>
                        <WmFormField  field="true"   role="form-field"    name="ffDob" widget="date" displayname="Date of birth:" readonly={true} defaultvalue={fragment?.Variables?.selectedEmployee?.dataSet?.dateOfBirth} formKey="ffDob" placeholder="Select date" formName="accountOwnerForm" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffDob_formWidget" caption={$formField?.displayname} notag="true" name="ffDob_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmDate listener={fragment}  {...$formField}  name="ffDob_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} mindate={$formField?.mindate} maxdate={$formField?.maxdate} datepattern={$formField?.datepattern}></WmDate>
                            </>)}></WmFormField>
                      </WmContainer>
                    </WmFormBody>
                  </WmForm>
                </WmContainer>
              </WmContainer>
             </>)}/>
            <WmWizardstep name="stepInvestment" title="Investment" index={1}
                  render={(props:Record<string, any>, onLoad:()=>void) => (<>
              <WmContainer listener={fragment} name="investmentBody" direction="column" layoutWidth="100%" className='illustration-step-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-fs-0' >
                <WmContainer listener={fragment} name="accountDetailsPanel" direction="column" className='illustration-section-panel illustration-account-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblAccountDetailsHeading" caption="Account details" type="p" className='illustration-section-heading illustration-account-title' >
                  </WmLabel>
                  <WmContainer listener={fragment} name="accountDetailsCard" direction="column" className='illustration-required-card' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                    <WmContainer listener={fragment} name="accountDetailsQuestionRow" direction="row" alignment="top-left" className='illustration-required-question-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-w-100pct' >
                      <WmIcon name="iconAccountDetailsRequired" iconclass="fa fa-exclamation" className='illustration-required-icon'  >
                      </WmIcon>
                      <WmLabel listener={fragment} name="lblAccountDetailsQuestion" caption="Is this an additional investment to an existing Individual Savings Account?" type="p" className='illustration-required-question' >
                      </WmLabel>
                      <WmForm listener={fragment} name="accountAdditionalForm" captionposition="top" className='illustration-inline-form'
                            
                            
                            
                            
                          >
                        <WmFormBody name="wm_form_body_higic6a0d7">
                          <WmContainer listener={fragment} name="wm_container_3gcc3h15h1" className='form-elements' >
                            <WmFormField  field="true"   role="form-field"    name="ffAccountAdditional" widget="radioset" show-caption="false" dataset="Yes,No" required={true} isDataSetBound={true} displayfield="ffAccountAdditional" datafield="ffAccountAdditional" formKey="additionalToExistingIsa" formName="accountAdditionalForm" dataKey="additionalToExistingIsa" className='illustration-benefits-radio' renderFormFields={($formField) => (<>
                              <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffAccountAdditional_formWidget" caption={$formField?.displayname} notag="true" name="additionalToExistingIsa_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                              <WmRadioset  {...$formField} listener={fragment}  name="ffAccountAdditional_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                                </>)}></WmFormField>
                          </WmContainer>
                        </WmFormBody>
                      </WmForm>
                    </WmContainer>
                    <WmLabel listener={fragment} name="lblAccountDetailsHelper" caption="Existing account means a client&apos;s existing ISA holding regardless of whether contributions have been made in the current tax year." type="p" className='illustration-required-helper' >
                    </WmLabel>
                  </WmContainer>
                </WmContainer>
                <WmContainer listener={fragment} name="illustrationBasisPanel" direction="column" className='illustration-section-panel illustration-basis-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblIllustrationBasisHeading" caption="Illustration basis" type="p" className='illustration-section-heading illustration-basis-title' >
                  </WmLabel>
                  <WmForm listener={fragment} name="illustrationBasisForm" captionposition="left" styles={{"width":"100%"}} className='illustration-owner-form illustration-basis-form'
                        
                        
                        
                        
                      >
                    <WmFormBody name="wm_form_body_e26d18568f">
                      <WmContainer listener={fragment} name="wm_container_gjggg09ahh" className='form-elements' >
                        <WmFormField  field="true"   role="form-field"    name="ffCommencementDate" widget="date" displayname="Commencement date:" datavalue="2026-10-14" formKey="ffCommencementDate" placeholder="Select date" formName="illustrationBasisForm" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffCommencementDate_formWidget" caption={$formField?.displayname} notag="true" name="ffCommencementDate_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmDate listener={fragment}  {...$formField}  name="ffCommencementDate_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} mindate={$formField?.mindate} maxdate={$formField?.maxdate} datepattern={$formField?.datepattern}></WmDate>
                            </>)}></WmFormField>
                        <WmFormField  field="true"   role="form-field"    name="ffTermYears" widget="number" displayname="Term (years):" datavalue="10" formKey="ffTermYears" placeholder="Enter value" formName="illustrationBasisForm" renderFormFields={($formField) => (<>
                          <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffTermYears_formWidget" caption={$formField?.displayname} notag="true" name="ffTermYears_formLabel" type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                          <WmNumber  {...$formField} listener={fragment} name="ffTermYears_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                          </WmNumber>
                            </>)}></WmFormField>
                      </WmContainer>
                    </WmFormBody>
                  </WmForm>
                  <WmContainer listener={fragment} name="basisRequiredRow" direction="row" alignment="top-left" className='illustration-required-question-row illustration-basis-required-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-w-100pct' >
                    <WmIcon name="iconBasisRequired" iconclass="fa fa-exclamation" className='illustration-required-icon'  >
                    </WmIcon>
                    <WmLabel listener={fragment} name="lblBasisQuestion" caption="Other than in this illustration are any other new investments included in this round of advice?" type="p" className='illustration-required-question' >
                    </WmLabel>
                    <WmForm listener={fragment} name="basisOtherInvestmentsForm" captionposition="top" className='illustration-inline-form'
                          
                          
                          
                          
                        >
                      <WmFormBody name="wm_form_body_3e1118g24h">
                        <WmContainer listener={fragment} name="wm_container_890833553h" className='form-elements' >
                          <WmFormField  field="true"   role="form-field"    name="ffBasisOtherInvestments" widget="radioset" show-caption="false" dataset="Yes,No" required={true} isDataSetBound={true} displayfield="ffBasisOtherInvestments" datafield="ffBasisOtherInvestments" formKey="otherNewInvestmentsInRound" formName="basisOtherInvestmentsForm" dataKey="otherNewInvestmentsInRound" className='illustration-benefits-radio' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffBasisOtherInvestments_formWidget" caption={$formField?.displayname} notag="true" name="otherNewInvestmentsInRound_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ffBasisOtherInvestments_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmFormBody>
                    </WmForm>
                  </WmContainer>
                </WmContainer>
                <WmContainer listener={fragment} name="singleContributionsPanel" direction="column" className='illustration-section-panel illustration-add-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblSingleContributionsHeading" caption="Single contributions" type="p" className='illustration-add-title' >
                  </WmLabel>
                  <WmContainer listener={fragment} name="singleContributionsAddRow" direction="row" alignment="middle-left" className='illustration-add-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-w-100pct' >
                    <WmAnchor listener={fragment} name="lnkAddSingleContributions" caption="Add single contributions" iconclass="fa fa-plus" iconposition="left" className='illustration-add-link' >
                    </WmAnchor>
                    <WmIcon name="iconSingleContributionsHelp" iconclass="fa fa-question" className='illustration-help-icon'  >
                    </WmIcon>
                  </WmContainer>
                </WmContainer>
                <WmContainer listener={fragment} name="regularContributionsPanel" direction="column" className='illustration-section-panel illustration-add-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblRegularContributionsHeading" caption="Regular contributions" type="p" className='illustration-add-title' >
                  </WmLabel>
                  <WmContainer listener={fragment} name="regularContributionsAddRow" direction="row" alignment="middle-left" className='illustration-add-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-w-100pct' >
                    <WmAnchor listener={fragment} name="lnkAddRegularContributions" caption="Add regular contributions" iconclass="fa fa-plus" iconposition="left" className='illustration-add-link' >
                    </WmAnchor>
                    <WmIcon name="iconRegularContributionsHelp" iconclass="fa fa-question" className='illustration-help-icon'  >
                    </WmIcon>
                  </WmContainer>
                </WmContainer>
                <WmContainer listener={fragment} name="transfersPanel" direction="column" className='illustration-section-panel illustration-add-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblTransfersHeading" caption="Transfers" type="p" className='illustration-add-title' >
                  </WmLabel>
                  <WmContainer listener={fragment} name="transfersAddRow" direction="row" alignment="middle-left" className='illustration-add-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-w-100pct' >
                    <WmAnchor listener={fragment} name="lnkAddTransfer" caption="Add transfer" iconclass="fa fa-plus" iconposition="left" className='illustration-add-link' >
                    </WmAnchor>
                  </WmContainer>
                </WmContainer>
              </WmContainer>
             </>)}/>
            <WmWizardstep name="stepBenefits" title="Benefits" index={2}
                  render={(props:Record<string, any>, onLoad:()=>void) => (<>
              <WmContainer listener={fragment} name="benefitsBody" direction="column" layoutWidth="100%" className='illustration-step-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-fs-0' >
                <WmLabel listener={fragment} name="lblBenefitsHeading" caption="Benefits" type="p" className='illustration-section-heading' >
                </WmLabel>
                <WmContainer listener={fragment} name="benefitsWithdrawalsPanel" direction="column" className='illustration-section-panel illustration-benefits-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblRegularWithdrawalsHeading" caption="Regular withdrawals" type="p" className='illustration-section-heading illustration-benefits-heading' >
                  </WmLabel>
                  <WmContainer listener={fragment} name="benefitsWithdrawalsRow" direction="row" alignment="middle-left" className='illustration-benefits-question-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblRegularWithdrawalsQuestion" caption="Does the account owner wish to take regular withdrawals?" type="p" className='illustration-benefits-question' >
                    </WmLabel>
                    <WmForm listener={fragment} name="regularWithdrawalsForm" captionposition="top" className='illustration-inline-form'
                          
                          
                          
                          
                        >
                      <WmFormBody name="wm_form_body_5h32iahcj3">
                        <WmContainer listener={fragment} name="wm_container_2ed721b1jb" className='form-elements' >
                          <WmFormField  field="true"   role="form-field"    name="ffRegularWithdrawals" widget="radioset" show-caption="false" dataset="Yes,No" datavalue="No" required={true} isDataSetBound={true} displayfield="ffRegularWithdrawals" datafield="ffRegularWithdrawals" formKey="takesRegularWithdrawals" formName="regularWithdrawalsForm" dataKey="takesRegularWithdrawals" className='illustration-benefits-radio' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffRegularWithdrawals_formWidget" caption={$formField?.displayname} notag="true" name="takesRegularWithdrawals_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmRadioset  {...$formField} listener={fragment}  name="ffRegularWithdrawals_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmFormBody>
                    </WmForm>
                  </WmContainer>
                </WmContainer>
              </WmContainer>
             </>)}/>
            <WmWizardstep name="stepCharges" title="Charges" index={3}
                  render={(props:Record<string, any>, onLoad:()=>void) => (<>
              <WmContainer listener={fragment} name="chargesBody" direction="column" layoutWidth="100%" className='illustration-step-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-fs-0' >
                <WmContainer listener={fragment} name="chargesPanel" direction="column" className='illustration-section-panel illustration-charges-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblSingleContributions" caption="Single contributions" type="p" className='illustration-section-heading illustration-charges-title' >
                  </WmLabel>
                  <WmForm listener={fragment} name="chargesForm" captionposition="top" className='illustration-inline-form'
                        
                        
                        
                        
                      >
                    <WmFormBody name="wm_form_body_0h64ecfde1">
                      <WmContainer listener={fragment} name="wm_container_ac055ge2h5" className='form-elements' >
                        <WmContainer listener={fragment} name="chargesHeaderRow" direction="row" layoutWidth="100%" className='illustration-charges-row illustration-charges-header' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblChargesColName" caption="Charges" type="p" className='illustration-charges-name illustration-charges-colhead' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblChargesColStandard" caption="Standard" type="p" className='illustration-charges-standard illustration-charges-colhead' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblChargesColRate" caption="Rate to be applied" type="p" className='illustration-charges-rate illustration-charges-colhead' >
                          </WmLabel>
                        </WmContainer>
                        <WmContainer listener={fragment} name="rowInitialAdviceCharge" direction="row" layoutWidth="100%" className='illustration-charges-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblInitialAdviceCharge" caption="Initial Advice Charge:" type="p" className='illustration-charges-name' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblInitialAdviceChargeStd" caption="3.00 %" type="p" className='illustration-charges-standard' >
                          </WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ffInitialAdviceCharge" widget="number" show-caption="false" datavalue="3.00" formKey="initialAdviceCharge" placeholder="Enter value" formName="chargesForm" dataKey="initialAdviceCharge" className='illustration-pct-field illustration-charges-input' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffInitialAdviceCharge_formWidget" caption={$formField?.displayname} notag="true" name="initialAdviceCharge_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmNumber  {...$formField} listener={fragment} name="ffInitialAdviceCharge_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                            </WmNumber>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="rowOngoingAdviceCharge" direction="row" layoutWidth="100%" className='illustration-charges-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblOngoingAdviceCharge" caption="Ongoing Advice Charge:" type="p" className='illustration-charges-name' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblOngoingAdviceChargeStd" caption="0.80 %" type="p" className='illustration-charges-standard' >
                          </WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ffOngoingAdviceCharge" widget="number" show-caption="false" datavalue="0.80" formKey="ongoingAdviceCharge" placeholder="Enter value" formName="chargesForm" dataKey="ongoingAdviceCharge" className='illustration-pct-field illustration-charges-input' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffOngoingAdviceCharge_formWidget" caption={$formField?.displayname} notag="true" name="ongoingAdviceCharge_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmNumber  {...$formField} listener={fragment} name="ffOngoingAdviceCharge_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                            </WmNumber>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="rowProductCharge" direction="row" layoutWidth="100%" className='illustration-charges-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblProductCharge" caption="Product Charge:" type="p" className='illustration-charges-name' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblProductChargeStd" caption="0.27 %" type="p" className='illustration-charges-standard' >
                          </WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ffProductCharge" widget="number" show-caption="false" datavalue="0.27" formKey="productCharge" placeholder="Enter value" formName="chargesForm" dataKey="productCharge" className='illustration-pct-field illustration-charges-input' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffProductCharge_formWidget" caption={$formField?.displayname} notag="true" name="productCharge_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmNumber  {...$formField} listener={fragment} name="ffProductCharge_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                            </WmNumber>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="feesHeaderRow" direction="row" layoutWidth="100%" className='illustration-charges-row illustration-charges-header' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblFeesColName" caption="Fees" type="p" className='illustration-charges-name illustration-charges-colhead' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblFeesColStandard" caption="Standard" type="p" className='illustration-charges-standard illustration-charges-colhead' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblFeesColRate" caption="Rate to be applied" type="p" className='illustration-charges-rate illustration-charges-colhead' >
                          </WmLabel>
                        </WmContainer>
                        <WmContainer listener={fragment} name="rowInitialAdviceFee" direction="row" layoutWidth="100%" className='illustration-charges-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblInitialAdviceFee" caption="Initial Advice Fee:" type="p" className='illustration-charges-name' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblInitialAdviceFeeStd" caption="2.00 %" type="p" className='illustration-charges-standard' >
                          </WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ffInitialAdviceFee" widget="number" show-caption="false" datavalue="2.00" formKey="initialAdviceFee" placeholder="Enter value" formName="chargesForm" dataKey="initialAdviceFee" className='illustration-pct-field illustration-charges-input' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffInitialAdviceFee_formWidget" caption={$formField?.displayname} notag="true" name="initialAdviceFee_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmNumber  {...$formField} listener={fragment} name="ffInitialAdviceFee_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                            </WmNumber>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="rowCredit" direction="row" layoutWidth="100%" className='illustration-charges-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblCredit" caption="Credit:" type="p" className='illustration-charges-name' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblCreditStd" caption="2.00 %" type="p" className='illustration-charges-standard' >
                          </WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ffCredit" widget="number" show-caption="false" datavalue="2.00" formKey="credit" placeholder="Enter value" formName="chargesForm" dataKey="credit" className='illustration-pct-field illustration-charges-input' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffCredit_formWidget" caption={$formField?.displayname} notag="true" name="credit_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmNumber  {...$formField} listener={fragment} name="ffCredit_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                            </WmNumber>
                              </>)}></WmFormField>
                        </WmContainer>
                        <WmContainer listener={fragment} name="rowOngoingAdviceFee" direction="row" layoutWidth="100%" className='illustration-charges-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct wm-fs-0' >
                          <WmLabel listener={fragment} name="lblOngoingAdviceFee" caption="Ongoing Advice Fee:" type="p" className='illustration-charges-name' >
                          </WmLabel>
                          <WmLabel listener={fragment} name="lblOngoingAdviceFeeStd" caption="0.55 %" type="p" className='illustration-charges-standard' >
                          </WmLabel>
                          <WmFormField  field="true"   role="form-field"    name="ffOngoingAdviceFee" widget="number" show-caption="false" datavalue="0.55" formKey="ongoingAdviceFee" placeholder="Enter value" formName="chargesForm" dataKey="ongoingAdviceFee" className='illustration-pct-field illustration-charges-input' renderFormFields={($formField) => (<>
                            <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffOngoingAdviceFee_formWidget" caption={$formField?.displayname} notag="true" name="ongoingAdviceFee_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                            <WmNumber  {...$formField} listener={fragment} name="ffOngoingAdviceFee_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                            </WmNumber>
                              </>)}></WmFormField>
                        </WmContainer>
                      </WmContainer>
                    </WmFormBody>
                  </WmForm>
                </WmContainer>
              </WmContainer>
             </>)}/>
            <WmWizardstep name="stepFundSelection" title="Fund selection" index={4}
                  render={(props:Record<string, any>, onLoad:()=>void) => (<>
              <WmContainer listener={fragment} name="fundSelectionBody" direction="column" layoutWidth="100%" className='illustration-step-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-fs-0' >
                <WmContainer listener={fragment} name="aftPanel" direction="column" className='illustration-section-panel illustration-aft-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblAftHeading" caption="AFT fund selection" type="p" className='illustration-section-heading illustration-aft-title' >
                  </WmLabel>
                  <WmContainer listener={fragment} name="aftBody" direction="column" className='illustration-aft-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblAftSingleContributions" caption="Single contributions" type="p" className='illustration-aft-subheading' >
                    </WmLabel>
                    <WmContainer listener={fragment} name="aftQuestionRow" direction="row" alignment="middle-left" className='illustration-aft-question-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblAftQuestion" caption="Do you want to use the Automatic Fund Transfer (AFT) facility for this Investment?" type="p" className='illustration-aft-question' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffAft" widget="radioset" show-caption="false" dataset="Yes,No" datavalue="No" isDataSetBound={true} displayfield="ffAft" datafield="ffAft" formKey="ffAft" className='illustration-aft-radio' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffAft_formWidget" caption={$formField?.displayname} notag="true" name="ffAft_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmRadioset  {...$formField} listener={fragment}  name="ffAft_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} dataset={$formField?.dataset} displayfield={$formField?.displayfield} datafield={$formField?.datafield}  ></WmRadioset>
                          </>)}></WmFormField>
                    </WmContainer>
                  </WmContainer>
                </WmContainer>
                <WmContainer listener={fragment} name="fundSelectionPanel" direction="column" className='illustration-section-panel illustration-fundsel-panel' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                  <WmLabel listener={fragment} name="lblFundSelectionHeading" caption="Fund selection" type="p" className='illustration-section-heading illustration-fundsel-title' >
                  </WmLabel>
                  <WmLabel listener={fragment} name="lblFundselSingleContributions" caption="Single contributions" type="p" className='illustration-fundsel-subheading' >
                  </WmLabel>
                  <WmContainer listener={fragment} name="fundHeaderRow" direction="row" className='illustration-fund-row illustration-fund-header' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblFundColName" caption="" type="p" className='illustration-fund-name' >
                    </WmLabel>
                    <WmLabel listener={fragment} name="lblFundColIncome" caption="Income" type="p" className='illustration-fund-colhead' >
                    </WmLabel>
                    <WmLabel listener={fragment} name="lblFundColAccumulation" caption="Accumulation" type="p" className='illustration-fund-colhead' >
                    </WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="rowAdventurous" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblAdventurous" caption="Adventurous Portfolio" type="p" className='illustration-fund-name' >
                    </WmLabel>
                    <WmFormField  field="true"   role="form-field"    name="ffAdventurousIncome" widget="number" show-caption="false" onChange={fragment?.ffAdventurousIncomeChange} formKey="ffAdventurousIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffAdventurousIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffAdventurousIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffAdventurousIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                    <WmFormField  field="true"   role="form-field"    name="ffAdventurousAccum" widget="number" show-caption="false" formKey="ffAdventurousAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffAdventurousAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffAdventurousAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffAdventurousAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                  </WmContainer>
                  <WmContainer listener={fragment} name="rowBalanced" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblBalanced" caption="Balanced Portfolio" type="p" className='illustration-fund-name' >
                    </WmLabel>
                    <WmFormField  field="true"   role="form-field"    name="ffBalancedIncome" widget="number" show-caption="false" onChange={fragment?.ffBalancedIncomeChange} formKey="ffBalancedIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffBalancedIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffBalancedIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffBalancedIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                    <WmFormField  field="true"   role="form-field"    name="ffBalancedAccum" widget="number" show-caption="false" formKey="ffBalancedAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffBalancedAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffBalancedAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffBalancedAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                  </WmContainer>
                  <WmContainer listener={fragment} name="rowConservative" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblConservative" caption="Conservative Portfolio" type="p" className='illustration-fund-name' >
                    </WmLabel>
                    <WmFormField  field="true"   role="form-field"    name="ffConservativeIncome" widget="number" show-caption="false" onChange={fragment?.ffConservativeIncomeChange} formKey="ffConservativeIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffConservativeIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffConservativeIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffConservativeIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                    <WmFormField  field="true"   role="form-field"    name="ffConservativeAccum" widget="number" show-caption="false" formKey="ffConservativeAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffConservativeAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffConservativeAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffConservativeAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                  </WmContainer>
                  <WmContainer listener={fragment} name="rowManagedFunds" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblManagedFunds" caption="Managed Funds Portfolio" type="p" className='illustration-fund-name' >
                    </WmLabel>
                    <WmFormField  field="true"   role="form-field"    name="ffManagedFundsIncome" widget="number" show-caption="false" onChange={fragment?.ffManagedFundsIncomeChange} formKey="ffManagedFundsIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffManagedFundsIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffManagedFundsIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffManagedFundsIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                    <WmFormField  field="true"   role="form-field"    name="ffManagedFundsAccum" widget="number" show-caption="false" formKey="ffManagedFundsAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffManagedFundsAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffManagedFundsAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffManagedFundsAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                  </WmContainer>
                  <WmContainer listener={fragment} name="rowStrategicGrowth" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblStrategicGrowth" caption="Strategic Growth Portfolio" type="p" className='illustration-fund-name' >
                    </WmLabel>
                    <WmFormField  field="true"   role="form-field"    name="ffStrategicGrowthIncome" widget="number" show-caption="false" onChange={fragment?.ffStrategicGrowthIncomeChange} formKey="ffStrategicGrowthIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffStrategicGrowthIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffStrategicGrowthIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffStrategicGrowthIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                    <WmFormField  field="true"   role="form-field"    name="ffStrategicGrowthAccum" widget="number" show-caption="false" formKey="ffStrategicGrowthAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                      <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffStrategicGrowthAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffStrategicGrowthAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                      <WmNumber  {...$formField} listener={fragment} name="ffStrategicGrowthAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                      </WmNumber>
                        </>)}></WmFormField>
                  </WmContainer>
                  <WmAnchor listener={fragment} name="hideFundsToggle" caption={(fragment?.Variables?.individualFundsExpanded?.dataSet?.dataValue?"Hide individual funds":"Show individual funds")} iconclass={(fragment?.Variables?.individualFundsExpanded?.dataSet?.dataValue?"wi wi-chevron-up":"wi wi-chevron-down")} iconposition="right" onClick={fragment?.hideFundsToggleClick} className='illustration-toggle-funds' >
                  </WmAnchor>
                  <WmContainer listener={fragment} name="individualFundsContainer" direction="column" show={(fragment?.Variables?.individualFundsExpanded?.dataSet?.dataValue || false)} className='illustration-individual-funds' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                    <WmContainer listener={fragment} name="polarisHeaderRow" direction="row" className='illustration-fund-row illustration-fund-header' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolarisRangeHeading" caption="Polaris and InRetirement Range" type="p" className='illustration-fund-name illustration-fund-colhead' >
                      </WmLabel>
                      <WmLabel listener={fragment} name="lblPolarisColIncome" caption="Income" type="p" className='illustration-fund-colhead' >
                      </WmLabel>
                      <WmLabel listener={fragment} name="lblPolarisColAccumulation" caption="Accumulation" type="p" className='illustration-fund-colhead' >
                      </WmLabel>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowPolaris1" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolaris1" caption="Polaris 1" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris1Income" widget="number" show-caption="false" formKey="ffPolaris1Income" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris1Income_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris1Income_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris1Income_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris1Accum" widget="number" show-caption="false" formKey="ffPolaris1Accum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris1Accum_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris1Accum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris1Accum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowPolaris2" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolaris2" caption="Polaris 2" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris2Income" widget="number" show-caption="false" formKey="ffPolaris2Income" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris2Income_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris2Income_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris2Income_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris2Accum" widget="number" show-caption="false" formKey="ffPolaris2Accum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris2Accum_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris2Accum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris2Accum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowPolaris3" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolaris3" caption="Polaris 3" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris3Income" widget="number" show-caption="false" formKey="ffPolaris3Income" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris3Income_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris3Income_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris3Income_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris3Accum" widget="number" show-caption="false" formKey="ffPolaris3Accum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris3Accum_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris3Accum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris3Accum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowPolaris4" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolaris4" caption="Polaris 4" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris4Income" widget="number" show-caption="false" formKey="ffPolaris4Income" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris4Income_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris4Income_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris4Income_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffPolaris4Accum" widget="number" show-caption="false" formKey="ffPolaris4Accum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolaris4Accum_formWidget" caption={$formField?.displayname} notag="true" name="ffPolaris4Accum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolaris4Accum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowPolarisMultiIndex1" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolarisMultiIndex1" caption="Polaris Multi-Index 1" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffPolarisMultiIndex1Income" widget="number" show-caption="false" formKey="ffPolarisMultiIndex1Income" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolarisMultiIndex1Income_formWidget" caption={$formField?.displayname} notag="true" name="ffPolarisMultiIndex1Income_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolarisMultiIndex1Income_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffPolarisMultiIndex1Accum" widget="number" show-caption="false" formKey="ffPolarisMultiIndex1Accum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolarisMultiIndex1Accum_formWidget" caption={$formField?.displayname} notag="true" name="ffPolarisMultiIndex1Accum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolarisMultiIndex1Accum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowPolarisMultiIndex2" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolarisMultiIndex2" caption="Polaris Multi-Index 2" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffPolarisMultiIndex2Income" widget="number" show-caption="false" formKey="ffPolarisMultiIndex2Income" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolarisMultiIndex2Income_formWidget" caption={$formField?.displayname} notag="true" name="ffPolarisMultiIndex2Income_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolarisMultiIndex2Income_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffPolarisMultiIndex2Accum" widget="number" show-caption="false" formKey="ffPolarisMultiIndex2Accum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolarisMultiIndex2Accum_formWidget" caption={$formField?.displayname} notag="true" name="ffPolarisMultiIndex2Accum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolarisMultiIndex2Accum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowPolarisMultiIndex3" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblPolarisMultiIndex3" caption="Polaris Multi-Index 3" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffPolarisMultiIndex3Income" widget="number" show-caption="false" formKey="ffPolarisMultiIndex3Income" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolarisMultiIndex3Income_formWidget" caption={$formField?.displayname} notag="true" name="ffPolarisMultiIndex3Income_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolarisMultiIndex3Income_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffPolarisMultiIndex3Accum" widget="number" show-caption="false" formKey="ffPolarisMultiIndex3Accum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffPolarisMultiIndex3Accum_formWidget" caption={$formField?.displayname} notag="true" name="ffPolarisMultiIndex3Accum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffPolarisMultiIndex3Accum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowGlobalSmallerCompanies" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblGlobalSmallerCompanies" caption="Global Smaller Companies" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffGlobalSmallerCompaniesIncome" widget="number" show-caption="false" formKey="ffGlobalSmallerCompaniesIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffGlobalSmallerCompaniesIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffGlobalSmallerCompaniesIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffGlobalSmallerCompaniesIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffGlobalSmallerCompaniesAccum" widget="number" show-caption="false" formKey="ffGlobalSmallerCompaniesAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffGlobalSmallerCompaniesAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffGlobalSmallerCompaniesAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffGlobalSmallerCompaniesAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowGlobalValue" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblGlobalValue" caption="Global Value" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffGlobalValueIncome" widget="number" show-caption="false" formKey="ffGlobalValueIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffGlobalValueIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffGlobalValueIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffGlobalValueIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffGlobalValueAccum" widget="number" show-caption="false" formKey="ffGlobalValueAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffGlobalValueAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffGlobalValueAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffGlobalValueAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowGreaterEuropeanProgressive" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblGreaterEuropeanProgressive" caption="Greater European Progressive" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffGreaterEuropeanProgressiveIncome" widget="number" show-caption="false" formKey="ffGreaterEuropeanProgressiveIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffGreaterEuropeanProgressiveIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffGreaterEuropeanProgressiveIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffGreaterEuropeanProgressiveIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffGreaterEuropeanProgressiveAccum" widget="number" show-caption="false" formKey="ffGreaterEuropeanProgressiveAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffGreaterEuropeanProgressiveAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffGreaterEuropeanProgressiveAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffGreaterEuropeanProgressiveAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowInternationalEquity" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblInternationalEquity" caption="International Equity" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffInternationalEquityIncome" widget="number" show-caption="false" formKey="ffInternationalEquityIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffInternationalEquityIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffInternationalEquityIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffInternationalEquityIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffInternationalEquityAccum" widget="number" show-caption="false" formKey="ffInternationalEquityAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffInternationalEquityAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffInternationalEquityAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffInternationalEquityAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowInvestmentGradeCorporateBond" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblInvestmentGradeCorporateBond" caption="Investment Grade Corporate Bond" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffInvestmentGradeCorporateBondIncome" widget="number" show-caption="false" formKey="ffInvestmentGradeCorporateBondIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffInvestmentGradeCorporateBondIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffInvestmentGradeCorporateBondIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffInvestmentGradeCorporateBondIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffInvestmentGradeCorporateBondAccum" widget="number" show-caption="false" formKey="ffInvestmentGradeCorporateBondAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffInvestmentGradeCorporateBondAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffInvestmentGradeCorporateBondAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffInvestmentGradeCorporateBondAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowJapan" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblJapan" caption="Japan" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffJapanIncome" widget="number" show-caption="false" formKey="ffJapanIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffJapanIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffJapanIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffJapanIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffJapanAccum" widget="number" show-caption="false" formKey="ffJapanAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffJapanAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffJapanAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffJapanAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowManagedGrowth" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblManagedGrowth" caption="Managed Growth" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffManagedGrowthIncome" widget="number" show-caption="false" formKey="ffManagedGrowthIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffManagedGrowthIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffManagedGrowthIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffManagedGrowthIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffManagedGrowthAccum" widget="number" show-caption="false" formKey="ffManagedGrowthAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffManagedGrowthAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffManagedGrowthAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffManagedGrowthAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowMoneyMarket" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblMoneyMarket" caption="Money Market" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffMoneyMarketIncome" widget="number" show-caption="false" formKey="ffMoneyMarketIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffMoneyMarketIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffMoneyMarketIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffMoneyMarketIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffMoneyMarketAccum" widget="number" show-caption="false" formKey="ffMoneyMarketAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffMoneyMarketAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffMoneyMarketAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffMoneyMarketAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowNorthAmerican" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblNorthAmerican" caption="North American" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffNorthAmericanIncome" widget="number" show-caption="false" formKey="ffNorthAmericanIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffNorthAmericanIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffNorthAmericanIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffNorthAmericanIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffNorthAmericanAccum" widget="number" show-caption="false" formKey="ffNorthAmericanAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffNorthAmericanAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffNorthAmericanAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffNorthAmericanAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowStrategicIncome" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblStrategicIncome" caption="Strategic Income" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffStrategicIncomeIncome" widget="number" show-caption="false" formKey="ffStrategicIncomeIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffStrategicIncomeIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffStrategicIncomeIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffStrategicIncomeIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffStrategicIncomeAccum" widget="number" show-caption="false" formKey="ffStrategicIncomeAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffStrategicIncomeAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffStrategicIncomeAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffStrategicIncomeAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowStrategicManaged" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblStrategicManaged" caption="Strategic Managed" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffStrategicManagedIncome" widget="number" show-caption="false" formKey="ffStrategicManagedIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffStrategicManagedIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffStrategicManagedIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffStrategicManagedIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffStrategicManagedAccum" widget="number" show-caption="false" formKey="ffStrategicManagedAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffStrategicManagedAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffStrategicManagedAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffStrategicManagedAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowSustainableResponsibleEquity" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblSustainableResponsibleEquity" caption="Sustainable &amp; Responsible Equity" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffSustainableResponsibleEquityIncome" widget="number" show-caption="false" formKey="ffSustainableResponsibleEquityIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffSustainableResponsibleEquityIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffSustainableResponsibleEquityIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffSustainableResponsibleEquityIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffSustainableResponsibleEquityAccum" widget="number" show-caption="false" formKey="ffSustainableResponsibleEquityAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffSustainableResponsibleEquityAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffSustainableResponsibleEquityAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffSustainableResponsibleEquityAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowUK" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblUK" caption="UK" type="p" className='illustration-fund-name' ></WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffUKIncome" widget="number" show-caption="false" formKey="ffUKIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffUKIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffUKIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffUKIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffUKAccum" widget="number" show-caption="false" formKey="ffUKAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffUKAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffUKAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffUKAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                    <WmContainer listener={fragment} name="rowUKEquityIncome" direction="row" className='illustration-fund-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-w-100pct' >
                      <WmLabel listener={fragment} name="lblUKEquityIncome" caption="UK Equity Income" type="p" className='illustration-fund-name' >
                      </WmLabel>
                      <WmFormField  field="true"   role="form-field"    name="ffUKEquityIncomeIncome" widget="number" show-caption="false" formKey="ffUKEquityIncomeIncome" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffUKEquityIncomeIncome_formWidget" caption={$formField?.displayname} notag="true" name="ffUKEquityIncomeIncome_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffUKEquityIncomeIncome_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                      <WmFormField  field="true"   role="form-field"    name="ffUKEquityIncomeAccum" widget="number" show-caption="false" formKey="ffUKEquityIncomeAccum" placeholder="Enter value" className='illustration-pct-field' renderFormFields={($formField) => (<>
                        <WmLabel listener={fragment} required={$formField?.required} htmlFor="ffUKEquityIncomeAccum_formWidget" caption={$formField?.displayname} notag="true" name="ffUKEquityIncomeAccum_formLabel" hidden={true} type="label" className={'app-label control-label formfield-label ' + $formField?.captionCls + ' ' + $formField?.invalidCls} ></WmLabel>
                        <WmNumber  {...$formField} listener={fragment} name="ffUKEquityIncomeAccum_formWidget" formfield="true" datavalue={$formField?.datavalue ?? $formField?.defaultvalue} updateon={$formField?.updateon || 'blur'} minvalue={$formField?.minvalue} maxvalue={$formField?.maxvalue} displayValue={$formField?.displayValue} >
                        </WmNumber>
                          </>)}></WmFormField>
                    </WmContainer>
                  </WmContainer>
                  <WmContainer listener={fragment} name="fundTotalRow" direction="row" alignment="middle-left" className='illustration-fund-row illustration-fund-total-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-w-100pct' >
                    <WmLabel listener={fragment} name="lblFundTotalLabel" caption="Total:" type="p" className='illustration-fund-name illustration-fund-total-label' >
                    </WmLabel>
                    <WmLabel listener={fragment} name="lblFundTotalValue" caption={(fragment?.Variables?.fundIncomeTotal?.dataSet?.dataValue?.toFixed?.(1)+"%")} type="p" className='illustration-fund-total-value' >
                    </WmLabel>
                  </WmContainer>
                  <WmContainer listener={fragment} name="fundTotalValidationRow" direction="row" alignment="top-left" show={((fragment?.Variables?.fundIncomeTotal?.dataSet?.dataValue!==100) || false)} className='illustration-fund-validation-row' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-w-100pct' >
                    <WmIcon name="iconFundTotalValidation" iconclass="wi wi-error" className='illustration-fund-validation-icon'  >
                    </WmIcon>
                    <WmLabel listener={fragment} name="lblFundTotalValidation" caption="Total fund allocation must equal 100%." type="p" className='illustration-fund-validation-text' >
                    </WmLabel>
                  </WmContainer>
                </WmContainer>
              </WmContainer>
             </>)}/>
            <WmWizardAction listener={fragment} actionsalignment={fragment?.Widgets?.illustrationWizard?.actionsalignment}  name="illustrationWizardAction" index={5} className='illustration-wizard-footer'
            renderActions={(actions: any) => (<>
              <WmAnchor listener={fragment} caption="Skip »" show={(fragment?.Widgets?.illustrationWizard?.skippable || false)} onClick={() => {actions?.skip?.();}} name="anchorSkip" className='app-wizard-skip' >
              </WmAnchor>
              <WmContainer listener={fragment} name="wizardActionsContainer" direction="row" gap="12" alignment="middle-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} className='app-wizard-actions-right app-container-default' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-12px wm-w-100pct wm-h-fit-content wm-fs-0' >
                <WmButton listener={fragment}  type="button" caption={fragment?.Widgets?.illustrationWizard?.cancelbtnlabel} show={(fragment?.Widgets?.illustrationWizard?.cancelable || false)} onClick={() => {actions?.cancel?.();}} name="btnClose" className='btn-filled btn-default btn-sjp-nav illustration-close-btn'  >
                </WmButton>
                <WmButton listener={fragment}  type="button" iconclass="wi wi-chevron-left" caption={fragment?.Widgets?.illustrationWizard?.previousbtnlabel} show={(actions?.hasPreviousStep?.() || false)} onClick={() => {actions?.previous?.();}} disabled={actions?.disablePrevious?.()} name="btnPrevious" className='btn-filled btn-default btn-sjp-nav'  >
                </WmButton>
                <WmButton listener={fragment}  type="button" iconclass="wi wi-chevron-right" iconposition="right" caption={fragment?.Widgets?.illustrationWizard?.nextbtnlabel} show={(actions?.hasNextStep?.() || false)} onClick={() => {actions?.next?.();}} disabled={actions?.disableNext?.()} name="btnContinue" className='btn-filled btn-default btn-sjp-nav illustration-continue-btn'  >
                </WmButton>
                <WmButton listener={fragment}  type="button" iconclass="wi wi-check" caption={fragment?.Widgets?.illustrationWizard?.donebtnlabel} show={(actions?.hasNoNextStep?.() || false)} onClick={fragment?.btnDoneClick} disabled={(actions?.disableDone?.()||(fragment?.Variables?.fundIncomeTotal?.dataSet?.dataValue!==100))} name="btnDone" className='btn-filled btn-default btn-sjp-nav'  >
                </WmButton>
              </WmContainer>
            </>
            )}
            >
            </WmWizardAction>
          </WmWizard>
        </WmContainer>
<WmDialog listener={fragment} name="illustrationResultDialog" title="Create Illustration" closable={false} modal={true}>
      <WmDialogBody name="wm_dialogbody_9a9i4da1gg">
        <WmContainer listener={fragment} name="illustrationResultDialogContent" direction="column" gap="8" alignment="top-left" width="fill" layoutWidth="fill" layoutHeight="hug" styles={{"width":"100%"}} className='app-container-default' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0' >
          <WmLabel listener={fragment} name="lblIllustrationResultMessage" caption={fragment?.Variables?.illustrationResultMessage?.dataSet?.dataValue} type="p" >
          </WmLabel>
        </WmContainer>
      </WmDialogBody>
      <WmDialogActions   name="illustrationResultDialogActions">
        <WmButton listener={fragment}  name="btnIllustrationResultOk" caption="OK" type="button" onClick={fragment?.illustrationResultOkClick} className='btn-default'  >
        </WmButton>
      </WmDialogActions>
    </WmDialog>
</WmPageContent>
    </React.Fragment>
  );
}

const ComponentWithPage = BasePage(
  IllustrationComponent,
  addPageScript,
  getVariables,
  {
    componentName: "Illustration",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:'PAGE',
    
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage    {...props} />;
});
