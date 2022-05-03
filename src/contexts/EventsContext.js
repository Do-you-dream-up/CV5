import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import dotget from '../tools/dotget';
import { ConfigurationContext } from './ConfigurationContext';
import { isDefined } from '../tools/helpers';

export const useEvent = () => {
  return useContext(EventsContext);
};

const INITIAL_TITLE_TAB = document.title;
const NEW_TITLE_TAB = '1 nouveau message';

const setDocumentTitle = (text) => (document.title = text);
const getDocumentTitle = () => document.title;

const configureMouseListening = (elementDOM, configuration) => {
  const { isMouseIn, setMouseIn } = configuration;

  elementDOM.onmouseleave = () => {
    if (isMouseIn) {
      setMouseIn(false);
    }
  };

  elementDOM.onmouseover = () => {
    if (!isMouseIn) {
      setMouseIn(true);
    }
  };

  elementDOM.onmouseenter = elementDOM.onmouseover;
};

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
  const { configuration } = useContext(ConfigurationContext);
  const { active, features = {}, verbosity = 0 } = configuration.events;

  const [event, setEvent] = useState();
  const [isMouseIn, setMouseIn] = useState(false);

  useEffect(() => {
    if (isMouseIn) stopBlink();
  }, [isMouseIn]);

  const onChatboxLoaded = useCallback(
    (chatboxNodeElement) => {
      configureMouseListening(chatboxNodeElement, { isMouseIn, setMouseIn });
    },
    [isMouseIn],
  );

  const onNewMessage = useCallback(() => {
    if (isMouseIn) {
      stopBlink();
    } else {
      blink();
    }
  }, [isMouseIn]);

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
        onChatboxLoaded,
        onNewMessage,
        onEvent,
        event,
      }}
    />
  );
}

EventsProvider.propTypes = {
  children: PropTypes.node,
};
