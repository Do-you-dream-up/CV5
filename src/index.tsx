import './tools/prototypes/prototypes-augmented';

import { JssProvider, ThemeProvider } from 'react-jss';

import App from './components/App/App';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import ReactDOM from 'react-dom';
import ViewModeProvider from './contexts/ViewModeProvider';
import { getResourceWithoutCache } from './tools/resources';
import breakpoints from './styles/breakpoints';
import { configuration } from './tools/configuration';
import { getCss, getMain } from './tools/css';
import jss from 'jss';
import preset from 'jss-preset-default';
import { I18nextProvider } from 'react-i18next';
import i18n from './contexts/i18nProvider';
import ShadowProvider from './contexts/ShadowProvider';
import { StyleSheetManager } from 'styled-components';
import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Local } from './tools/storage';
import { isLoadedFromChannels } from './tools/wizard';

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
              <I18nextProvider i18n={i18n}>
                <ViewModeProvider>
                  <StyleSheetManager target={styleSlot}>
                    <App />
                  </StyleSheetManager>
                </ViewModeProvider>
              </I18nextProvider>
            </ConfigurationProvider>
          </ThemeProvider>
        </JssProvider>
      </CacheProvider>
    </ShadowProvider>,
    anchor,
  );

configuration.initialize().then((configuration) => {
  Local.resetAllLocalStorageIfTooOld(configuration?.application?.localStorageKeepTimeInMs);

  let host = document.getElementById(configuration.root);

  if (host) {
    // remove previously added chatbox if any
    host.remove();
  }
  host = document.createElement('div');
  host.id = configuration.root;
  document.body.appendChild(host);

  // To prevent dydu-root from being empty
  // For example shopify add a display none to all div:empty
  host.appendChild(document.createElement('div'));
  const shadow = host.attachShadow({ mode: 'open' });
  const renderIn = document.createElement('div');
  renderIn.className = 'dydu-icons';

  const templateSlot = document.createElement('template');

  const emotionCache: EmotionCache = createCache({
    key: 'shadow-css',
    container: templateSlot,
  });

  shadow.appendChild(templateSlot);
  shadow.appendChild(renderIn);

  jss.setup({
    ...preset(),
    insertionPoint: templateSlot,
  });

  getResourceWithoutCache('override/theme.json').then(({ data = {} }) => {
    data.palette.primary.main = getMain()?.main || data.palette.primary.main;
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

  getResourceWithoutCache('./chatboxHomepage.css').then((res) => {
    if (res?.data.length > 0) {
      const style = document.createElement('style');
      style.textContent = res.data;
      shadow.appendChild(style);
    }
  });

  if (isLoadedFromChannels() && getCss()) {
    const style = document.createElement('style');
    style.textContent = getCss();
    shadow.appendChild(style);
  }
});
