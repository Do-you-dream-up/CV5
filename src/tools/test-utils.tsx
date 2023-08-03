import { AuthProtected, AuthProvider } from '../components/auth/AuthContext';
import { JssProvider, ThemeProvider } from 'react-jss';
import { RenderOptions, render, screen } from '@testing-library/react';

import { BotInfoProvider } from '../contexts/BotInfoContext';
import { ConfigurationProvider } from '../contexts/ConfigurationContext';
import { EventsProvider } from '../contexts/EventsContext';
import { ReactElement } from 'react';
import { ServerStatusProvider } from '../contexts/ServerStatusContext';
import ViewModeProvider from '../contexts/ViewModeProvider';
import configuration from '../../public/override/configuration.json';
import { mergeDeep } from './object';
import theme from '../../public/override/theme.json';

interface CustomProps {
  configuration?: Models.Configuration;
  theme?: Models.Theme;
  auth?: Models.AuthConfig;
}

export const ProviderWrapper = ({ children, customProp }: { children: any; customProp?: CustomProps }) => {
  const mergedConfiguration = mergeDeep(configuration, customProp?.configuration);
  const mergedTheme = mergeDeep(theme, customProp?.theme);

  const authConfig: Models.AuthConfig = {
    clientId: mergedConfiguration?.oidc.clientId,
    clientSecret: mergedConfiguration?.oidc?.clientSecret,
    pkceActive: mergedConfiguration?.oidc?.pkceActive,
    pkceMode: mergedConfiguration?.oidc?.pkceMode,
    authUrl: configuration?.oidc.authUrl,
    tokenUrl: configuration?.oidc.tokenUrl,
    discoveryUrl: mergedConfiguration?.oidc.discoveryUrl,
    scope: mergedConfiguration?.oidc?.scopes,
  };

  const mergedAuthConfiguration = mergeDeep(authConfig, customProp?.auth);

  return (
    <JssProvider>
      <ThemeProvider theme={mergedTheme}>
        <ConfigurationProvider configuration={mergedConfiguration}>
          <ServerStatusProvider>
            <BotInfoProvider>
              <AuthProvider configuration={mergedAuthConfiguration}>
                <AuthProtected enable={mergedConfiguration?.oidc?.enable}>
                  <ViewModeProvider>
                    <EventsProvider>{children}</EventsProvider>
                  </ViewModeProvider>
                </AuthProtected>
              </AuthProvider>
            </BotInfoProvider>
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
