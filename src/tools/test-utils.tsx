import { JssProvider, ThemeProvider } from 'react-jss';
import { RenderOptions, render, screen } from '@testing-library/react';

import { ConfigurationProvider } from '../contexts/ConfigurationContext';
import { EventsProvider } from '../contexts/EventsContext';
import { ReactElement } from 'react';
import { ServerStatusProvider } from '../contexts/ServerStatusContext';
import ViewModeProvider from '../contexts/ViewModeProvider';
import configuration from '../../public/override/configuration.json';
import { mergeDeep } from './object';
import theme from '../../public/override/theme.json';
import { AuthProtected, AuthProvider } from '../components/auth/AuthContext';

interface CustomProps {
  configuration?: Models.Configuration;
  theme?: Models.Theme;
  auth?: Models.AuthConfig;
}

const authConfig: Models.AuthConfig = {
  clientId: configuration?.oidc.clientId,
  clientSecret: configuration?.oidc?.clientSecret,
  pkceActive: configuration?.oidc?.pkceActive,
  pkceMode: configuration?.oidc?.pkceMode,
  authUrl: configuration?.oidc.authUrl,
  tokenUrl: configuration?.oidc.tokenUrl,
  scope: configuration?.oidc?.scopes,
};

export const ProviderWrapper = ({ children, customProp }: { children: any; customProp?: CustomProps }) => {
  const mergedConfiguration = mergeDeep(configuration, customProp?.configuration);
  const mergedTheme = mergeDeep(theme, customProp?.theme);
  const mergedAuthConfiguration = mergeDeep(authConfig, customProp?.auth);

  return (
    <JssProvider>
      <ThemeProvider theme={mergedTheme}>
        <ConfigurationProvider configuration={mergedConfiguration}>
          <ServerStatusProvider>
            <AuthProvider configuration={mergedAuthConfiguration}>
              <AuthProtected enable={mergedConfiguration?.oidc?.enable}>
                <ViewModeProvider>
                  <EventsProvider>{children}</EventsProvider>
                </ViewModeProvider>
              </AuthProtected>
            </AuthProvider>
          </ServerStatusProvider>
        </ConfigurationProvider>
      </ThemeProvider>
    </JssProvider>
  );
};

const customRender = (ui: ReactElement, customProp?: CustomProps, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {
    wrapper: () => <ProviderWrapper children={ui} customProp={customProp} />,
    ...options,
  });

export { customRender as render, screen };

export const setupFetchStub = (data) => {
  return function fetchStub(_url) {
    return new Promise((resolve) => {
      resolve({
        json: () =>
          Promise.resolve({
            data,
          }),
      });
    });
  };
};
