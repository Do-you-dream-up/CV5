import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { DialogProvider } from './contexts/DialogContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import theme from './styles/theme';
import { configuration } from './tools/configuration';


configuration.initialize().then((data) => {
  const anchor = document.getElementById(data.root);
  if (anchor) {
    window.dydu = {};
    ReactDOM.render(
      <DialogProvider>
        <OnboardingProvider>
          <ThemeProvider children={<Application />} theme={theme} />
        </OnboardingProvider>
      </DialogProvider> , anchor
    );
  }
});
