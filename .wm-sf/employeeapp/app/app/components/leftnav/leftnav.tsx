'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import BasePartial from "@wavemaker-ai/react-runtime/higherOrder/BasePage";
import { useAppState,useProxy } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import { formatMessage,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmAnchor from '@wavemaker-ai/react-runtime/components/basic/anchor';
import WmContainer from '@wavemaker-ai/react-runtime/components/container';
import WmNav from '@wavemaker-ai/react-runtime/components/navbar/nav';
import WmNavItem from '@wavemaker-ai/react-runtime/components/navbar/nav-item';
import WmPartial from '@wavemaker-ai/react-runtime/components/page/partial';
import WmPicture from '@wavemaker-ai/react-runtime/components/basic/picture';
import addPartialScript from './leftnav.script';
import "./leftnav.css";
import getVariables from './leftnav.variables';

const LeftnavComponent = (props:any) => {
  const fragment = useAppState();

const stateProxy = useProxy()
const Widgets = fragment?.Widgets;
const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();
},[])


  return (
    <React.Fragment>
      
  <WmPartial iswidget="false" data-role="partial"  name="leftnav" type="leftnav" >
    <WmContainer listener={fragment} direction="row" alignment="middle-center" width="fill" name="container1" layoutWidth="fill" layoutHeight="80px" styles={{"width":"100%"}} layoutClassName='wm-d-flex wm-fd-row wm-fw-nowrap wm-jc-center wm-ai-center wm-w-100pct wm-h-80px wm-fs-0' >
      <WmPicture listener={fragment} resizemode="cover" name="picture1" picturesource="https://dh2dw20653ig1.cloudfront.net/assets/wavemaker_logo.png" className='img-rounded'   ></WmPicture>
    </WmContainer>
    <WmNav 
        listener={fragment}
          name="leftnavigation" type="pills" layout="stacked" className='stackedNav '
          >
      <WmNavItem
            name="list_dashboard" defaultview="true">
        <WmAnchor listener={fragment} caption="Dashboard" name="dashboardLink" iconclass="wi wi-bar-graph" className='navAnchorItem ' ></WmAnchor>
      </WmNavItem>
      <WmNavItem
            name="list_order" defaultview="true">
        <WmAnchor listener={fragment} caption="Pending Orders" name="orderLink" iconclass="wi wi-file" className='navAnchorItem ' ></WmAnchor>
      </WmNavItem>
      <WmNavItem
            name="list_inventory" defaultview="true">
        <WmAnchor listener={fragment} caption="Inventory" name="inventoryLink" iconclass="wi wi-tag" className='navAnchorItem ' ></WmAnchor>
      </WmNavItem>
      <WmNavItem
            name="list_support" defaultview="true">
        <WmAnchor listener={fragment} caption="Support Calls" name="supportLink" iconclass="wi wi-envelope" className='navAnchorItem ' ></WmAnchor>
      </WmNavItem>
    </WmNav>
  </WmPartial>

    </React.Fragment>
  );
}

const ComponentWithPage = BasePartial(
  LeftnavComponent,
  addPartialScript,
  getVariables,
  {
    componentName: "leftnav",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:"PARTIAL",
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage {...props}  />;
});
