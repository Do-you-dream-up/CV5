import c from 'classnames';
import qs from 'qs';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { AuthContext, Authenticated } from '../../contexts/AuthContext';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsContext } from '../../contexts/EventsContext';
import { findValueByKey } from '../../tools/findValueByKey';
import { parseString } from '../../tools/parseString';
import { Local } from '../../tools/storage';
import Teaser from '../Teaser';
import useStyles from './styles';
// eslint-disable-next-line import/no-unresolved
import '../../../public/override/style.css';

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
  const hasWizard =
    qs.parse(window.location.search, { ignoreQueryPrefix: true }).wizard !==
    undefined;
  const initialMode = Local.get(
    Local.names.open,
    ~~configuration.application.open,
  );
  const [mode, setMode] = useState(~~initialMode);
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(~~initialMode > 1);

  let customFont = configuration.font.url;
  const oidcEnabled = configuration.oidc ? configuration.oidc.enable : false;
  const {
    active: hasAuthStorageCheck,
    sessionStorageKey,
    searchKey,
  } = configuration.checkAuthorization;

  // get the session storage value based on the sessionStorageKey
  const sessionStorageValue = parseString(
    sessionStorage.getItem(sessionStorageKey),
  );
  // if the session storage value is a deep nested object, check for the searchKey
  const sessionToken =
    sessionStorageValue && typeof sessionStorageValue === 'object'
      ? findValueByKey(sessionStorageValue, searchKey)
      : sessionStorageValue;
  const isAuthorized =
    sessionToken && !!sessionToken.length && !!sessionToken[0];

  if (
    customFont &&
    document.getElementById('font') &&
    customFont !== document.getElementById('font').href
  ) {
    document.getElementById('font').href = customFont;
  }

  const toggle = (value) => () => setMode(~~value);

  useEffect(() => {
    if (hasAuthStorageCheck && !isAuthorized) {
      setMode(0);
      Local.set(Local.names.open, 0);
    } else {
      setOpen(mode > 1);
      setMode(Math.max(mode, 1));
      Local.set(Local.names.open, Math.max(mode, 1));
    }
  }, [hasAuthStorageCheck, mode, isAuthorized]);

  useEffect(() => {
    event('loadChatbox');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c('dydu-application', classes.root)}>
      {hasWizard && <Suspense children={<Wizard />} fallback={null} />}
      <DialogProvider>
        <>
          <Suspense fallback={null}>
            {oidcEnabled ? (
              <AuthContext>
                <Authenticated>
                  <Chatbox
                    extended={mode > 2}
                    open={mode > 1}
                    toggle={toggle}
                    mode={mode}
                  />
                </Authenticated>
              </AuthContext>
            ) : (
              <Chatbox
                extended={mode > 2}
                open={mode > 1}
                toggle={toggle}
                mode={mode}
              />
            )}
          </Suspense>
          <Teaser open={mode === 1} toggle={toggle} />
        </>
      </DialogProvider>
    </div>
  );
}
