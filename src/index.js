import './tools/prototypes/prototypes-augmented';
import './tools/internationalization';

import { JssProvider, ThemeProvider } from 'react-jss';

import Application from './components/Application';
import Axios from 'axios';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { EventsProvider } from './contexts/EventsContext';
import React from 'react';
import ReactDOM from 'react-dom';
import { SamlProvider } from './contexts/SamlContext';
import { UserActionProvider } from './contexts/UserActionContext';
import ViewModeProvider from './contexts/ViewModeProvider';
import breakpoints from './styles/breakpoints';
import { configuration } from './tools/configuration';
import keycloak from './tools/keycloak';

const css = JSON.parse(localStorage.getItem('dydu.css'));

let _configuration;
let anchor;

const getRootDiv = (configuration) => {
  if (document.getElementById(configuration.root)) return document.getElementById(configuration.root);

  const rootId = document.createElement('div');
  rootId.id = configuration.root;
  document.body.appendChild(rootId);
  return document.getElementById(configuration.root);
};

const renderApp = (theme) =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <JssProvider id={{ minify: process.env.NODE_ENV === 'production' }}>
      <ThemeProvider theme={theme}>
        <ConfigurationProvider configuration={_configuration}>
          <SamlProvider>
            <ViewModeProvider>
              <EventsProvider>
                <UserActionProvider>
                  <Application />
                </UserActionProvider>
              </EventsProvider>
            </ViewModeProvider>
          </SamlProvider>
        </ConfigurationProvider>
      </ThemeProvider>
    </JssProvider>,
    anchor,
  );

configuration.initialize().then((configuration) => {
  _configuration = configuration;
  anchor = getRootDiv(configuration);
  if (anchor) {
    Axios.get(`${process.env.PUBLIC_URL}override/theme.json`).then((res) => {
      const data = res && res.data ? res.data : {};
      data.palette.primary.main = css ? css.main : data.palette.primary.main;
      data.breakpoints = breakpoints;
      configuration.keycloak.enable ? keycloak.initKeycloak(renderApp(data), configuration.keycloak) : renderApp(data);
    });
    Axios.get(`${process.env.PUBLIC_URL}override/style.css`).then((res) => {
      if (res?.data.length > 0) {
        const style = document.createElement('style');
        style.setAttribute('id', 'css-client');
        style.textContent = res.data;
        setTimeout(
          (window.onload = function () {
            document.getElementById('css-client').addEventListener('load', document.getElementsByTagName('head'));
          }),
          2000,
        );
        document.head?.append(style);
      }
    });
  }
});
