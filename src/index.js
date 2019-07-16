import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { DialogProvider } from './contexts/DialogContext';
import theme from './theme';
import './styles/reset.scss';


const root = document.getElementById('dydu-root');
if (root) {
  window.dydu = {};
  ReactDOM.render(
    <DialogProvider>
      <ThemeProvider children={<Application />} theme={theme} />
    </DialogProvider> , root
  );
}
