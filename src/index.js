import React from 'react';
import ReactDOM from 'react-dom';
import { JssProvider, ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { EventsProvider } from './contexts/EventsContext';
import { UserActionProvider } from './contexts/UserActionContext';
import theme from './styles/theme';
import { configuration } from './tools/configuration';
import './tools/internationalization';
import keycloak from './tools/keycloak';


let _configuration;
let anchor;

// eslint-disable-next-line react/no-render-return-value
const renderApp = () => ReactDOM.render(
  <JssProvider id={{minify: process.env.NODE_ENV === 'production'}}>
    <ThemeProvider theme={theme}>
      <ConfigurationProvider configuration={_configuration}>
        <EventsProvider>
          <UserActionProvider>
            <Application />
          </UserActionProvider>
        </EventsProvider>
      </ConfigurationProvider>
    </ThemeProvider>
  </JssProvider>,
  anchor,
);

configuration.initialize().then(configuration => {
  _configuration = configuration;
  anchor = document.getElementById(configuration.root);
  if (anchor) {
    configuration.keycloak.enable ? keycloak.initKeycloak(renderApp, configuration.keycloak) : renderApp();
  }
});
