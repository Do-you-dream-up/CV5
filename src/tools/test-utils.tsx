import '../tools/prototypes/strings';
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

interface CustomProps {
  configuration?: Models.Configuration;
  theme?: Models.Theme;
}

export const ProviderWrapper = ({ children, customProp }: { children: any; customProp?: CustomProps }) => {
  const mergedConfiguration = mergeDeep(configuration, customProp?.configuration);
  const mergedTheme = mergeDeep(theme, customProp?.theme);

  return (
    <JssProvider>
      <ThemeProvider theme={mergedTheme}>
        <ConfigurationProvider configuration={mergedConfiguration}>
          <ServerStatusProvider>
            <ViewModeProvider>
              <EventsProvider>{children}</EventsProvider>
            </ViewModeProvider>
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
