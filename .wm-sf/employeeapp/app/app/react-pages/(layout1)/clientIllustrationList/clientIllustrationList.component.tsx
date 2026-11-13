'use client';
import React,{useEffect} from "react";
import dynamic from 'next/dynamic';
import { useAppState } from "@wavemaker-ai/react-runtime/context/WidgetProvider";
import BasePage from '@wavemaker-ai/react-runtime/higherOrder/BasePage';
import { formatMessage ,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmPageContent from '@wavemaker-ai/react-runtime/components/page/page-content';
import WmTable from '@wavemaker-ai/react-runtime/components/data/table';
import WmTableColumn from '@wavemaker-ai/react-runtime/components/data/table/table-column';
import addPageScript from './clientIllustrationList.script';
import "./clientIllustrationList.css";
import getVariables from './clientIllustrationList.variables';

const ClientIllustrationListComponent = (props: any) => {
  const fragment = useAppState();
  const Widgets = fragment?.Widgets;
  const Variables = fragment?.Variables;

useEffect(()=>{
  fragment?.pageReady();

},[])

  return (
    <React.Fragment>
        
<WmPageContent columnwidth={12} name="pagecontent" pagetitle="Client Illustration List" >
<WmTable listener={fragment} name="illustrationTable" title="Illustrations" dataset={fragment?.Variables?.svGetIllustrationList?.dataSet} navigation="Basic" pagesize={10} showrecordcount={true} navigationalign="left" datasource={fragment?.Variables?.svGetIllustrationList} binddataset="Variables.svGetIllustrationList.dataSet" styles={{"width":"100%"}} loading={fragment?.Variables?.svGetIllustrationList?.loading || false}  >
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_illustrationId" binding="illustrationId" caption="Illustration Id" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_illustrationRef" binding="illustrationRef" caption="Illustration Ref" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_clientForename" binding="client.forename" caption="Client Forename" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_clientSurname" binding="client.surname" caption="Client Surname" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_productDescription" binding="product.description" caption="Product" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_preparedBy" binding="preparedBy.displayName" caption="Prepared By" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_taxYear" binding="taxYear" caption="Tax Year" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_status" binding="status" caption="Status" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_currentStep" binding="currentStep" caption="Current Step" sortable={true}>
          </WmTableColumn>
          <WmTableColumn listener={fragment} editWidgetType="text"  widgetType="label"  name="table_column_illustratedAt" binding="illustratedAt" caption="Illustrated At" sortable={true}>
          </WmTableColumn>
        </WmTable>
</WmPageContent>
    </React.Fragment>
  );
}

const ComponentWithPage = BasePage(
  ClientIllustrationListComponent,
  addPageScript,
  getVariables,
  {
    componentName: "clientIllustrationList",
    startUpVariables: ['svGetIllustrationList'],
    startUpActions: [],
    autoUpdateVariables: ['svGetIllustrationList'],
    componentType:'PAGE',
    
  }
);

export default React.memo((props: any) => {
  return <ComponentWithPage    {...props} />;
});
