'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import BasePartial from "@wavemaker-ai/react-runtime/higherOrder/BasePage";
import { useAppState,useProxy } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import { formatMessage,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmContainer from '@wavemaker-ai/react-runtime/components/container';
import WmLabel from '@wavemaker-ai/react-runtime/components/basic/label';
import WmPartial from '@wavemaker-ai/react-runtime/components/page/partial';
import addPartialScript from './footer.script';
import "./footer.css";
import getVariables from './footer.variables';

const FooterComponent = (props:any) => {
  const fragment = useAppState();

const stateProxy = useProxy()
const Widgets = fragment?.Widgets;
const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();
},[])


  return (
    <React.Fragment>
      
  <WmPartial iswidget="false" data-role="partial"  name="footer" type="footer" >
    <WmContainer listener={fragment} direction="row" alignment="middle-right" gap="4" width="fill" name="footerlayout" layoutWidth="fill" layoutHeight="auto" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-flex-end wm-ai-center wm-gap-4px wm-w-100pct wm-h-auto wm-fs-0' >
      <WmLabel listener={fragment} caption="Copyright 2026 [company name]" name="copyright" type="p" styles={{"textAlign":"right"}} ></WmLabel>
    </WmContainer>
  </WmPartial>

    </React.Fragment>
  );
}

const ComponentWithPage = BasePartial(
  FooterComponent,
  addPartialScript,
  getVariables,
  {
    componentName: "footer",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:"PARTIAL",
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage {...props}  />;
});
