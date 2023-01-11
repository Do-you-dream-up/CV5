import { JssProvider, ThemeProvider } from 'react-jss';
import React, { ReactElement } from 'react';
import { RenderOptions, render } from '@testing-library/react';

import { ConfigurationProvider } from '../contexts/ConfigurationContext';
import { EventsProvider } from '../contexts/EventsContext';
import ViewModeProvider from '../contexts/ViewModeProvider';
import configuration from '../../public/override/configuration.json';
import theme from '../../public/override/theme.json';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <JssProvider>
      <ThemeProvider theme={theme}>
        <ConfigurationProvider configuration={configuration}>
          <ViewModeProvider>
            <EventsProvider>{children}</EventsProvider>
          </ViewModeProvider>
        </ConfigurationProvider>
      </ThemeProvider>
    </JssProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
