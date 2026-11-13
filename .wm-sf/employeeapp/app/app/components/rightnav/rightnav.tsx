'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import BasePartial from "@wavemaker-ai/react-runtime/higherOrder/BasePage";
import { useAppState,useProxy } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import { formatMessage,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmAnchor from '@wavemaker-ai/react-runtime/components/basic/anchor';
import WmNav from '@wavemaker-ai/react-runtime/components/navbar/nav';
import WmNavItem from '@wavemaker-ai/react-runtime/components/navbar/nav-item';
import WmPartial from '@wavemaker-ai/react-runtime/components/page/partial';
import addPartialScript from './rightnav.script';
import "./rightnav.css";
import getVariables from './rightnav.variables';

const RightnavComponent = (props:any) => {
  const fragment = useAppState();

const stateProxy = useProxy()
const Widgets = fragment?.Widgets;
const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();
},[])


  return (
    <React.Fragment>
      
  <WmPartial iswidget="false" data-role="partial"  name="rightnav" type="rightnav" >
    <WmNav 
        listener={fragment}
          name="rightnav" type="pills" layout="stacked" className='stackedNav '
          >
      <WmNavItem
            name="list_task" defaultview="true">
        <WmAnchor listener={fragment} caption="Tasks" name="taskLink" className='navAnchorItem ' ></WmAnchor>
      </WmNavItem>
      <WmNavItem
            name="list_directory" defaultview="true">
        <WmAnchor listener={fragment} caption="Directory" name="directoryLink" className='navAnchorItem ' ></WmAnchor>
      </WmNavItem>
      <WmNavItem
            name="list_people" defaultview="true">
        <WmAnchor listener={fragment} caption="People" name="peopleLink" className='navAnchorItem ' ></WmAnchor>
      </WmNavItem>
    </WmNav>
  </WmPartial>

    </React.Fragment>
  );
}

const ComponentWithPage = BasePartial(
  RightnavComponent,
  addPartialScript,
  getVariables,
  {
    componentName: "rightnav",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:"PARTIAL",
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage {...props}  />;
});
