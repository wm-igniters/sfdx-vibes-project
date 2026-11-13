'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import BasePartial from "@wavemaker-ai/react-runtime/higherOrder/BasePage";
import { useAppState,useProxy } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import { formatMessage,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmContainer from '@wavemaker-ai/react-runtime/components/container';
import WmPartial from '@wavemaker-ai/react-runtime/components/page/partial';
import addPartialScript from './header.script';
import "./header.css";
import getVariables from './header.variables';

const HeaderComponent = (props:any) => {
  const fragment = useAppState();

const stateProxy = useProxy()
const Widgets = fragment?.Widgets;
const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();
},[])


  return (
    <React.Fragment>
      
  <WmPartial iswidget="false" data-role="partial"  name="header" type="header" >
    <WmContainer listener={fragment} direction="column" alignment="top-left" gap="4" width="fill" name="containerlayout" layoutWidth="fill" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-column wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px wm-w-100pct' >
      <WmContainer listener={fragment} direction="row" alignment="top-left" gap="4" width="fill" name="containerrow" height="fill" styles={{"height":"fill","width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-start wm-ai-flex-start wm-gap-4px wm-as-stretch wm-fg-1 wm-minh-0' >
        <WmContainer listener={fragment} direction="row" alignment="top-right" gap="4" name="containerright" wrap={false} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-end wm-ai-flex-start wm-gap-4px wm-w-100pct wm-fs-0' >
          <WmContainer listener={fragment} direction="row" alignment="top-right" gap="4" name="containersearch" wrap={false} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-end wm-ai-flex-start wm-gap-4px wm-w-320px wm-fs-0' ></WmContainer>
        </WmContainer>
      </WmContainer>
    </WmContainer>
  </WmPartial>

    </React.Fragment>
  );
}

const ComponentWithPage = BasePartial(
  HeaderComponent,
  addPartialScript,
  getVariables,
  {
    componentName: "header",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:"PARTIAL",
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage {...props}  />;
});
