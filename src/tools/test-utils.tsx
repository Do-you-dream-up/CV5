import { JssProvider, ThemeProvider } from 'react-jss';
import React, { ReactElement } from 'react';
import { RenderOptions, render, screen } from '@testing-library/react';

import { ConfigurationProvider } from '../contexts/ConfigurationContext';
import { EventsProvider } from '../contexts/EventsContext';
import ViewModeProvider from '../contexts/ViewModeProvider';
import configuration from '../../public/override/configuration.json';
import theme from '../../public/override/theme.json';

const AllTheProviders = ({ children }: { children: any }) => {
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

export { customRender as render, screen };
