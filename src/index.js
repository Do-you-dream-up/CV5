import Axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { JssProvider, ThemeProvider } from 'react-jss';
import Application from './components/Application';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { EventsProvider } from './contexts/EventsContext';
import { UserActionProvider } from './contexts/UserActionContext';
import breakpoints from './styles/breakpoints';
import { configuration } from './tools/configuration';
import './tools/internationalization';
import keycloak from './tools/keycloak';
const css = JSON.parse(localStorage.getItem('dydu.css'));

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
const renderApp = (theme) => ReactDOM.render(
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
    Axios.get(`${process.env.PUBLIC_URL}override/theme.json`)
    .then(res => {
        const data = res && res.data ? res.data : {};
        data.palette.primary.main = css && css.main;
        data.breakpoints = breakpoints;
        configuration.keycloak.enable ? keycloak.initKeycloak(renderApp(data), configuration.keycloak) : renderApp(data);

    });
  }
});
