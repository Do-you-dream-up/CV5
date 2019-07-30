import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { DialogProvider } from './contexts/DialogContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import theme from './styles/theme';
import Configuration from './tools/configuration';
import './styles/reset.scss';


const root = document.getElementById(Configuration.get('root'));
if (root) {
  window.dydu = {};
  ReactDOM.render(
    <DialogProvider>
      <OnboardingProvider>
        <ThemeProvider children={<Application />} theme={theme} />
      </OnboardingProvider>
    </DialogProvider> , root
  );
}
