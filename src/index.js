import React from 'react';
import ReactDOM from 'react-dom';
import { JssProvider, ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import theme from './styles/theme';
import { configuration } from './tools/configuration';
import './tools/internationalization';


configuration.initialize().then(configuration => {
  const anchor = document.getElementById(configuration.root);
  if (anchor) {
    ReactDOM.render(
      <JssProvider id={{minify: process.env.NODE_ENV === 'production'}}>
        <ThemeProvider theme={theme}>
          <ConfigurationProvider configuration={configuration}>
            <Application />
          </ConfigurationProvider>
        </ThemeProvider>
      </JssProvider>,
      anchor,
    );
  }
});
