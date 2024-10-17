import { LIVECHAT_ID_LISTENER, RESPONSE_SPECIAL_ACTION } from '../tools/constants';
import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import SurveyProvider, { useSurvey } from '../Survey/SurveyProvider';
import { isDefined, recursiveBase64DecodeString } from '../tools/helpers';

import LivechatPayload from '../tools/LivechatPayload';
import { Local } from '../tools/storage';
import { useDialog } from './DialogContext';
import useDyduPolling from '../tools/hooks/useDyduPolling';
import { useEvent } from './EventsContext';
import { useUploadFile } from './UploadFileContext';
import { currentServerIndex } from '../tools/axios';
import useDyduWebsocket from '../tools/hooks/useDyduWebsocket';
import { useWelcomeKnowledge } from './WelcomeKnowledgeContext';
import { useConversationHistory } from './ConversationHistoryContext';
import { useTranslation } from 'react-i18next';

interface LivechatContextProps {
  send?: (str: string, options?) => void;
  sendSurvey?: (str: string) => void;
  typing?: (input: any) => void;
  endLivechat?: () => void;
  addNotificationOrResponse?: (values: Servlet.ChatResponseValues) => void;
  isWaitingQueue?: boolean;
}

interface LivechatProviderProps {
  children?: ReactElement;
}

export const LivechatContext = createContext<LivechatContextProps>({});

export const useLivechat = () => useContext(LivechatContext);

const findFirstAvailableTunnelInList = (tunnelList) => tunnelList.find((tunnel) => tunnel.isAvailable());
const findFallbackTunnelInList = (tunnelList) => tunnelList[tunnelList.length - 1];
const containsStartLivechat = (response) => LivechatPayload.is.startLivechat(response);
const containsEndLivechat = (response) => LivechatPayload.is.endPolling(response);

export function LivechatProvider({ children }: LivechatProviderProps) {
  const { t } = useTranslation();
  const tunnelList = [useDyduWebsocket(), useDyduPolling()];
  const [tunnel, setTunnel] = useState<any>(null);
  const { getSurveyConfiguration, triggerSurvey } = useSurvey();
  const { showUploadFileButton } = useUploadFile();
  const {
    lastResponse,
    setLastResponse,
    addRequest,
    displayNotification,
    showAnimationOperatorWriting,
    addResponse,
    clearInteractionsAndAddWelcome,
    interactions,
  } = useDialog();
  const { onNewMessage } = useEvent();
  const { welcomeKnowledge } = useWelcomeKnowledge();
  const { history } = useConversationHistory();
  const [isWaitingQueue, setIsWaitingQueue] = useState<boolean>(Local.waitingQueue.load());

  const addHistoryInteraction = (interaction) => {
    const typedInteraction = {
      ...interaction,
      typeResponse: interaction?.type,
      isFromHistory: true,
      user: interaction.user,
    };

    if (!interaction?.user?.includes('_pushcondition_:') && !interaction.hideRequest) {
      addRequest && addRequest(typedInteraction?.user);
    }
    addNotificationOrResponse(typedInteraction);
  };

  useEffect(() => {
    if (welcomeKnowledge) {
      clearInteractionsAndAddWelcome();
    }
  }, [welcomeKnowledge]);

  useEffect(() => {
    if (history && (!interactions || history.length >= interactions.length)) {
      history.forEach(addHistoryInteraction);
    }
  }, [history]);

  const addNewMessageAndNotificationOrResponse = (values) => {
    onNewMessage && onNewMessage();
    addNotificationOrResponse(values);
  };

  const addNotificationOrResponse = (response) => {
    setLastResponse(response);

    if (LivechatPayload.is.liveChatConnectionInQueue(response)) {
      // from chatWs history
      let decodedResponse = recursiveBase64DecodeString(response);
      decodedResponse.text = t('livechat.queue.addedToQueueForHistory');
      displayNotification && displayNotification(decodedResponse);
    } else if (LivechatPayload.is.startWaitingQueue(response)) {
      // from POST request
      enterWaitingQueue();
      let decodedResponse = null;
      decodedResponse = recursiveBase64DecodeString(response);
      decodedResponse.text =
        t('livechat.queue.start') +
        t('livechat.queue.position', { position: LivechatPayload.is.waitingQueuePosition(decodedResponse) }) +
        t('livechat.queue.estimation', {
          estimation: LivechatPayload.is.waitingQueueEstimatedWaitingDuration(decodedResponse),
        });
      displayNotification && displayNotification(decodedResponse);
    } else if (LivechatPayload.is.startLivechat(response)) {
      decodeAndDisplayNotification(response);
    } else {
      addResponse && addResponse(response);
    }
  };

  const decodeAndDisplayNotification = (notification) => {
    displayNotification && displayNotification(recursiveBase64DecodeString(notification));
  };

  const shouldEndLivechat = useMemo(() => {
    return isDefined(lastResponse) && containsEndLivechat(lastResponse);
  }, [lastResponse]);

  const isStartWaitingQueue = (response) => response?.specialAction?.equals(RESPONSE_SPECIAL_ACTION.startWaitingQueue);

  const shouldStartLivechat = () => {
    return (
      Local.livechatType.load() ||
      (isDefined(lastResponse) && (containsStartLivechat(lastResponse) || isStartWaitingQueue(lastResponse)))
    );
  };

  const onSuccessOpenTunnel = (tunnel) => {
    Local.livechatType.save(tunnel.mode);
    setTunnel(tunnel);
  };

  const onFailOpenTunnel = useCallback(
    (failedTunnel, err) => {
      try {
        console.warn(err);
        console.warn('Livechat: while starting: Error with mode ' + (failedTunnel ? failedTunnel.mode : 'unknown'));
        const fallbackTunnel = findFallbackTunnelInList(tunnelList);
        console.warn('Livechat: falling back to mode ' + fallbackTunnel.mode);
        fallbackTunnel.open(livechatContextFunctions).then(() => onSuccessOpenTunnel(fallbackTunnel));
      } catch (error) {
        console.error('An error occurred while handling a failed tunnel opening', error);
      }
    },
    [onSuccessOpenTunnel, tunnelList, tunnel],
  );

  const leaveWaitingQueue = () => {
    Local.waitingQueue.remove();
    setIsWaitingQueue(false);
  };

  const enterWaitingQueue = () => {
    Local.waitingQueue.save(true);
    setIsWaitingQueue(true);
  };

  const endLivechat = () => {
    Local.livechatType.remove();
    leaveWaitingQueue();
    Local.operator.remove();
    tunnel?.close();
    setTunnel(null);
    triggerSurvey && triggerSurvey();
  };

  const livechatContextFunctions = useMemo(() => {
    return {
      ...lastResponse,
      endLivechat,
      addNewMessageAndNotificationOrResponse,
      decodeAndDisplayNotification,
      onFailOpenTunnel,
      showAnimationOperatorWriting,
      getSurveyConfiguration,
      showUploadFileButton,
      leaveWaitingQueue,
    };
  }, [
    lastResponse,
    onFailOpenTunnel,
    endLivechat,
    addNewMessageAndNotificationOrResponse,
    decodeAndDisplayNotification,
    showAnimationOperatorWriting,
    showUploadFileButton,
    getSurveyConfiguration,
  ]);

  const startLivechat = (tunnel = null) => {
    const _tunnel = tunnel || findFirstAvailableTunnelInList(tunnelList);

    return _tunnel
      ?.open(livechatContextFunctions)
      .then(() => {
        onSuccessOpenTunnel(_tunnel);
      })
      .catch((err) => {
        onFailOpenTunnel(_tunnel, err);
      });
  };
  const sendSurvey = useCallback(
    (surveyResponse) => {
      tunnel?.sendSurvey(surveyResponse);
    },
    [tunnel],
  );
  /* This part is only to call LivechatContext from SurveyProvider */
  /* LivechatContext can see SurveyProvider, but not vice versa */
  const onUnmount = useCallback(() => {
    SurveyProvider.removeListener(LIVECHAT_ID_LISTENER);
  }, []);

  useEffect(() => {
    if (!Local.livechatType.load()) {
      return onUnmount();
    }
    SurveyProvider.addListener(LIVECHAT_ID_LISTENER, sendSurvey);
  }, [Local.livechatType.load(), sendSurvey]);
  /* ============================================================== */

  useEffect(() => {
    if (shouldEndLivechat) {
      endLivechat();
    } else if (shouldStartLivechat() && !tunnel) {
      startLivechat();
    }
  }, [currentServerIndex]);

  useEffect(() => {
    if (shouldEndLivechat) endLivechat();
  }, [shouldEndLivechat, endLivechat]);

  useEffect(() => {
    if (shouldStartLivechat() && !tunnel) {
      startLivechat();
    }
  }, [lastResponse]);

  useEffect(() => {
    if (tunnel) {
      if (history && history.length > 0) {
        tunnel.setLastPollingResponse(history[history.length - 1]);
      }
    }
  }, [tunnel, history]);

  useEffect(() => {
    if (tunnel) {
      if (lastResponse && Object.keys(lastResponse).length > 0) {
        tunnel?.setLastPollingResponse(lastResponse);
      }
    }
  }, [tunnel, lastResponse]);

  const send = useCallback(
    (userInput, options) => {
      const _tunnel = findFirstAvailableTunnelInList(tunnelList);
      const isTunnelStillAvailable = tunnel?.mode && tunnel?.mode === _tunnel?.mode && _tunnel?.mode;
      if (isTunnelStillAvailable) {
        tunnel?.send(userInput, options);
      } else {
        startLivechat(_tunnel)?.then(() => tunnel?.send(userInput, options));
      }
    },
    [tunnel, Local.livechatType.load()],
  );
  const typing = useCallback(
    (input) => {
      if (Local.livechatType.load()) {
        tunnel?.onUserTyping(input);
      }
    },
    [tunnel],
  );
  const props: LivechatContextProps = {
    send,
    sendSurvey,
    typing,
    endLivechat,
    addNotificationOrResponse,
    isWaitingQueue,
  };
  return <LivechatContext.Provider value={props}>{children}</LivechatContext.Provider>;
}
