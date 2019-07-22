import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { DialogProvider } from './contexts/DialogContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import theme from './theme';
import './styles/reset.scss';


const root = document.getElementById('dydu-root');
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
