import { EventsContext, useEvent } from './EventsContext';
import { Local, Session } from '../tools/storage';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isDefined, isEmptyObject, isOfTypeString } from '../tools/helpers';

import { ConfigurationContext } from './ConfigurationContext';
import Interaction from '../components/Interaction';
import LivechatPayload from '../tools/LivechatPayload';
import PropTypes from 'prop-types';
import dotget from '../tools/dotget';
import fetchPushrules from '../tools/pushrules';
import { knownTemplates } from '../tools/template';
import parseActions from '../tools/actions';
import parseSteps from '../tools/steps';
import useConversationHistory from '../tools/hooks/useConversationHistory';
import usePromiseQueue from '../tools/hooks/usePromiseQueue';
import { useTheme } from 'react-jss';
import useTopKnowledge from '../tools/hooks/useTopKnowledge';
import useViewport from '../tools/hooks/viewport';
import useWelcomeKnowledge from '../tools/hooks/useWelcomeKnowledge';

const isLastElementOfTypeAnimationWriting = (list) => {
  const last = list[list.length - 1];
  return last?.type?.name === Interaction.Writing.name;
};

const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;
const FEEDBACK_RESPONSE = {
  positive: 'positive',
  negative: 'negative',
  noResponseGiven: 'withoutAnswer',
};

const isStartLivechatResponse = (response) => LivechatPayload.is.startLivechat(response);

let isTimeoutRunning = false;
const delayStopAnimationOperatorWriting = (stopAnimationCallback) => {
  if (isTimeoutRunning) return;
  isTimeoutRunning = setTimeout(() => {
    stopAnimationCallback();
    isTimeoutRunning = false;
  }, 5000);
};

export const DialogContext = React.createContext();

export const useDialog = () => useContext(DialogContext);

export function DialogProvider({ children }) {
  const { configuration } = useContext(ConfigurationContext);
  const { active: pushrulesConfigActive } = configuration.pushrules;
  const event = useContext(EventsContext).onEvent('chatbox');
  const { onNewMessage, hasAfterLoadBeenCalled } = useEvent();
  const [disabled, setDisabled] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [locked, setLocked] = useState(false);
  const [placeholder, setPlaceholder] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [secondaryActive, setSecondaryActive] = useState(false);
  const [secondaryContent, setSecondaryContent] = useState(null);
  const [voiceContent, setVoiceContent] = useState(null);
  const [typeResponse, setTypeResponse] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [autoSuggestionActive, setAutoSuggestionActive] = useState(configuration?.suggestions?.limit !== 0);
  const [zoomSrc, setZoomSrc] = useState(null);

  const defaultQualification = sessionStorage.getItem(Session.names.qualification)
    ? sessionStorage.getItem(Session.names.qualification)
    : window.location.href.includes('cdn.doyoudreamup.com') || window.location.href.includes('http://localhost:')
    ? configuration?.application?.qualification
    : false;

  const [qualification, setQualification] = useState(defaultQualification);
  const { result: topList, fetch: fetchTopKnowledge } = useTopKnowledge();
  const { fetch: fetchWelcomeKnowledge, result: welcomeContent } = useWelcomeKnowledge();
  const { fetch: fetchHistory, result: listInteractionHistory } = useConversationHistory();

  const { exec, forceExec } = usePromiseQueue(
    [fetchWelcomeKnowledge, fetchTopKnowledge, fetchHistory],
    hasAfterLoadBeenCalled,
  );
  const [pushrules, setPushrules] = useState(null);

  const theme = useTheme();
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const { transient: secondaryTransient } = configuration.secondary;

  const triggerPushRule = useCallback(() => {
    if (isDefined(pushrules)) return;
    fetchPushrules().then((rules) => {
      setPushrules(rules);
    });
  }, [pushrules]);

  useEffect(() => {
    if (pushrulesConfigActive) triggerPushRule();
  }, [triggerPushRule, pushrulesConfigActive]);

  const add = useCallback(
    (interaction) => {
      onNewMessage();
      setInteractions((previous) => {
        if (isLastElementOfTypeAnimationWriting(previous)) previous.pop();
        return !isDefined(interaction)
          ? previous.slice()
          : [...previous, ...(Array.isArray(interaction) ? interaction : [interaction])];
      });
    },
    [onNewMessage],
  );

  const showAnimationOperatorWriting = useCallback(() => {
    add(<Interaction.Writing />);
    delayStopAnimationOperatorWriting(add);
  }, [add]);

  const displayNotification = useCallback(
    (notification) => {
      if (isDefined(notification)) add(<Interaction.Notification notification={notification} />);
    },
    [add],
  );

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
        templatename: isOfTypeString(interactionAttributeObject?.children)
          ? undefined
          : interactionAttributeObject.templateName,
        askFeedback: isOfTypeString(interactionAttributeObject?.children)
          ? false
          : interactionAttributeObject?.askFeedback,
      };
      return <Interaction key={index} {...props} thinking />;
    });
  }, []);

  const addResponse = useCallback(
    (response) => {
      setLastResponse(response);
      if (isStartLivechatResponse(response)) return displayNotification(response);
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
        enableAutoSuggestion,
      } = response;
      const askFeedback = _askFeedback || feedback === FEEDBACK_RESPONSE.noResponseGiven; // to display the feedback after refresh (with "history" api call)
      const steps = parseSteps(response);
      if (configuration.Voice.enable) {
        if (templateName && configuration.Voice.voiceSpace.toLowerCase() === templateName?.toLowerCase()) {
          setVoiceContent({ templateData, text });
        } else {
          setVoiceContent({ templateData: null, text });
        }
      }
      setAutoSuggestionActive(enableAutoSuggestion);
      setTypeResponse(typeResponse);
      if (secondaryTransient || isMobile) {
        toggleSecondary(false)();
      }
      if (urlRedirect) {
        window.open(urlRedirect, '_self');
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
              typeResponse={typeResponse}
            />
          );
        }
      };

      const interactionsList = verifyInteractionDataType();

      add(interactionsList);

      // eslint-disable-next-line no-use-before-define
    },
    [
      displayNotification,
      configuration.Voice.enable,
      configuration.Voice.voiceSpace,
      secondaryTransient,
      isMobile,
      add,
      toggleSecondary,
      event,
      makeInteractionPropsListWithInteractionChildrenListAndData,
      makeInteractionComponentForEachInteractionPropInList,
    ],
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
    (open, { bodyRenderer, body, height, title, url, width } = {}) =>
      () => {
        const someFieldsDefined = [bodyRenderer, body, height, title, url, width].some((v) => isDefined(v));
        if (someFieldsDefined) {
          setSecondaryContent({ bodyRenderer, body, height, title, url, width });
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

  const isInteractionListEmpty = useMemo(() => interactions?.length === 0, [interactions]);

  useEffect(() => {
    if (isInteractionListEmpty && !welcomeContent) forceExec();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (hasAfterLoadBeenCalled) exec();
    // eslint-disable-next-line
  }, [hasAfterLoadBeenCalled]);

  useEffect(() => {
    if (welcomeContent) {
      addResponse(welcomeContent);
    }

    // eslint-disable-next-line
  }, [welcomeContent]);

  useEffect(() => {
    if (listInteractionHistory.length <= 0) return;

    const welcomeContentHasBeenFetched = isDefined(welcomeContent) && !isEmptyObject(welcomeContent);
    if (!welcomeContentHasBeenFetched) return fetchWelcomeKnowledge();

    const addHistoryInteraction = (hinteraction) => {
      const typedInteraction = addFieldTypeResponse(hinteraction);
      addRequest(typedInteraction.user);
      addResponse(typedInteraction);
    };

    listInteractionHistory.forEach(addHistoryInteraction);
    // eslint-disable-next-line
  }, [welcomeContent, listInteractionHistory]);

  const closeSecondary = useCallback(() => {
    if (secondaryActive) toggleSecondary(false)();
  }, [secondaryActive, toggleSecondary]);

  const openSecondary = useCallback(
    (...props) => {
      if (!secondaryActive) toggleSecondary(...[true].concat(props))();
    },
    [secondaryActive, toggleSecondary],
  );

  return (
    <DialogContext.Provider
      children={children}
      value={{
        closeSecondary,
        openSecondary,
        topList,
        showAnimationOperatorWriting,
        displayNotification,
        lastResponse,
        add,
        addRequest,
        addResponse,
        disabled,
        empty,
        interactions,
        locked,
        placeholder,
        prompt,
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
        zoomSrc,
        setZoomSrc,
        qualification,
        setQualification,
        autoSuggestionActive,
        setAutoSuggestionActive,
        callWelcomeKnowledge: () => null,
      }}
    />
  );
}

DialogProvider.propTypes = {
  children: PropTypes.object,
  toggle: PropTypes.any,
  onPushrulesDataReceived: PropTypes.func,
};

const addFieldTypeResponse = (interaction) => ({
  ...interaction,
  typeResponse: interaction?.type,
});
