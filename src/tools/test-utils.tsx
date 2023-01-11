import React, { ReactElement } from 'react';
import { RenderOptions, render } from '@testing-library/react';

import { ConfigurationProvider } from '../contexts/ConfigurationContext';
import { ThemeProvider } from 'react-jss';
import configuration from '../../public/override/configuration.json';
import theme from '../../public/override/theme.json';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <ConfigurationProvider configuration={configuration}>{children}</ConfigurationProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
