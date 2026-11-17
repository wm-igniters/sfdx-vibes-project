'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import { useAppState } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import BasePage from '@wavemaker-ai/react-runtime/higherOrder/BasePage';
import { formatMessage ,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmButton from '@wavemaker-ai/react-runtime/components/form/button';
import WmContainer from '@wavemaker-ai/react-runtime/components/container';
import WmLabel from '@wavemaker-ai/react-runtime/components/basic/label';
import WmList from '@wavemaker-ai/react-runtime/components/data/list';
import WmPageContent from '@wavemaker-ai/react-runtime/components/page/page-content';
import addPageScript from './printIllustration.script';
import "./printIllustration.css";
import getVariables from './printIllustration.variables';

const PrintIllustrationComponent = (props: any) => {
  const fragment = useAppState();
  const Widgets = fragment?.Widgets;
  const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();

},[])

  return (
    <React.Fragment>
        
<WmPageContent columnwidth={12} name="pagecontent" pagetitle="printIllustration" className='print-illustration-content' >
<WmContainer listener={fragment} name="top_bar" direction="row" gap="auto" alignment="center" layoutWidth="100%" layoutHeight="hug" className='app-container-default' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-space-between wm-ai-center wm-w-100pct wm-h-fit-content wm-fs-0' >
          <WmButton listener={fragment}  name="btn_back" caption="Back" type="button" iconclass="wi wi-chevron-left" onClick={() => {fragment?.Actions?.goToPage_Illustration?.invoke?.();}} className='btn-filled btn-default'  ></WmButton>
          <WmButton listener={fragment}  name="btn_go_to_illustration" caption="Go to illustrations" type="button" onClick={fragment?.goToIllustrationClick} className='btn-filled btn-default'  ></WmButton>
        </WmContainer>
        <WmContainer listener={fragment} name="illustration_card" direction="column" layoutWidth="100%" styles={{"textAlign":"left","flexDirection":"row","justifyContent":"flex-start","flexWrap":"wrap"}} className='container-illustration-card' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-fs-0' >
          <WmContainer listener={fragment} name="card_header" direction="row" gap="8" alignment="middle-left" className='container-card-header' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-pt-14px wm-pr-20px wm-pb-14px wm-pl-20px' >
            <WmLabel listener={fragment} name="header_title" caption="Investment" type="p" className='label-header-title' ></WmLabel>
          </WmContainer>
          <WmContainer listener={fragment} name="card_body" direction="column" styles={{"textAlign":"left","flexDirection":"row","justifyContent":"flex-start","flexWrap":"wrap"}} className='app-container-default container-card-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-pt-20px wm-pr-20px wm-pb-8px wm-pl-20px' >
            <WmLabel listener={fragment} name="account_details_heading" caption="Account Details" type="p" className='label-section-heading' >
            </WmLabel>
            <WmList listener={fragment} name="account_details_list" dataset={fragment?.Variables?.accountDetails?.dataSet} navigation="None" pagesize={50} datasource={fragment?.Variables?.accountDetails} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                
                
                
                 renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                 const currentItemWidgetsRef = React.useRef({})   
                 const currentItemWidgets = getCurrentItemWidgets($index);
                 const item = $item;
                 currentItemWidgetsRef.current = currentItemWidgets;
                   const $first = $index === 0;
                   const $last = list && $index === list.length - 1;
                   return (<>
              
                <React.Fragment key={'list_item' + $index + '_' + 'account_details_tmpl'} >
                  <WmLabel listener={fragment} name="ad_label" caption={$item?.label} item-id={'account_details_list_' + $index + '_ad_label_g27'} type="p" styles={{"width":"280px"}} className='label-field-label' >
                  </WmLabel>
                  <WmLabel listener={fragment} name="ad_value" caption={$item?.value} item-id={'account_details_list_' + $index + '_ad_value_adg'} type="p" styles={{"width":"100%"}} className='label-field-value' >
                  </WmLabel>
                </React.Fragment>
              
            </>)}}></WmList>
            <WmLabel listener={fragment} name="party_details_heading" caption="Parties" type="p" className='label-section-heading' ></WmLabel>
            <WmList listener={fragment} name="party_details_list" dataset={fragment?.Variables?.partyDetails?.dataSet} navigation="None" pagesize={50} datasource={fragment?.Variables?.partyDetails} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                
                
                
                 renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                 const currentItemWidgetsRef = React.useRef({})   
                 const currentItemWidgets = getCurrentItemWidgets($index);
                 const item = $item;
                 currentItemWidgetsRef.current = currentItemWidgets;
                   const $first = $index === 0;
                   const $last = list && $index === list.length - 1;
                   return (<>
              
                <React.Fragment key={'list_item' + $index + '_' + 'party_details_tmpl'} >
                  <WmLabel listener={fragment} name="pd_label" caption={$item?.label} item-id={'party_details_list_' + $index + '_pd_label_ygu'} type="p" styles={{"width":"280px"}} className='label-field-label' >
                  </WmLabel>
                  <WmLabel listener={fragment} name="pd_value" caption={$item?.value} item-id={'party_details_list_' + $index + '_pd_value_weg'} type="p" styles={{"width":"100%"}} className='label-field-value' >
                  </WmLabel>
                </React.Fragment>
              
            </>)}}></WmList>
            <WmLabel listener={fragment} name="investment_details_heading" caption="Investment details" type="p" className='label-section-heading' ></WmLabel>
            <WmList listener={fragment} name="investment_details_list" dataset={fragment?.Variables?.investmentDetails?.dataSet} navigation="None" pagesize={50} datasource={fragment?.Variables?.investmentDetails} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                
                
                
                 renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                 const currentItemWidgetsRef = React.useRef({})   
                 const currentItemWidgets = getCurrentItemWidgets($index);
                 const item = $item;
                 currentItemWidgetsRef.current = currentItemWidgets;
                   const $first = $index === 0;
                   const $last = list && $index === list.length - 1;
                   return (<>
              
                <React.Fragment key={'list_item' + $index + '_' + 'investment_details_tmpl'} >
                  <WmLabel listener={fragment} name="id_label" caption={$item?.label} item-id={'investment_details_list_' + $index + '_id_label_2rc'} type="p" styles={{"width":"280px"}} className='label-field-label' >
                  </WmLabel>
                  <WmLabel listener={fragment} name="id_value" caption={$item?.value} item-id={'investment_details_list_' + $index + '_id_value_jsl'} type="p" styles={{"width":"100%"}} className='label-field-value' >
                  </WmLabel>
                </React.Fragment>
              
            </>)}}></WmList>
            <WmLabel listener={fragment} name="benefit_details_heading" caption="Benefits" type="p" className='label-section-heading' >
            </WmLabel>
            <WmList listener={fragment} name="benefit_details_list" dataset={fragment?.Variables?.benefitDetails?.dataSet} navigation="None" pagesize={50} datasource={fragment?.Variables?.benefitDetails} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                
                
                
                 renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                 const currentItemWidgetsRef = React.useRef({})   
                 const currentItemWidgets = getCurrentItemWidgets($index);
                 const item = $item;
                 currentItemWidgetsRef.current = currentItemWidgets;
                   const $first = $index === 0;
                   const $last = list && $index === list.length - 1;
                   return (<>
              
                <React.Fragment key={'list_item' + $index + '_' + 'benefit_details_tmpl'} >
                  <WmLabel listener={fragment} name="bd_label" caption={$item?.label} item-id={'benefit_details_list_' + $index + '_bd_label_9v4'} type="p" styles={{"width":"280px"}} className='label-field-label' >
                  </WmLabel>
                  <WmLabel listener={fragment} name="bd_value" caption={$item?.value} item-id={'benefit_details_list_' + $index + '_bd_value_qzc'} type="p" styles={{"width":"100%"}} className='label-field-value' >
                  </WmLabel>
                </React.Fragment>
              
            </>)}}></WmList>
            <WmLabel listener={fragment} name="single_contributions_heading" caption="Single contributions" type="p" className='label-section-heading' ></WmLabel>
            <WmList listener={fragment} name="single_contributions_list" dataset={fragment?.Variables?.singleContributions?.dataSet} navigation="None" pagesize={50} datasource={fragment?.Variables?.singleContributions} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                
                
                
                 renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                 const currentItemWidgetsRef = React.useRef({})   
                 const currentItemWidgets = getCurrentItemWidgets($index);
                 const item = $item;
                 currentItemWidgetsRef.current = currentItemWidgets;
                   const $first = $index === 0;
                   const $last = list && $index === list.length - 1;
                   return (<>
              
                <React.Fragment key={'list_item' + $index + '_' + 'single_contributions_tmpl'} >
                  <WmLabel listener={fragment} name="sc_label" caption={$item?.label} item-id={'single_contributions_list_' + $index + '_sc_label_zok'} type="p" styles={{"width":"280px"}} className='label-field-label' >
                  </WmLabel>
                  <WmLabel listener={fragment} name="sc_value" caption={$item?.value} item-id={'single_contributions_list_' + $index + '_sc_value_gqk'} type="p" styles={{"width":"100%"}} className='label-field-value' >
                  </WmLabel>
                  <WmLabel listener={fragment} name="sc_amount" caption={$item?.amount} item-id={'single_contributions_list_' + $index + '_sc_amount_zsd'} type="p" styles={{"width":"160px"}} className='label-field-value label-field-amount' ></WmLabel>
                </React.Fragment>
              
            </>)}}></WmList>
          </WmContainer>
        </WmContainer>
        <WmList listener={fragment} name="contribution_cards_list" dataset={fragment?.Variables?.contributionCards?.dataSet} navigation="None" pagesize={20} direction="column" gap="24" alignment="top-left" datasource={fragment?.Variables?.contributionCards} layoutWidth="100%" layoutHeight="hug" className='list-card list-contribution-cards' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-24px wm-w-100pct wm-h-fit-content wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-0px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-0px wm-pr-0px wm-pb-0px wm-pl-0px", className: "contribution-card-tmpl"})}
            
            
            
             renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
             const currentItemWidgetsRef = React.useRef({})   
             const currentItemWidgets = getCurrentItemWidgets($index);
             const item = $item;
             currentItemWidgetsRef.current = currentItemWidgets;
               const $first = $index === 0;
               const $last = list && $index === list.length - 1;
               return (<>
          
            <React.Fragment key={'list_item' + $index + '_' + 'contribution_card_tmpl'} >
              <WmContainer listener={fragment} name="contribution_card" direction="column" item-id={'contribution_cards_list_' + $index + '_contribution_card_adw'} styles={{"textAlign":"left","flexDirection":"row","justifyContent":"flex-start","flexWrap":"wrap"}} className='container-illustration-card' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct' >
                <WmContainer listener={fragment} name="contribution_card_header" direction="row" gap="8" alignment="middle-left" item-id={'contribution_cards_list_' + $index + '_contribution_card_header_6lk'} className='container-card-header' layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-pt-14px wm-pr-20px wm-pb-14px wm-pl-20px' >
                  <WmLabel listener={fragment} name="cc_title" caption={$item?.title} item-id={'contribution_cards_list_' + $index + '_cc_title_9x5'} type="p" className='label-header-title' ></WmLabel>
                </WmContainer>
                <WmContainer listener={fragment} name="contribution_card_body" direction="column" item-id={'contribution_cards_list_' + $index + '_contribution_card_body_8dw'} styles={{"textAlign":"left","flexDirection":"row","justifyContent":"flex-start","flexWrap":"wrap"}} className='app-container-default container-card-body' layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-w-100pct wm-pt-20px wm-pr-20px wm-pb-8px wm-pl-20px' >
                  <WmLabel listener={fragment} name="cc_details_heading" caption="Contribution details" item-id={'contribution_cards_list_' + $index + '_cc_details_heading_y2k'} type="p" className='label-section-heading' ></WmLabel>
                  <WmList listener={fragment} name="cc_details_list" dataset={$item?.details} navigation="None" pagesize={50} item-id={'contribution_cards_list_' + $index + '_cc_details_list_cb3'} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                      
                      
                      
                       renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                       const currentItemWidgetsRef = React.useRef({})   
                       const currentItemWidgets = getCurrentItemWidgets($index);
                       const item = $item;
                       currentItemWidgetsRef.current = currentItemWidgets;
                         const $first = $index === 0;
                         const $last = list && $index === list.length - 1;
                         return (<>
                    
                      <React.Fragment key={'list_item' + $index + '_' + 'cc_details_tmpl'} >
                        <WmLabel listener={fragment} name="ccd_label" caption={$item?.label} item-id={'cc_details_list_' + $index + '_ccd_label_17u'} type="p" styles={{"width":"280px"}} className='label-field-label' ></WmLabel>
                        <WmLabel listener={fragment} name="ccd_value" caption={$item?.value} item-id={'cc_details_list_' + $index + '_ccd_value_1i3'} type="p" styles={{"width":"100%"}} className='label-field-value' ></WmLabel>
                      </React.Fragment>
                    
                  </>)}}></WmList>
                  <WmLabel listener={fragment} name="cc_contributors_heading" caption="Contributors" item-id={'contribution_cards_list_' + $index + '_cc_contributors_heading_bx6'} type="p" className='label-section-heading' ></WmLabel>
                  <WmList listener={fragment} name="cc_contributors_list" dataset={$item?.contributors} navigation="None" pagesize={50} item-id={'contribution_cards_list_' + $index + '_cc_contributors_list_vcg'} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                      
                      
                      
                       renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                       const currentItemWidgetsRef = React.useRef({})   
                       const currentItemWidgets = getCurrentItemWidgets($index);
                       const item = $item;
                       currentItemWidgetsRef.current = currentItemWidgets;
                         const $first = $index === 0;
                         const $last = list && $index === list.length - 1;
                         return (<>
                    
                      <React.Fragment key={'list_item' + $index + '_' + 'cc_contributors_tmpl'} >
                        <WmLabel listener={fragment} name="ccc_label" caption={$item?.label} item-id={'cc_contributors_list_' + $index + '_ccc_label_ex3'} type="p" styles={{"width":"280px"}} className='label-field-label' ></WmLabel>
                        <WmLabel listener={fragment} name="ccc_value" caption={$item?.value} item-id={'cc_contributors_list_' + $index + '_ccc_value_e45'} type="p" styles={{"width":"100%"}} className='label-field-value' ></WmLabel>
                        <WmLabel listener={fragment} name="ccc_amount" caption={$item?.amount} item-id={'cc_contributors_list_' + $index + '_ccc_amount_sp3'} type="p" styles={{"width":"160px"}} className='label-field-value label-field-amount' ></WmLabel>
                      </React.Fragment>
                    
                  </>)}}></WmList>
                  <WmLabel listener={fragment} name="cc_charges_heading" caption="Charges and fees" item-id={'contribution_cards_list_' + $index + '_cc_charges_heading_r1a'} type="p" className='label-section-heading' ></WmLabel>
                  <WmList listener={fragment} name="cc_charges_list" dataset={$item?.charges} navigation="None" pagesize={50} item-id={'contribution_cards_list_' + $index + '_cc_charges_list_4l3'} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                      
                      
                      
                       renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                       const currentItemWidgetsRef = React.useRef({})   
                       const currentItemWidgets = getCurrentItemWidgets($index);
                       const item = $item;
                       currentItemWidgetsRef.current = currentItemWidgets;
                         const $first = $index === 0;
                         const $last = list && $index === list.length - 1;
                         return (<>
                    
                      <React.Fragment key={'list_item' + $index + '_' + 'cc_charges_tmpl'} >
                        <WmLabel listener={fragment} name="ccg_label" caption={$item?.label} item-id={'cc_charges_list_' + $index + '_ccg_label_sfk'} type="p" styles={{"width":"280px"}} className='label-field-label' ></WmLabel>
                        <WmLabel listener={fragment} name="ccg_value" caption={$item?.value} item-id={'cc_charges_list_' + $index + '_ccg_value_st7'} type="p" styles={{"width":"100%"}} className='label-field-value' ></WmLabel>
                        <WmLabel listener={fragment} name="ccg_amount" caption={$item?.amount} item-id={'cc_charges_list_' + $index + '_ccg_amount_hiw'} type="p" styles={{"width":"160px"}} className='label-field-value label-field-amount' ></WmLabel>
                      </React.Fragment>
                    
                  </>)}}></WmList>
                  <WmLabel listener={fragment} name="cc_allocations_heading" caption="Fund allocation" item-id={'contribution_cards_list_' + $index + '_cc_allocations_heading_vmg'} type="p" className='label-section-heading' ></WmLabel>
                  <WmList listener={fragment} name="cc_allocations_list" dataset={$item?.allocations} navigation="None" pagesize={50} item-id={'contribution_cards_list_' + $index + '_cc_allocations_list_kyo'} layoutWidth="100%" className='list-detail-rows' layoutClassName='wm-w-100pct wm-fs-0' itemAttrs={($item: any, $index: number) => ({layoutClassName: "wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-center wm-gap-8px wm-w-100pct wm-h-fit-content wm-fs-0 wm-pt-14px wm-pr-0px wm-pb-14px wm-pl-0px", className: "detail-row-tmpl"})}
                      
                      
                      
                       renderItem={($item:Record<string, any>, $index:number, list:Record<string, any>[] ,getCurrentItemWidgets :any) => {
                       const currentItemWidgetsRef = React.useRef({})   
                       const currentItemWidgets = getCurrentItemWidgets($index);
                       const item = $item;
                       currentItemWidgetsRef.current = currentItemWidgets;
                         const $first = $index === 0;
                         const $last = list && $index === list.length - 1;
                         return (<>
                    
                      <React.Fragment key={'list_item' + $index + '_' + 'cc_allocations_tmpl'} >
                        <WmLabel listener={fragment} name="cca_label" caption={$item?.label} item-id={'cc_allocations_list_' + $index + '_cca_label_vug'} type="p" styles={{"width":"280px"}} className='label-field-label' ></WmLabel>
                        <WmLabel listener={fragment} name="cca_value" caption={$item?.value} item-id={'cc_allocations_list_' + $index + '_cca_value_7su'} type="p" styles={{"width":"100%"}} className='label-field-value' ></WmLabel>
                        <WmLabel listener={fragment} name="cca_amount" caption={$item?.amount} item-id={'cc_allocations_list_' + $index + '_cca_amount_643'} type="p" styles={{"width":"160px"}} className='label-field-value label-field-amount' ></WmLabel>
                      </React.Fragment>
                    
                  </>)}}></WmList>
                </WmContainer>
              </WmContainer>
            </React.Fragment>
          
        </>)}}></WmList>
</WmPageContent>
    </React.Fragment>
  );
}

const ComponentWithPage = BasePage(
  PrintIllustrationComponent,
  addPageScript,
  getVariables,
  {
    componentName: "printIllustration",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:'PAGE',
    
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage    {...props} />;
});
