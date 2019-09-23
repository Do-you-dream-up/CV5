import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { DialogProvider } from './contexts/DialogContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import theme from './styles/theme';
import { configuration } from './tools/configuration';


configuration.initialize().then(configuration => {
  const anchor = document.getElementById(configuration.root);
  if (anchor) {
    ReactDOM.render(
      <ConfigurationProvider configuration={configuration}>
        <DialogProvider>
          <OnboardingProvider>
            <ThemeProvider children={<Application />} theme={theme} />
          </OnboardingProvider>
        </DialogProvider>
      </ConfigurationProvider>,
      anchor,
    );
  }
});
