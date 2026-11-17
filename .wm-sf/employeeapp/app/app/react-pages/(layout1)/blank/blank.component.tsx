'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import { useAppState } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import BasePage from '@wavemaker-ai/react-runtime/higherOrder/BasePage';
import { formatMessage ,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmPageContent from '@wavemaker-ai/react-runtime/components/page/page-content';
import addPageScript from './blank.script';
import "./blank.css";
import getVariables from './blank.variables';

const BlankComponent = (props: any) => {
  const fragment = useAppState();
  const Widgets = fragment?.Widgets;
  const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();

},[])

  return (
    <React.Fragment>
        
<WmPageContent columnwidth={12} name="pagecontent" pagetitle="Blank" ></WmPageContent>
    </React.Fragment>
  );
}

const ComponentWithPage = BasePage(
  BlankComponent,
  addPageScript,
  getVariables,
  {
    componentName: "blank",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    componentType:'PAGE',
    
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage    {...props} />;
});
