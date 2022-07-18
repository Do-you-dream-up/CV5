// eslint-disable-next-line import/no-unresolved
import '../../../public/override/style.css';

import React, { Suspense, useContext, useEffect, useState } from 'react';

import AuthPayload from '../../modulesApi/OidcModuleApi';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsContext } from '../../contexts/EventsContext';
import { LivechatProvider } from '../../contexts/LivechatContext';
import { Local } from '../../tools/storage';
import Teaser from '../Teaser';
import c from 'classnames';
import fetchPushrules from '../../tools/pushrules';
import { findValueByKey } from '../../tools/findValueByKey';
import { parseString } from '../../tools/parseString';
import qs from 'qs';
import useStyles from './styles';

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

  const event = useContext(EventsContext).onEvent('chatbox');
  const classes = useStyles({ configuration });
  const hasWizard = qs.parse(window.location.search, { ignoreQueryPrefix: true }).wizard !== undefined;
  const initialMode = Local.get(Local.names.open, ~~configuration.application.open);
  const [mode, setMode] = useState(~~initialMode);
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(~~initialMode > 1);

  const { active } = configuration.pushrules;
  let customFont = configuration.font.url;

  const hasAuthStorageCheck = configuration.checkAuthorization && configuration.checkAuthorization.active;
  const sessionStorageKey = configuration.checkAuthorization && configuration.checkAuthorization.sessionStorageKey;
  const searchKey = configuration.checkAuthorization && configuration.checkAuthorization.searchKey;

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

  const toggle = (value) => () => setMode(~~value);

  useEffect(() => {
    if (active)
      setTimeout(() => {
        fetchPushrules();
      }, 300);
  }, [active]);

  useEffect(() => {
    if (hasAuthStorageCheck && !isAuthorized) {
      setMode(0);
      Local.set(Local.names.open, 0);
    }
  }, [hasAuthStorageCheck, isAuthorized]);

  useEffect(() => {
    setOpen(mode > 1);
    Local.set(Local.names.open, Math.max(mode, 1));
  }, [mode]);

  useEffect(() => {
    event('loadChatbox');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c('dydu-application', classes.root)}>
      <Suspense fallback={null}>
        {hasWizard && <Wizard />}
        <DialogProvider>
          <AuthContext>
            <Authenticated>
              <LivechatProvider>
                <Chatbox extended={mode > 2} open={mode > 1} toggle={toggle} mode={mode} />
              </LivechatProvider>
              <Teaser open={mode === 1} toggle={toggle} />
            </Authenticated>
          </AuthContext>
        </DialogProvider>
      </Suspense>
    </div>
  );
}
