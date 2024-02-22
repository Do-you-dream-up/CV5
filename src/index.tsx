import './tools/prototypes/prototypes-augmented';

import { JssProvider, ThemeProvider } from 'react-jss';

import App from './components/App/App';
import { BotInfoProvider } from './contexts/BotInfoContext';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { EventsProvider } from './contexts/EventsContext';
import ReactDOM from 'react-dom';
import { ServerStatusProvider } from './contexts/ServerStatusContext';
import ViewModeProvider from './contexts/ViewModeProvider';
import { getResourceWithoutCache } from './tools/resources';
import breakpoints from './styles/breakpoints';
import { configuration } from './tools/configuration';
import { getCss } from './tools/css';
import increaseSpecificity from 'jss-increase-specificity';
import jss from 'jss';
import preset from 'jss-preset-default';
import { I18nextProvider } from 'react-i18next';
import i18n from './contexts/i18nProvider';
import ShadowProvider from './contexts/ShadowProvider';
import { StyleSheetManager } from 'styled-components';
import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const renderApp = (
  jss: any,
  shadow: ShadowRoot,
  anchor: HTMLDivElement,
  styleSlot: HTMLElement,
  emotionCache: EmotionCache,
  theme: any,
  configuration: any,
) =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <ShadowProvider root={anchor} shadow={shadow}>
      <CacheProvider value={emotionCache}>
        <JssProvider jss={jss} id={{ minify: process.env.NODE_ENV === 'production' }}>
          <ThemeProvider theme={theme}>
            <ConfigurationProvider configuration={configuration}>
              <ServerStatusProvider>
                <I18nextProvider i18n={i18n}>
                  <BotInfoProvider>
                    <ViewModeProvider>
                      <EventsProvider>
                        <StyleSheetManager target={styleSlot}>
                          <App />
                        </StyleSheetManager>
                      </EventsProvider>
                    </ViewModeProvider>
                  </BotInfoProvider>
                </I18nextProvider>
              </ServerStatusProvider>
            </ConfigurationProvider>
          </ThemeProvider>
        </JssProvider>
      </CacheProvider>
    </ShadowProvider>,
    anchor,
  );

configuration.initialize().then((configuration) => {
  let host = document.getElementById(configuration.root);

  if (!host) {
    host = document.createElement('div');
    host.id = configuration.root;
    document.body.appendChild(host);
  }

  const shadow = host.attachShadow({ mode: 'open' });
  const renderIn = document.createElement('div');
  renderIn.id = configuration.root;

  const templateSlot = document.createElement('template');

  const emotionCache: EmotionCache = createCache({
    key: 'shadow-css',
    container: templateSlot,
  });

  shadow.appendChild(templateSlot);
  shadow.appendChild(renderIn);

  jss
    .setup({
      ...preset(),
      insertionPoint: templateSlot,
    })
    .use(increaseSpecificity());

  getResourceWithoutCache('override/theme.json').then(({ data = {} }) => {
    data.palette.primary.main = getCss()?.main || data.palette.primary.main;
    data.breakpoints = breakpoints;
    renderApp(jss, shadow, renderIn, templateSlot, emotionCache, data, configuration);
  });

  getResourceWithoutCache('override/style.css').then((res) => {
    if (res?.data.length > 0) {
      const style = document.createElement('style');
      style.textContent = res.data;
      shadow.appendChild(style);
    }
  });

  getResourceWithoutCache('override/custom.js').then((res) => {
    if (res?.data.length > 0) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = res.data;
      shadow.appendChild(script);
    }
  });

  getResourceWithoutCache('chatboxHomepage.css').then((res) => {
    if (res?.data.length > 0) {
      const style = document.createElement('style');
      style.textContent = res.data;
      shadow.appendChild(style);
    }
  });
});
