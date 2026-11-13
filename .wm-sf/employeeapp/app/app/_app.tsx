import React from 'react';
import BaseApp from '@wavemaker-ai/react-runtime/higherOrder/BaseApp';
import appstore from '@wavemaker-ai/react-runtime/core/appstore';
import formatters from '@wavemaker-ai/react-runtime/core/formatters';
import { VALIDATOR , MATCH_MODES } from '@wavemaker-ai/react-runtime/core/util';

import partialConfigs from '@/app/components/partial-config';
import appVariables from '@/app/app.variables';
import WM_CUSTOM_FORMATTERS from '@/libs/extensions/formatters';
import AppScript from "@/app/app.script.js"
import Common from '@/app/components/Common/Common'

function App({children}: {children: React.ReactNode}) {

// _set default wavemaker app configs
  const appConfig = {
    partials: partialConfigs,
    appVariables: appVariables,
  };

  appstore.set('AppConfig', appConfig);
  appstore.set('CONSTANTS', { VALIDATOR ,MATCH_MODES});
   appstore.set('formatters', formatters);
  Object.keys(WM_CUSTOM_FORMATTERS).forEach(k => {
        formatters.set(`custom.${k}`, WM_CUSTOM_FORMATTERS[k]);
  });

  return children;
}

const WmApp = BaseApp(
  App,
  AppScript,
  appVariables,
  {
    componentName: "App",
    startUpVariables: [],
    startUpActions: [],
    autoUpdateVariables: [],
    type:'App',
    common:Common,
  }
);

export default React.memo((props: any) => {
  return <WmApp   {...props} />;
});
