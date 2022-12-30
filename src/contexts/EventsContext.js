import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';

import { CHATBOX_EVENT_NAME } from '../tools/constants';
import { useConfiguration } from './ConfigurationContext';
import PropTypes from 'prop-types';
import VisitManager from '../tools/RG/VisitManager';
import dotget from '../tools/dotget';
import { eventNewMessage } from '../events/chatboxIndex';
import useServerStatus from '../tools/hooks/useServerStatus';
import { useViewMode } from './ViewModeProvider';

let chatboxRef = null;
const saveChatboxRef = (ref) => (chatboxRef = ref);

export const useEvent = () => {
  return useContext(EventsContext);
};

const INITIAL_TITLE_TAB = document.title;
const NEW_TITLE_TAB = '1 nouveau message';

const setDocumentTitle = (text) => (document.title = text);
const getDocumentTitle = () => document.title;
const execDyduAfterLoad = () =>
  new Promise((resolve) => {
    const _fnAfterLoad = window?.dyduAfterLoad;
    if (isDefined(_fnAfterLoad) && isOfTypeFunction(_fnAfterLoad())) _fnAfterLoad();
    resolve(true);
  });

const stopBlink = () => {
  if (!isBlinking()) {
    return;
  }

  setDocumentTitle(INITIAL_TITLE_TAB);
  clearInterval(refBlinkInterval);
  refBlinkInterval = null;
};

const isBlinking = () => isDefined(refBlinkInterval);

const blink = () => {
  if (isBlinking()) {
    return;
  }

  refBlinkInterval = setInterval(() => {
    document.title = getDocumentTitle() === NEW_TITLE_TAB ? INITIAL_TITLE_TAB : NEW_TITLE_TAB;
  }, 1000);
};

export const EventsContext = React.createContext();

let refBlinkInterval = null;

export function EventsProvider({ children }) {
  const { isOpen } = useViewMode();
  const { configuration } = useConfiguration();
  const { active, features = {}, verbosity = 0 } = configuration.events;

  const [event, setEvent] = useState();
  const [isMouseIn, setMouseIn] = useState(false);
  const [afterLoadCalled, setAfterLoadCalled] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [chatboxLoaded, setChatboxLoaded] = useState(false);
  const { result: serverStatus } = useServerStatus();

  useEffect(() => {
    if (isMouseIn) stopBlink();
  }, [isMouseIn]);

  const hasAfterLoadBeenCalled = useMemo(() => afterLoadCalled === true, [afterLoadCalled]);

  const processUserVisit = useCallback(async () => {
    if (serverStatus) {
      await VisitManager.refreshRegisterVisit();
    }
  }, [serverStatus]);

  const processDyduAfterLoad = useCallback(() => {
    if (!hasAfterLoadBeenCalled) execDyduAfterLoad().then(setAfterLoadCalled);
  }, [hasAfterLoadBeenCalled]);

  const isChatboxLoadedAndReady = useMemo(() => chatboxLoaded && isAppReady, [chatboxLoaded, isAppReady]);

  useEffect(() => {
    if (!isChatboxLoadedAndReady) return;
    const bootstrapAfterLoadAndReadyFnList = [processDyduAfterLoad, processUserVisit];
    bootstrapAfterLoadAndReadyFnList.forEach((fn) => fn());
  }, [isChatboxLoadedAndReady]);

  const onAppReady = useCallback(() => setIsAppReady(true), []);

  const handleEventNewMessage = useCallback(() => {
    if (!isMouseIn) return blink();
    else stopBlink();
  }, [isMouseIn]);

  const onChatboxLoaded = useCallback(
    (chatboxNodeElement) => {
      saveChatboxRef(chatboxNodeElement);
      chatboxNodeElement.addEventListener(CHATBOX_EVENT_NAME.newMessage, handleEventNewMessage);
      chatboxNodeElement.onmousemove = () => setMouseIn(true);
      chatboxNodeElement.onmouseleave = () => setMouseIn(false);
      chatboxNodeElement.onmouseover = () => setMouseIn(true);
      chatboxNodeElement.onmouseenter = chatboxNodeElement.onmouseover;
      setChatboxLoaded(true);
    },
    [handleEventNewMessage],
  );

  const onNewMessage = useCallback(() => {
    isOpen && chatboxRef && chatboxRef.dispatchEvent(eventNewMessage);
  }, [isOpen]);

  const onEvent =
    (feature) =>
    (event, ...rest) => {
      setEvent(`${feature}/${event}`);
      if (active) {
        const actions = (features[feature] || {})[event];
        if (Array.isArray(actions)) {
          actions.forEach((action) => {
            if (verbosity > 1) {
              console.info(`[Dydu][${feature}:${event}] '${action}' ${rest}`);
            }
            const f = dotget(window, action);
            if (typeof f === 'function') {
              f(...rest);
            } else if (verbosity > 0) {
              console.warn(`[Dydu] Action '${action}' was not found in 'window' object.`);
            }
          });
        }
      }
    };

  return (
    <EventsContext.Provider
      children={children}
      value={{
        isChatboxLoadedAndReady,
        hasAfterLoadBeenCalled,
        onAppReady,
        onChatboxLoaded,
        onNewMessage,
        onEvent,
        event,
        getChatboxRef: () => chatboxRef,
      }}
    />
  );
}

EventsProvider.propTypes = {
  children: PropTypes.node,
};
