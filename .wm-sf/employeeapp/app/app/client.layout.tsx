'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '@wavemaker-ai/react-runtime/store';
import { ReactNode, useEffect, useMemo, useState, useTransition } from 'react';
import { useAppDispatch } from '@wavemaker-ai/react-runtime/store';
import WmAppSpinner from '@wavemaker-ai/react-runtime/components/common/app-spinner';
import { updateConfig } from '@wavemaker-ai/react-runtime/store/slices/appConfigSlice';
import { setRouter } from '@wavemaker-ai/react-runtime/store/util/router-ref';
import { useAuth } from '@wavemaker-ai/react-runtime/hooks/useAuth';
import {
  loadWmProperties,
  handle401,
  setupAxiosInterceptors,
} from '@wavemaker-ai/react-runtime/core/app.service';
import { ToastProvider } from '@wavemaker-ai/react-runtime/actions/toast-provider';
import { WmThemeProvider } from '@wavemaker-ai/react-runtime/mui-config/theme-provider';
import { loadLocaleBundle } from '@wavemaker-ai/react-runtime/store/thunks/i18n';
import LocalizationProvider from '@wavemaker-ai/react-runtime/context/LocalizationProvider';
import PageConfigs from '@/app/pages-config';
import App from '@/app/_app';
import { baseConfigs as PartialConfigs } from '@/app/components/partial-config';
import { ROUTING_BASEPATH_PRODUCTION } from '@wavemaker-ai/react-runtime/core/constants';
interface RouterLike {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  forward: () => void;
}

interface AppConfig {
  [key: string]: any;
  appVariables?: any;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  configs: AppConfig;
}

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const _store = useMemo(() => store, []);
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  useEffect(() => {
    setupAxiosInterceptors();

    const routerAdapter: RouterLike = {
      push: (path: string) => {
        startTransition(() => {
          router.push(path);
        });
      },
      replace: (path: string) => router.replace(path),
      back: () => router.back(),
      forward: () => router.forward(),
    };
    setRouter(routerAdapter);
  }, []);

  return (
    <Provider store={_store}>
      <WmAppSpinner name="navigation-loader" show={isNavigating} />
      {children}
    </Provider>
  );
};

const SecurityInitializer = ({
  children,
  baseURL,
}: {
  children: React.ReactNode;
  baseURL: string;
}) => {
  const dispatch = useAppDispatch();
  const { getLoggedInUserDetails = () => {}, isPageLoading = false } =
    useAuth() || {};
  const router = useRouter();
  const info = store.getState()?.info;
  const homePage = info?.appConfig?.appProperties?.homePage || 'Main';
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if we're at the root path
    if (
      pathname === '/' ||
      pathname === '' ||
      pathname === `/${ROUTING_BASEPATH_PRODUCTION}`
    ) {
      router.replace(`/${ROUTING_BASEPATH_PRODUCTION}/${homePage}`);
    }
  }, []);

  useEffect(() => {
    const initSecurity = async () => {
      try {
        await getLoggedInUserDetails(baseURL);
      } catch (error) {
        console.error('Failed to initialize security:', error);
      }
    };

    initSecurity();
  }, [baseURL, dispatch]);

  return (
    <>
      <WmAppSpinner name="security-page-loader" show={isPageLoading} />
      {children}
    </>
  );
};

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

const AppConfigWrapper = ({
  children,
  configs,
}: {
  children: React.ReactNode;
  configs: AppConfig;
}) => {
  const dispatch = useAppDispatch();
  const initialConfig = {
    ...configs,
    appConfig: {
      ...configs.appConfig,
    },
  };
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  useEffect(() => {
    async function loadAllConfigurations() {
      try {
        const appProperties = await loadWmProperties(
          initialConfig.appConfig.url
        );
        dispatch(
          updateConfig({
            ...initialConfig,
            appConfig: {
              ...initialConfig.appConfig,
              appProperties,
              pages: PageConfigs,
              partials: PartialConfigs,
            },
            appVariables: {},
          })
        );

        await store.dispatch(loadLocaleBundle()).unwrap();
      } catch (error) {
        console.error('Failed to load configurations:', error);
      } finally {
        setIsConfigLoading(false);
      }
    }

    loadAllConfigurations();
  }, []);

  if (isConfigLoading) {
    return <WmAppSpinner name="page" />;
  }

  return <>{children}</>;
};

export const ClientLayout = ({ children, configs }: ClientLayoutProps) => {
  return (
    <div className="wm-app-root" id="app-root">
      <base href={configs.appConfig.basePath} />
      <ReduxProvider>
        <LocalizationProvider>
          <WmThemeProvider>
            <AppConfigWrapper configs={configs}>
              <SecurityInitializer baseURL={configs.appConfig.url}>
                <App>
                  <ToastProvider>{children}</ToastProvider>
                </App>
              </SecurityInitializer>
            </AppConfigWrapper>
          </WmThemeProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </div>
  );
};
