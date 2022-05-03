import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';
import { useTheme } from 'react-jss';
import Interaction from '../components/Interaction';
import parseActions from '../tools/actions';
import dotget from '../tools/dotget';
import useViewport from '../tools/hooks/viewport';
import parseSteps from '../tools/steps';
import { Local } from '../tools/storage';
import { knownTemplates } from '../tools/template';
import { ConfigurationContext } from './ConfigurationContext';
import { EventsContext, useEvent } from './EventsContext';

const isOfTypeString = (v) => typeof v === 'string';

const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;
const FEEDBACK_RESPONSE = {
  positive: 'positive',
  negative: 'negative',
  noResponseGiven: 'withoutAnswer',
};

export const DialogContext = React.createContext();

export const useDialog = () => useContext(DialogContext);

export function DialogProvider({ children }) {
  const { configuration } = useContext(ConfigurationContext);
  const event = useContext(EventsContext).onEvent('chatbox');
  const { onNewMessage } = useEvent();
  const [disabled, setDisabled] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [placeholder, setPlaceholder] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [secondaryActive, setSecondaryActive] = useState(false);
  const [secondaryContent, setSecondaryContent] = useState(null);
  const [voiceContent, setVoiceContent] = useState(null);
  const [typeResponse, setTypeResponse] = useState(null);
  const [statusText, setStatusText] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  const theme = useTheme();
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const { transient: secondaryTransient } = configuration.secondary;

  const flushStatusText = useCallback(() => setStatusText(null), []);

  const add = useCallback((interaction) => {
    setInteractions((previous) => [...previous, ...(Array.isArray(interaction) ? interaction : [interaction])]);
  }, []);

  const addRequest = useCallback(
    (text) => {
      if (text) {
        if (secondaryTransient || isMobile) {
          toggleSecondary(false)();
        }
        add(<Interaction children={text} type="request" />);
        setPlaceholder(null);
        setLocked(false);
      }
      // eslint-disable-next-line no-use-before-define
    },
    [add, isMobile, secondaryTransient, toggleSecondary],
  );

  const makeInteractionPropsListWithInteractionChildrenListAndData = useCallback((childrenList, data) => {
    return childrenList.map((child) => ({
      children: child,
      ...data,
    }));
  }, []);

  const makeInteractionComponentForEachInteractionPropInList = useCallback((propsList = []) => {
    return propsList.map((interactionAttributeObject, index) => {
      const props = {
        type: 'response',
        ...interactionAttributeObject,
        templatename: isOfTypeString(interactionAttributeObject.children)
          ? undefined
          : interactionAttributeObject.templateName,
        askFeedback: isOfTypeString(interactionAttributeObject.children)
          ? false
          : interactionAttributeObject.askFeedback,
      };
      return <Interaction key={index} {...props} thinking />;
    });
  }, []);

  const createResponseOrRequestWithInteractionFromHistory = useCallback((interactionFromHistory) => {
    return {
      ...interactionFromHistory,
      typeResponse: interactionFromHistory.type,
    };
  }, []);

  const addResponse = useCallback(
    (response) => {
      setLastResponse(response);
      onNewMessage(response);
      const {
        askFeedback: _askFeedback,
        feedback,
        guiAction,
        sidebar,
        templateData,
        templateName,
        text,
        typeResponse,
        urlRedirect,
      } = response;
      const askFeedback = _askFeedback || feedback === FEEDBACK_RESPONSE.noResponseGiven; // to display the feedback after refresh (with "history" api call)
      const steps = parseSteps(response);
      if (configuration.Voice.enable) {
        if (templateName && configuration.Voice.voiceSpace.toLowerCase() === templateName.toLowerCase()) {
          setVoiceContent({ templateData, text });
        } else {
          setVoiceContent({ templateData: null, text });
        }
      }
      setTypeResponse(typeResponse);
      if (secondaryTransient || isMobile) {
        toggleSecondary(false)();
      }
      if (urlRedirect) {
        window.open(urlRedirect, '_blank');
      }

      if (guiAction) {
        // check for the dydu functions in the window object
        if (guiAction.match('^javascript:dydu')) {
          parseActions(guiAction).forEach(({ action, parameters }) => {
            const f = dotget(window, action);
            if (typeof f === 'function') {
              f(...parameters);
            } else {
              console.warn(`[Dydu] Action '${action}' was not found in 'window' object.`);
            }
          });
        }
        // temporary solution which uses the dangerous eval() to eval guiaction code
        else if (guiAction.match('^javascript:')) {
          const guiActionCode = guiAction.substr(11);
          eval(
            'try{' +
              guiActionCode +
              '}catch(e) {' +
              "console.error('Error in Normal GUI action " +
              guiActionCode.replace(/'/g, "\\'") +
              "');}",
          );
        }
      }

      if (typeResponse && typeResponse.match(RE_REWORD)) {
        event('rewordDisplay');
      }

      const getContent = (text, templateData, templateName) => {
        const list = [].concat(text ? steps.map(({ text }) => text) : [text]);
        if (templateData && knownTemplates.includes(templateName)) {
          list.push(JSON.parse(templateData));
        }
        return list;
      };

      const interactionChildrenList = getContent(text, templateData, templateName);

      const verifyInteractionDataType = () => {
        if (templateName === 'dydu_carousel_001' || templateName === 'dydu_product_001') {
          const interactionData = {
            askFeedback,
            carousel: steps.length > 1,
            type: 'response',
            secondary: sidebar,
            steps: steps,
            templateName,
          };
          const interactionPropsList = makeInteractionPropsListWithInteractionChildrenListAndData(
            interactionChildrenList,
            interactionData,
          );
          return makeInteractionComponentForEachInteractionPropInList(interactionPropsList);
        } else {
          return (
            <Interaction
              askFeedback={askFeedback}
              carousel={steps.length > 1}
              children={getContent(text, templateData, templateName)}
              type="response"
              secondary={sidebar}
              steps={steps}
              templatename={templateName}
              thinking
            />
          );
        }
      };

      const interactionsList = verifyInteractionDataType();

      add(interactionsList);

      // eslint-disable-next-line no-use-before-define
    },
    [
      add,
      onNewMessage,
      event,
      isMobile,
      secondaryTransient,
      makeInteractionPropsListWithInteractionChildrenListAndData,
      makeInteractionComponentForEachInteractionPropInList,
      toggleSecondary,
    ],
  );

  const rebuildInteractionsListFromHistory = useCallback(
    (interactionsListFromHistory) => {
      interactionsListFromHistory.forEach((interactionFromHistory) => {
        const responseOrRequestWithInteractionFromHistory =
          createResponseOrRequestWithInteractionFromHistory(interactionFromHistory);
        addRequest(responseOrRequestWithInteractionFromHistory.user);
        addResponse(responseOrRequestWithInteractionFromHistory);
      });
      return interactions;
    },
    [addRequest, addResponse, createResponseOrRequestWithInteractionFromHistory, interactions],
  );

  const empty = useCallback(() => {
    setInteractions([]);
  }, []);

  const setSecondary = useCallback(({ body, title, url } = {}) => {
    if (body || title || url) {
      setSecondaryContent({ body, title, url });
    }
  }, []);

  const toggleSecondary = useCallback(
    (open, { body, height, title, url, width } = {}) =>
      () => {
        if (body !== undefined || title !== undefined || url !== undefined) {
          setSecondaryContent({ body, height, title, url, width });
        }
        setSecondaryActive((previous) => {
          const should = open === undefined ? !previous : open;
          if (Local.get(Local.names.secondary) !== should) {
            Local.set(Local.names.secondary, should);
          }
          return should;
        });
      },
    [],
  );

  return (
    <DialogContext.Provider
      children={children}
      value={{
        flushStatusText,
        lastResponse,
        statusText,
        setStatusText,
        add,
        addRequest,
        addResponse,
        disabled,
        empty,
        interactions,
        locked,
        placeholder,
        prompt,
        rebuildInteractionsListFromHistory,
        secondaryActive,
        secondaryContent,
        setDisabled,
        setLocked,
        setPlaceholder,
        setPrompt,
        setSecondary,
        setVoiceContent,
        toggleSecondary,
        typeResponse,
        voiceContent,
      }}
    />
  );
}

DialogProvider.propTypes = {
  children: PropTypes.object,
};
