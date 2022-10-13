// eslint-disable-next-line import/no-unresolved

import '../../../public/override/style.css';

import React, { Suspense, useContext, useEffect } from 'react';

import AuthPayload from '../../modulesApi/OidcModuleApi';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsContext } from '../../contexts/EventsContext';
import { LivechatProvider } from '../../contexts/LivechatContext';
import Teaser from '../Teaser';
import c from 'classnames';
import { findValueByKey } from '../../tools/findValueByKey';
import { parseString } from '../../tools/parseString';
import qs from 'qs';
import useStyles from './styles';
import { useViewMode } from '../../contexts/ViewModeProvider';
import SurveyProvider from '../../Survey/SurveyProvider';
import dydu from '../../tools/dydu';

const { AuthContext, Authenticated } = AuthPayload;

const Chatbox = React.lazy(() =>
  import(
    // webpackChunkName: "chatbox"
    '../Chatbox'
  ).then((module) => ({ default: module.ChatboxWrapper })),
);
const Wizard = React.lazy(() =>
  import(
    // webpackChunkName: "wizard"
    '../Wizard'
  ),
);

/**
 * Entry point of the application. Either render the chatbox or the teaser.
 *
 * Optionally render the Wizard when the `wizard` URL parameter is found.
 */
export default function Application() {
  const { configuration } = useContext(ConfigurationContext);
  const {
    close: closeChatbox,
    mode,
    popin: popinChatbox,
    isOpen: isChatboxOpen,
    isFull: isChatboxFullScreen,
    isMinimize: isChatboxMinimize,
    toggle,
  } = useViewMode();

  const event = useContext(EventsContext).onEvent('chatbox');
  const classes = useStyles({ configuration });
  const hasWizard = qs.parse(window.location.search, { ignoreQueryPrefix: true }).wizard !== undefined;
  // eslint-disable-next-line no-unused-vars

  let customFont = configuration.font.url;

  const hasAuthStorageCheck = configuration.checkAuthorization?.active;
  const sessionStorageKey = configuration.checkAuthorization?.sessionStorageKey;
  const searchKey = configuration.checkAuthorization?.searchKey;

  //const oidcEnabled = configuration.oidc ? configuration.oidc.enable : false;

  // get the session storage value based on the sessionStorageKey
  const sessionStorageValue = parseString(sessionStorage.getItem(sessionStorageKey));
  // if the session storage value is a deep nested object, check for the searchKey
  const sessionToken =
    sessionStorageValue && typeof sessionStorageValue === 'object'
      ? findValueByKey(sessionStorageValue, searchKey)
      : sessionStorageValue;
  const isAuthorized = sessionToken && !!sessionToken.length && !!sessionToken[0];

  if (customFont && document.getElementById('font') && customFont !== document.getElementById('font').href) {
    document.getElementById('font').href = customFont;
  }

  useEffect(() => {
    if (hasAuthStorageCheck && !isAuthorized) closeChatbox();
  }, [closeChatbox, hasAuthStorageCheck, isAuthorized]);

  useEffect(() => {
    event('loadChatbox');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c('dydu-application', classes.root)}>
      <Suspense fallback={null}>
        {hasWizard && <Wizard />}
        <DialogProvider onPushrulesDataReceived={popinChatbox}>
          <AuthContext>
            <Authenticated>
              <SurveyProvider api={dydu}>
                <LivechatProvider>
                  <Chatbox extended={isChatboxFullScreen} open={isChatboxOpen} toggle={toggle} mode={mode} />
                </LivechatProvider>
              </SurveyProvider>
              <Teaser open={isChatboxMinimize} toggle={toggle} />
            </Authenticated>
          </AuthContext>
        </DialogProvider>
      </Suspense>
    </div>
  );
}
