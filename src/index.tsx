import './tools/prototypes/prototypes-augmented';

import { JssProvider, ThemeProvider } from 'react-jss';

import App from './components/App/App';
import Axios from 'axios';
import { BotInfoProvider } from './contexts/BotInfoContext';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { EventsProvider } from './contexts/EventsContext';
import ReactDOM from 'react-dom';
import { ServerStatusProvider } from './contexts/ServerStatusContext';
import ViewModeProvider from './contexts/ViewModeProvider';
import { axiosConfigNoCache } from './tools/axios';
import breakpoints from './styles/breakpoints';
import { configuration } from './tools/configuration';
import { getCss } from './tools/css';
import keycloak from './tools/keycloak';
import scope from 'scope-css';
import { I18nextProvider } from 'react-i18next';
import i18n from './contexts/i18nProvider';
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
          <ServerStatusProvider>
            <I18nextProvider i18n={i18n}>
              <BotInfoProvider>
                <ViewModeProvider>
                  <EventsProvider>
                    <App />
                  </EventsProvider>
                </ViewModeProvider>
              </BotInfoProvider>
            </I18nextProvider>
          </ServerStatusProvider>
        </ConfigurationProvider>
      </ThemeProvider>
    </JssProvider>,
    anchor,
  );

configuration.initialize().then((configuration) => {
  _configuration = configuration;
  anchor = getRootDiv(configuration);

  if (anchor) {
    Axios.get(`${process.env.PUBLIC_URL}override/theme.json`, axiosConfigNoCache).then(({ data = {} }) => {
      data.palette.primary.main = getCss()?.main || data.palette.primary.main;
      data.breakpoints = breakpoints;
      configuration.keycloak.enable ? keycloak.initKeycloak(renderApp(data), configuration.keycloak) : renderApp(data);
    });

    Axios.get(`${process.env.PUBLIC_URL}override/style.css`, axiosConfigNoCache).then((res) => {
      if (res?.data.length > 0) {
        const style = document.createElement('style');
        style.textContent = scope(res.data, `#${configuration.root}`);
        document.head?.append(style);
      }
    });

    Axios.get(`${process.env.PUBLIC_URL}override/custom.js`, axiosConfigNoCache).then((res) => {
      if (res?.data.length > 0) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = res.data;
        document.head?.append(script);
      }
    });
  }
});
