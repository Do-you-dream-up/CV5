/* eslint-disable react-hooks/rules-of-hooks */
// eslint-disable-next-line import/no-unresolved

import '../../../public/override/style.css';
import '../../../public/chatboxHomepage.css';

import React, { Suspense, useContext, useEffect } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsContext } from '../../contexts/EventsContext';
import { LivechatProvider } from '../../contexts/LivechatContext';
import SurveyProvider from '../../Survey/SurveyProvider';
import Teaser from '../Teaser';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { hasWizard } from '../../tools/wizard';
import useStyles from './styles';
import { useViewMode } from '../../contexts/ViewModeProvider';

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
 * Optionally render the Wizard when the `dydupanel` URL parameter is found.
 */
export default function Application() {
  const { configuration } = useContext(ConfigurationContext);

  const {
    mode,
    popin: popinChatbox,
    isOpen: isChatboxOpen,
    isFull: isChatboxFullScreen,
    isMinimize: isChatboxMinimize,
    toggle,
  } = useViewMode();

  const event = useContext(EventsContext).onEvent('chatbox');
  const classes = useStyles({ configuration });

  let customFont = configuration.font.url;

  if (customFont && document.getElementById('font') && customFont !== document.getElementById('font').href) {
    document.getElementById('font').href = customFont;
  }

  useEffect(() => {
    event('loadChatbox');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c('dydu-application', classes.root)}>
      <Suspense fallback={null}>
        {hasWizard() && <Wizard />}

        <DialogProvider onPushrulesDataReceived={popinChatbox}>
          <SurveyProvider api={dydu}>
            <LivechatProvider>
              <Chatbox extended={isChatboxFullScreen} open={isChatboxOpen} toggle={toggle} mode={mode} />
            </LivechatProvider>
          </SurveyProvider>
          <Teaser open={isChatboxMinimize} toggle={toggle} />
        </DialogProvider>
      </Suspense>
    </div>
  );
}
