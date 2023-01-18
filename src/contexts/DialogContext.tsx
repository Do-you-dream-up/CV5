import * as Constants from '../tools/constants';

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isDefined, isOfTypeString } from '../tools/helpers';

import Interaction from '../components/Interaction';
import LivechatPayload from '../tools/LivechatPayload';
import { Local } from '../tools/storage';
import dotget from '../tools/dotget';
import { eventOnSecondaryClosed } from '../events/chatboxIndex';
import fetchPushrules from '../tools/pushrules';
import { flattenSteps } from '../tools/steps';
import { knownTemplates } from '../tools/template';
import parseActions from '../tools/actions';
import { useConfiguration } from './ConfigurationContext';
import useConversationHistory from '../tools/hooks/useConversationHistory';
import { useEvent } from './EventsContext';
import usePromiseQueue from '../tools/hooks/usePromiseQueue';
import useServerStatus from '../tools/hooks/useServerStatus';
import useTopKnowledge from '../tools/hooks/useTopKnowledge';
import useViewport from '../tools/hooks/useViewport';
import useWelcomeKnowledge from '../tools/hooks/useWelcomeKnowledge';

interface DialogProviderProps {
  children: ReactNode;
}

interface DialogContextProps {
  closeSecondary?: () => void;
  openSecondary?: (props: any) => void;
  topList?: any[];
  showAnimationOperatorWriting?: () => void;
  displayNotification?: (notification: any) => void;
  lastResponse?: Servlet.ChatResponseValues | null;
  add?: (interaction: Servlet.ChatResponse) => void;
  addRequest?: (str: string) => void;
  addResponse?: (response: Servlet.ChatResponseValues) => void;
  disabled?: boolean;
  empty?: () => void;
  errorFormatMessage?: string | null;
  interactions?: any;
  isFileActive?: boolean;
  locked?: boolean;
  placeholder?: string | null;
  prompt?: string;
  secondaryActive?: boolean;
  secondaryContent?: any;
  selectedFile?: File;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
  setErrorFormatMessage?: Dispatch<SetStateAction<string>>;
  setIsFileActive?: Dispatch<SetStateAction<boolean>>;
  setLocked?: Dispatch<SetStateAction<boolean>>;
  setPlaceholder?: Dispatch<SetStateAction<any>>;
  setPrompt?: Dispatch<SetStateAction<string>>;
  setSecondary?: () => void;
  setSelectedFile?: Dispatch<SetStateAction<File>>;
  setUploadActive?: Dispatch<SetStateAction<boolean>>;
  setVoiceContent?: Dispatch<SetStateAction<any>>;
  toggleSecondary?: Dispatch<SetStateAction<any>>;
  typeResponse?: Servlet.ChatResponseType | null;
  uploadActive?: boolean;
  voiceContent?: any;
  zoomSrc?: string | null;
  setZoomSrc?: Dispatch<SetStateAction<string | null>>;
  autoSuggestionActive?: boolean;
  setAutoSuggestionActive?: Dispatch<SetStateAction<boolean>>;
  callWelcomeKnowledge?: () => null;
}

interface SecondaryContentProps {
  headerTransparency?: boolean;
  headerRenderer?: any;
  bodyRenderer?: any;
  body?: any;
  title?: string;
  url?: string;
  height?: number;
  width?: number;
}

interface InteractionProps {
  askFeedback: boolean;
  carousel: boolean;
  children: any;
  secondary: any;
  steps: [];
  templateName?: string;
  type?: string;
}

export const DialogContext = createContext<DialogContextProps>({});

export const useDialog = () => useContext(DialogContext);

export function DialogProvider({ children }: DialogProviderProps) {
  const { configuration } = useConfiguration();
  const suggestionActiveOnConfig = configuration?.suggestions?.limit !== 0;
  const secondaryTransient = configuration?.secondary?.transient;

  const { onNewMessage, getChatboxRef, hasAfterLoadBeenCalled, dispatchEvent } = useEvent();

  const { result: topList, fetch: fetchTopKnowledge } = useTopKnowledge();
  const { fetch: fetchWelcomeKnowledge, result: welcomeContent } = useWelcomeKnowledge();
  const { fetch: fetchHistory, result: listInteractionHistory } = useConversationHistory();
  const { fetch: fetchServerStatus, checked: serverStatusChecked } = useServerStatus();

  const { isMobile } = useViewport();

  const [uploadActive, setUploadActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileActive, setIsFileActive] = useState(false);
  const [errorFormatMessage, setErrorFormatMessage] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [interactions, setInteractions] = useState<ReactNode[]>([]);
  const [locked, setLocked] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [secondaryActive, setSecondaryActive] = useState(false);
  const [secondaryContent, setSecondaryContent] = useState<SecondaryContentProps | null>(null);
  const [voiceContent, setVoiceContent] = useState<{ templateData?: string | null; text?: string } | null>(null);
  const [typeResponse, setTypeResponse] = useState<Servlet.ChatResponseType | null | undefined>(null);
  const [lastResponse, setLastResponse] = useState<Servlet.ChatResponseValues | null>(null);
  const [autoSuggestionActive, setAutoSuggestionActive] = useState<boolean>(suggestionActiveOnConfig);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [pushrules, setPushrules] = useState(null);

  const { exec, forceExec } = usePromiseQueue(
    [fetchWelcomeKnowledge, fetchTopKnowledge, fetchHistory],
    hasAfterLoadBeenCalled && serverStatusChecked,
  );

  useEffect(() => {
    fetchServerStatus();
  }, []);

  const isLastElementOfTypeAnimationWriting = (list) => {
    const last = list[list.length - 1];
    return last?.type?.name === Interaction.Writing.name;
  };

  const isStartLivechatResponse = (response) => LivechatPayload.is.startLivechat(response);

  let isTimeoutRunning: any = false;
  const delayStopAnimationOperatorWriting = (stopAnimationCallback) => {
    if (isTimeoutRunning) return;
    isTimeoutRunning = setTimeout(() => {
      stopAnimationCallback();
      isTimeoutRunning = false;
    }, 5000);
  };

  const triggerPushRule = useCallback(() => {
    if (isDefined(pushrules)) return;
    if (!hasAfterLoadBeenCalled && !serverStatusChecked) return;
    fetchPushrules().then((rules) => {
      rules && setPushrules(rules);
    });
  }, [pushrules, hasAfterLoadBeenCalled, serverStatusChecked]);

  useEffect(() => {
    const canTriggerPushRules = configuration?.pushrules.active && !isDefined(pushrules);
    if (canTriggerPushRules && hasAfterLoadBeenCalled && serverStatusChecked) triggerPushRule();
  }, [triggerPushRule, configuration?.pushrules.active, hasAfterLoadBeenCalled, serverStatusChecked]);

  const toggleSecondary = useCallback(
    (
        open,
        {
          headerTransparency = true,
          headerRenderer,
          bodyRenderer,
          body,
          height,
          title,
          url,
          width,
        }: SecondaryContentProps = {},
      ) =>
      () => {
        const someFieldsDefined = [
          headerTransparency,
          headerRenderer,
          bodyRenderer,
          body,
          height,
          title,
          url,
          width,
        ].some((v) => isDefined(v));
        if (someFieldsDefined) {
          setSecondaryContent({ headerTransparency, headerRenderer, bodyRenderer, body, height, title, url, width });
        }
        setSecondaryActive((previous) => {
          return open === undefined ? !previous : open;
        });
      },
    [],
  );

  const isInteractionListEmpty = useMemo(() => interactions?.length === 0, [interactions]);

  const add = useCallback(
    (interaction) => {
      onNewMessage && onNewMessage();
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
    },
    [add, isMobile, secondaryTransient, toggleSecondary],
  );

  const makeInteractionPropsListWithInteractionChildrenListAndData = useCallback((childrenList, data) => {
    return childrenList.map((child) => ({
      children: child,
      ...data,
    }));
  }, []);

  const makeInteractionComponentForEachInteractionPropInList = useCallback((propsList: InteractionProps[] = []) => {
    return propsList.map((interactionAttributeObject, index) => {
      const props = {
        type: 'response',
        ...interactionAttributeObject,
        templateName: isOfTypeString(interactionAttributeObject?.children)
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
    (response: Servlet.ChatResponseValues = {}) => {
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

      const askFeedback = _askFeedback || feedback === Constants.FEEDBACK_RESPONSE.noResponseGiven; // to display the feedback after refresh (with "history" api call)

      const steps = flattenSteps(response);

      if (configuration?.Voice.enable) {
        if (templateName && configuration.Voice.voiceSpace.toLowerCase() === templateName?.toLowerCase()) {
          setVoiceContent({ templateData, text });
        } else {
          setVoiceContent({ templateData: null, text });
        }
      }

      if (suggestionActiveOnConfig) {
        setAutoSuggestionActive(enableAutoSuggestion ?? suggestionActiveOnConfig);
      }

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
        } else if (guiAction.match('^javascript:')) {
          // temporary solution which uses the dangerous eval() to eval guiaction code
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

      if (typeResponse && typeResponse.match(Constants.RE_REWORD)) {
        dispatchEvent && dispatchEvent('chatbox', 'rewordDisplay');
      }

      const getContent = (text: any, templateData: any, templateName: any) => {
        const list: any[] = [].concat(text ? steps.map(({ text }) => text) : [text]);
        if (templateData && knownTemplates.includes(templateName)) {
          try {
            list.push(JSON.parse(templateData));
          } catch (error) {
            console.log('Error', error);
          }
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
            steps,
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
              templateName={templateName}
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
      configuration?.Voice.enable,
      configuration?.Voice.voiceSpace,
      secondaryTransient,
      isMobile,
      add,
      toggleSecondary,
      dispatchEvent,
      makeInteractionPropsListWithInteractionChildrenListAndData,
      makeInteractionComponentForEachInteractionPropInList,
    ],
  );

  const empty = useCallback(() => {
    setInteractions([]);
  }, []);

  const setSecondary = useCallback(({ body, title, url }: SecondaryContentProps = {}) => {
    if (body || title || url) {
      setSecondaryContent({ body, title, url });
    }
  }, []);

  useEffect(() => {
    Local.secondary.save(secondaryActive);
  }, [secondaryActive]);

  const addHistoryInteraction = (interaction) => {
    const typedInteraction = {
      ...interaction,
      typeResponse: interaction?.type,
    };

    addRequest(typedInteraction.user);
    addResponse(typedInteraction);
  };

  useEffect(() => {
    if (hasAfterLoadBeenCalled) exec();
  }, [hasAfterLoadBeenCalled]);

  useEffect(() => {
    if (isInteractionListEmpty && !welcomeContent) forceExec();
  }, []);

  useEffect(() => {
    welcomeContent && addResponse(welcomeContent);
  }, [welcomeContent]);

  useEffect(() => {
    welcomeContent && listInteractionHistory.forEach(addHistoryInteraction);
  }, [welcomeContent, listInteractionHistory]);

  const chatboxNode: any = useMemo(() => {
    try {
      return getChatboxRef && getChatboxRef();
    } catch (e) {
      return null;
    }
  }, [getChatboxRef]);

  const closeSecondary = useCallback(() => {
    toggleSecondary(false)();
    if (isDefined(chatboxNode))
      try {
        chatboxNode.dispatchEvent(eventOnSecondaryClosed);
      } catch (e) {
        // mute multiple call of dispatchEvent error
      }
  }, [toggleSecondary, chatboxNode]);

  const openSecondary = useCallback(
    (props) => {
      if (!secondaryActive) toggleSecondary(true, props)();
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
        autoSuggestionActive,
        setAutoSuggestionActive,
        callWelcomeKnowledge: () => null,
      }}
    />
  );
}
