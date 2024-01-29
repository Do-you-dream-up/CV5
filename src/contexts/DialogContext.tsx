import * as Constants from '../tools/constants';

import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isDefined, isOfTypeString, recursiveBase64DecodeString } from '../tools/helpers';

import FileUploadButton from '../components/FileUploadButton/FileUploadButton';
import Interaction from '../components/Interaction';
import LivechatPayload from '../tools/LivechatPayload';
import { Local } from '../tools/storage';
import dotget from '../tools/dotget';
import { eventOnSidebarClosed } from '../events/chatboxIndex';
import { flattenSteps } from '../tools/steps';
import { knownTemplates } from '../tools/template';
import parseActions from '../tools/actions';
import { useBotInfo } from './BotInfoContext';
import { useConfiguration } from './ConfigurationContext';
import { useConversationHistory } from './ConversationHistoryContext';
import { useEvent } from './EventsContext';
import usePromiseQueue from '../tools/hooks/usePromiseQueue';
import usePushrules from '../tools/hooks/usePushrules';
import { useSaml } from './SamlContext';
import { useServerStatus } from './ServerStatusContext';
import { useTopKnowledge } from './TopKnowledgeContext';
import useViewport from '../tools/hooks/useViewport';
import useVisitManager from '../tools/hooks/useVisitManager';
import { useWelcomeKnowledge } from './WelcomeKnowledgeContext';

interface DialogProviderProps {
  children: ReactNode;
}

export interface DialogContextProps {
  closeSidebar?: () => void;
  openSidebar?: (props: any) => void;
  showAnimationOperatorWriting?: () => void;
  displayNotification?: (notification: any) => void;
  extractTextWithRegex?: (inputString: string) => string | null;
  lastResponse?: Servlet.ChatResponseValues | null;
  add?: (interaction: Servlet.ChatResponse) => void;
  addRequest?: (str: string) => void;
  addResponse?: (response: Servlet.ChatResponseValues) => void;
  disabled?: boolean;
  clearInteractions?: () => void;
  errorFormatMessage?: string | null;
  interactions?: any;
  isFileActive?: boolean;
  locked?: boolean;
  placeholder?: string | null;
  prompt?: string;
  sidebarActive?: boolean;
  sidebarContent?: any;
  selectedFile?: any;
  rewordAfterGuiAction?: string;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
  setErrorFormatMessage?: Dispatch<SetStateAction<string | null>>;
  setIsFileActive?: Dispatch<SetStateAction<boolean>>;
  setLocked?: Dispatch<SetStateAction<boolean>>;
  setPlaceholder?: Dispatch<SetStateAction<any>>;
  setPrompt?: Dispatch<SetStateAction<string>>;
  setSidebar?: () => void;
  setSelectedFile?: Dispatch<SetStateAction<File>>;
  setUploadActive?: Dispatch<SetStateAction<boolean>>;
  setVoiceContent?: Dispatch<SetStateAction<any>>;
  toggleSidebar?: (open: boolean, props?: any) => any;
  typeResponse?: Servlet.ChatResponseType | null;
  uploadActive?: boolean;
  voiceContent?: any;
  zoomSrc?: string | null;
  setZoomSrc?: Dispatch<SetStateAction<string | null>>;
  autoSuggestionActive?: boolean;
  setAutoSuggestionActive?: Dispatch<SetStateAction<boolean>>;
  showUploadFileButton?: () => void;
  isWaitingForResponse?: boolean;
  setIsWaitingForResponse?: Dispatch<SetStateAction<boolean>>;
  setRewordAfterGuiAction?: Dispatch<SetStateAction<string>>;
}

interface SidebarContentProps {
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
  sidebar: any;
  steps: [];
  templateName?: string;
  type?: string;
}

export const DialogContext = createContext<DialogContextProps>({});

export const useDialog = () => useContext(DialogContext);

export function extractParameterFromGuiAction(inputString: string) {
  const regex = /javascript:dydu\w*\('([^']*)'\)/;
  const match = inputString.match(regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

export function DialogProvider({ children }: DialogProviderProps) {
  const { configuration } = useConfiguration();
  const suggestionActiveOnConfig = configuration?.suggestions?.limit !== 0;
  const sidebarTransient = configuration?.sidebar?.transient;

  const { getChatboxRef, hasAfterLoadBeenCalled, dispatchEvent } = useEvent();

  const { fetch: fetchServerStatus, checked: serverStatusChecked } = useServerStatus();
  const { fetchBotLanguages, botLanguages } = useBotInfo();

  const { fetch: fetchTopKnowledge } = useTopKnowledge();
  const { fetchWelcomeKnowledge, welcomeKnowledge } = useWelcomeKnowledge();
  const { fetch: fetchPushrules, pushrules } = usePushrules();
  const { fetch: fetchHistory, history: listInteractionHistory } = useConversationHistory();
  const { fetch: fetchVisitorRegistration } = useVisitManager();
  const { connected: saml2Connected } = useSaml();
  const additionalListInteraction = useRef([]);
  const { isMobile } = useViewport();

  const [disabled, setDisabled] = useState(false);
  const [interactions, setInteractions] = useState<ReactElement[]>([]);
  const [locked, setLocked] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<SidebarContentProps | null>(null);
  const [voiceContent, setVoiceContent] = useState<{ templateData?: string | null; text?: string } | null>(null);
  const [typeResponse, setTypeResponse] = useState<Servlet.ChatResponseType | null | undefined>(null);
  const [lastResponse, setLastResponse] = useState<Servlet.ChatResponseValues | null>(null);
  const [autoSuggestionActive, setAutoSuggestionActive] = useState<boolean>(suggestionActiveOnConfig);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState<boolean>(false);
  const [rewordAfterGuiAction, setRewordAfterGuiAction] = useState<string>('');

  useEffect(() => {
    fetchServerStatus();
  }, []);

  useEffect(() => {
    serverStatusChecked && fetchBotLanguages();
  }, [serverStatusChecked]);

  const { exec, forceExec } = usePromiseQueue(
    [fetchVisitorRegistration, fetchWelcomeKnowledge, fetchHistory, fetchTopKnowledge],
    hasAfterLoadBeenCalled && serverStatusChecked && botLanguages,
  );

  const addAdditionalInteraction = (interaction) => {
    additionalListInteraction.current = additionalListInteraction.current.concat(interaction);
  };

  const clearAdditionalInteraction = () => {
    additionalListInteraction.current = [];
  };

  const getAdditionalInteraction = () => {
    return additionalListInteraction.current;
  };

  const showUploadFileButton = useCallback(() => {
    addAdditionalInteraction(<FileUploadButton />);
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

  const canTriggerPushRules = useMemo(() => {
    return configuration?.pushrules.active && !isDefined(pushrules);
  }, [configuration, pushrules]);

  const shouldTriggerPushRules = useMemo(() => {
    return canTriggerPushRules && hasAfterLoadBeenCalled && serverStatusChecked && welcomeKnowledge;
  }, [canTriggerPushRules, hasAfterLoadBeenCalled, serverStatusChecked, welcomeKnowledge]);

  useEffect(() => {
    if (shouldTriggerPushRules) {
      fetchPushrules && fetchPushrules();
    }
  }, [fetchPushrules, shouldTriggerPushRules]);

  const toggleSidebar = useCallback(
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
        }: SidebarContentProps = {},
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
          setSidebarContent({ headerTransparency, headerRenderer, bodyRenderer, body, height, title, url, width });
        }
        setSidebarActive((previous) => {
          return open === undefined ? !previous : open;
        });
      },
    [],
  );

  const isInteractionListEmpty = useMemo(() => interactions?.length === 0, [interactions]);

  const add = useCallback((interaction) => {
    const isLastInteractionARequest = interaction?.props?.type === 'request';
    setIsWaitingForResponse(isLastInteractionARequest);

    setInteractions((previous) => {
      if (isLastElementOfTypeAnimationWriting(previous)) previous.pop();

      const updatedList = !isDefined(interaction)
        ? previous.slice()
        : [...previous, ...(Array.isArray(interaction) ? interaction : [interaction])];

      const finalList = updatedList.concat(getAdditionalInteraction());
      clearAdditionalInteraction();
      return finalList;
    });
  }, []);

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
        if (sidebarTransient || isMobile) {
          toggleSidebar(false)();
        }
        add(<Interaction children={text} type="request" />);
        setPlaceholder(null);
        setLocked(false);
      }
    },
    [add, isMobile, sidebarTransient, toggleSidebar],
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
      if (sidebarTransient || isMobile) {
        toggleSidebar(false)();
      }
      if (urlRedirect) {
        window.open(urlRedirect, '_self');
      }

      if (guiAction) {
        // check for the dydu functions in the window object
        if (guiAction.match('^javascript:dydu')) {
          const extractedTextFromGuiAction = extractParameterFromGuiAction(guiAction);
          if (extractedTextFromGuiAction) {
            setRewordAfterGuiAction(extractedTextFromGuiAction);
          }
          parseActions(guiAction).forEach(({ action, parameters }) => {
            const f = dotget(window, action);
            if (typeof f === 'function') {
              f(...parameters);
            } else {
              console.warn(`[Dydu] Action '${action}' was not found in 'window' object.`);
            }
          });
        } else if (guiAction.match('^javascript:')) {
          cspEval(guiAction.slice(11));
        }
      }

      /**
       * if CSP is activated on client side, following line is needed to allow this code to execute:
       * script-src 'nonce-dydu' 'strict-dynamic';
       * and bundle.min.js has to be called with <script nonce="dydu" src="http.../bundle.min.js"></script>
       *
       * we create there a script tag that will be 'nonce-dydu' (thanks to 'strict-dynamic') and then allowed by CSP
       */
      function cspEval(guiActionCode) {
        try {
          const newScript = document.createElement('script');
          newScript.innerHTML = guiActionCode;
          document.body.appendChild(newScript);
          document.body.removeChild(newScript);
        } catch (e) {
          console.log('Error: ' + e);
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
            sidebar: sidebar,
            steps,
            templateName,
          };
          const interactionPropsList = makeInteractionPropsListWithInteractionChildrenListAndData(
            interactionChildrenList,
            interactionData,
          );
          return makeInteractionComponentForEachInteractionPropInList(interactionPropsList);
        } else {
          const isResponseFromHistory = isDefined(response.isFromHistory) && response.isFromHistory === true;
          return (
            <Interaction
              autoOpenSidebar={!isResponseFromHistory}
              askFeedback={askFeedback}
              carousel={steps.length > 1}
              children={getContent(text, templateData, templateName)}
              type="response"
              sidebar={sidebar}
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
      sidebarTransient,
      isMobile,
      add,
      toggleSidebar,
      dispatchEvent,
      makeInteractionPropsListWithInteractionChildrenListAndData,
      makeInteractionComponentForEachInteractionPropInList,
    ],
  );

  const clearInteractions = () => {
    setInteractions([]);
  };

  const setSidebar = useCallback(({ body, title, url }: SidebarContentProps = {}) => {
    if (body || title || url) {
      setSidebarContent({ body, title, url });
    }
  }, []);

  useEffect(() => {
    Local.sidebar.save(sidebarActive);
  }, [sidebarActive]);

  const addHistoryInteraction = (interaction) => {
    const isLivechatOn = Local.isLivechatOn.load();
    const decodedInteraction = recursiveBase64DecodeString(interaction);
    const typedInteraction = {
      ...decodedInteraction,
      typeResponse: decodedInteraction?.type,
      isFromHistory: true,
      user: isLivechatOn ? decodedInteraction.user : interaction.user,
    };

    !decodedInteraction?.user?.includes('_pushcondition_:') && addRequest(typedInteraction?.user);
    addResponse(typedInteraction);
  };

  const checkIfBehindSamlAndConnected = useMemo(() => {
    return !configuration?.saml?.enable || saml2Connected;
  }, [configuration?.saml, saml2Connected]);

  useEffect(() => {
    if (hasAfterLoadBeenCalled && checkIfBehindSamlAndConnected) exec();
  }, [hasAfterLoadBeenCalled, checkIfBehindSamlAndConnected]);

  useEffect(() => {
    if (isInteractionListEmpty && !welcomeKnowledge && checkIfBehindSamlAndConnected) forceExec();
  }, [isInteractionListEmpty, welcomeKnowledge, checkIfBehindSamlAndConnected]);

  useEffect(() => {
    if (welcomeKnowledge || listInteractionHistory) {
      clearInteractions();
    }
    welcomeKnowledge && addResponse(welcomeKnowledge);
    listInteractionHistory && listInteractionHistory?.forEach(addHistoryInteraction);
  }, [welcomeKnowledge, listInteractionHistory]);

  const chatboxNode: any = useMemo(() => {
    try {
      return getChatboxRef && getChatboxRef();
    } catch (e) {
      return null;
    }
  }, [getChatboxRef]);

  const closeSidebar = useCallback(() => {
    toggleSidebar(false)();
    if (isDefined(chatboxNode))
      try {
        chatboxNode.dispatchEvent(eventOnSidebarClosed);
      } catch (e) {
        // mute multiple call of dispatchEvent error
      }
  }, [toggleSidebar, chatboxNode]);

  const openSidebar = useCallback(
    (props) => {
      if (!sidebarActive) toggleSidebar(true, props)();
    },
    [sidebarActive, toggleSidebar],
  );

  return (
    <DialogContext.Provider
      children={children}
      value={{
        isWaitingForResponse,
        setIsWaitingForResponse,
        closeSidebar,
        openSidebar,
        showAnimationOperatorWriting,
        displayNotification,
        lastResponse,
        add,
        addRequest,
        addResponse,
        disabled,
        clearInteractions,
        interactions,
        locked,
        placeholder,
        prompt,
        sidebarActive,
        sidebarContent,
        setDisabled,
        setLocked,
        setPlaceholder,
        setPrompt,
        setSidebar,
        setVoiceContent,
        toggleSidebar,
        typeResponse,
        voiceContent,
        zoomSrc,
        setZoomSrc,
        autoSuggestionActive,
        setAutoSuggestionActive,
        showUploadFileButton,
        setRewordAfterGuiAction,
        rewordAfterGuiAction,
      }}
    />
  );
}
