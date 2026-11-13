'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import BasePartial from "@wavemaker-ai/react-runtime/higherOrder/BasePage";
import { useAppState,useProxy } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import { formatMessage,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmAnchor from '@wavemaker-ai/react-runtime/components/basic/anchor';
import WmNav from '@wavemaker-ai/react-runtime/components/navbar/nav';
import WmNavItem from '@wavemaker-ai/react-runtime/components/navbar/nav-item';
import WmNavbar from '@wavemaker-ai/react-runtime/components/navbar';
import WmPartial from '@wavemaker-ai/react-runtime/components/page/partial';
import addPartialScript from './topnav.script';
import "./topnav.css";
import getVariables from './topnav.variables';

const TopnavComponent = (props:any) => {
  const fragment = useAppState();

const stateProxy = useProxy()
const Widgets = fragment?.Widgets;
const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();
},[])


  return (
    <React.Fragment>
      
  <WmPartial iswidget="false" data-role="partial"  name="topnav" type="topnav" >
    <WmNavbar 
          name="wm_navbar_13fb98gjhd">
      <WmNav 
          listener={fragment}
            name="leftTopLinks" type="navbar" className='navbar-left'
            >
        <WmNavItem
              name="list_home" defaultview="true">
          <WmAnchor listener={fragment} caption="Home" name="homeLink" iconclass="wi wi-home" className='navAnchorItem ' ></WmAnchor>
        </WmNavItem>
        <WmNavItem
              name="list_services" defaultview="true">
          <WmAnchor listener={fragment} caption="Order" name="orderLink" iconclass="wi wi-list" className='navAnchorItem ' ></WmAnchor>
        </WmNavItem>
      </WmNav>
      <WmNav 
          listener={fragment}
            name="rightTopLinks" type="navbar" className='navbar-right'
            >
        <WmNavItem
              name="list_help" defaultview="true">
          <WmAnchor listener={fragment} caption="Help" name="helpLink" iconclass="wi wi-help-outline" className='navAnchorItem ' ></WmAnchor>
        </WmNavItem>
        <WmNavItem
              name="list_logout" defaultview="true">
          <WmAnchor listener={fragment} caption="Logout" name="logoutLink" iconclass="wi wi-sign-out" onClick={() => {fragment?.Actions?.logoutAction?.invoke?.();}} className='navAnchorItem ' ></WmAnchor>
        </WmNavItem>
      </WmNav>
    </WmNavbar>
  </WmPartial>

    </React.Fragment>
  );
}

const ComponentWithPage = BasePartial(
  TopnavComponent,
  addPartialScript,
  getVariables,
  {
    componentName: "topnav",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:"PARTIAL",
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage {...props}  />;
});
