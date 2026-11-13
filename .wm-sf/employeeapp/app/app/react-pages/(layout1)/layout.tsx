'use client';
import React from "react";
import dynamic from 'next/dynamic';
import { formatMessage ,_get,toNumber} from '@wavemaker-ai/react-runtime/core/util';
import WmContent from '@wavemaker-ai/react-runtime/components/page/content';
import WmFooter from '@wavemaker-ai/react-runtime/components/layout/footer';
import WmHeader from '@wavemaker-ai/react-runtime/components/layout/header';
import WmLeftPanel from '@wavemaker-ai/react-runtime/components/layout/leftnav';
import WmRightPanel from '@wavemaker-ai/react-runtime/components/layout/rightnav';
import WmTopNav from '@wavemaker-ai/react-runtime/components/layout/topnav';
import WmPage from '@wavemaker-ai/react-runtime/components/page';

const MockedFragment = {
  Widgets: {},
  Variables: {},
  Actions: {},
};

function Layout({ children }: { children: React.ReactNode }) {
  const fragment = MockedFragment;
  return (
    <>
      <WmPage name="page" pagetitle="printIllustration" >
  <WmContent data-role="page-content" role="main" name="content" >
  {children}
</WmContent>
</WmPage>
    </>
  );
}
export default Layout;
