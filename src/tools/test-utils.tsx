import { JssProvider, ThemeProvider } from 'react-jss';
import { ReactElement } from 'react';
import { RenderOptions, render, screen, act } from '@testing-library/react';

import { ConfigurationProvider } from '../contexts/ConfigurationContext';
import { EventsProvider } from '../contexts/EventsContext';
import ViewModeProvider from '../contexts/ViewModeProvider';
import configuration from '../../public/override/configuration.json';
import theme from '../../public/override/theme.json';
import { mergeDeep } from './object';

interface CustomProps {
  configuration?: Models.Configuration;
  theme?: Models.Theme;
}

const ProviderWrapper = ({ children, customProp }: { children: any; customProp?: CustomProps }) => {
  const mergedConfiguration = mergeDeep(configuration, customProp?.configuration);
  const mergedTheme = mergeDeep(theme, customProp?.theme);
  return (
    <JssProvider>
      <ThemeProvider theme={mergedTheme}>
        <ConfigurationProvider configuration={mergedConfiguration}>
          <ViewModeProvider>
            <EventsProvider>{children}</EventsProvider>
          </ViewModeProvider>
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
