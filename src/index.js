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

const getRootDiv = (configuration) => {

  if (document.getElementById(configuration.root))
    return document.getElementById(configuration.root);

  const rootId = document.createElement('div');
  rootId.id = configuration.root;
  document.body.appendChild(rootId);
  return document.getElementById(configuration.root);
};

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
  anchor = getRootDiv(configuration);
  if (anchor) {
    configuration.keycloak.enable ? keycloak.initKeycloak(renderApp, configuration.keycloak) : renderApp();
  }
});
