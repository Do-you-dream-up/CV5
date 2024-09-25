import { useCallback, useEffect, useMemo, useState } from 'react';
import useWebsocket from 'react-use-websocket';

import LivechatPayload from '../LivechatPayload';
import { Local } from '../storage';
import { TUNNEL_MODE } from '../constants';
import dydu from '../dydu';
import { b64dAllFields, b64decode, b64decodeObject, isDefined } from '../helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useConversationHistory } from '../../contexts/ConversationHistoryContext';
import { useTopKnowledge } from '../../contexts/TopKnowledgeContext';
import { useUploadFile } from '../../contexts/UploadFileContext';
import { useSurvey } from '../../Survey/SurveyProvider';
import { BOT } from '../bot';
import { buildServletUrl } from '../axios';
import { decode } from '../cipher';

const urlExtractDomain = (url) => url.replace(/^http[s]?:\/\//, '');

const makeWsUrl = (url) => 'wss://' + urlExtractDomain(url) + '/chatWs';

let endLivechat = null;
let addNewMessageAndNotificationOrResponse = null;
let decodeAndDisplayNotification = null;
let showAnimationOperatorWriting = null;
let leaveWaitingQueue = null;
let onFailOpenTunnel = null;

const linkToLivechatFunctions = (livechatContextFunctions) => {
  endLivechat = livechatContextFunctions.endLivechat;
  addNewMessageAndNotificationOrResponse = livechatContextFunctions.addNewMessageAndNotificationOrResponse;
  decodeAndDisplayNotification = livechatContextFunctions.decodeAndDisplayNotification;
  showAnimationOperatorWriting = livechatContextFunctions.showAnimationOperatorWriting;
  onFailOpenTunnel = livechatContextFunctions.onFailOpenTunnel;
  leaveWaitingQueue = livechatContextFunctions.leaveWaitingQueue;
};

let needToAnswerSurvey = false;
let endPollingReceived = false;

const MESSAGE_TYPE = {
  survey: 'survey',
  surveyConfigurationResponse: 'surveyConfigurationResponse',
  error: 'error',
  operatorResponse: 'operatorResponse',
  operatorWriting: 'operatorWriting',
  contextResponse: 'contextResponse',
  historyResponse: 'historyResponse',
  topKnowledge: 'topKnowledgeResponse',
  notification: 'notification',
  endPolling: 'endPolling',
  uploadRequest: 'uploadRequest',
  startPolling: 'StartPolling',
  leaveWaitingQueue: 'LeaveWaitingQueue',
  dialogPicked: 'DialogPicked',
};

const completeLivechatPayload = (configuration) =>
  LivechatPayload.addPayloadCommonContent({
    contextId: configuration.contextId || Local.contextId.load(),
    botId: configuration.botId || BOT.id || Local.get(Local.names.botId),
    space: dydu.getSpace() || Local.get(Local.names.space),
    clientId: dydu.getClientId() || Local.get(Local.names.client),
    language: dydu.getLocale() || Local.get(Local.names.locale),
  });

export default function useDyduWebsocket() {
  const { showUploadFileButton } = useUploadFile();
  const [socketProps, setSocketProps] = useState([null, {}]);
  const { lastMessage, sendJsonMessage } = useWebsocket(socketProps[0], socketProps[1]);
  const { history, setHistory } = useConversationHistory();
  const { setTopKnowledge, extractPayload } = useTopKnowledge();
  const { flushStates: flushOldSurvey, setSurveyConfig } = useSurvey();
  const { configuration } = useConfiguration();

  const lastMessageData = useMemo(() => {
    if (lastMessage && lastMessage.data) {
      return JSON.parse(lastMessage.data);
    }
    return null;
  }, [lastMessage]);

  const isOperatorStateNotification = useCallback((lastMessageData) => {
    return (
      LivechatPayload.is.operatorWriting(lastMessageData) ||
      LivechatPayload.is.operatorBusy(lastMessageData) ||
      LivechatPayload.is.operatorConnected(lastMessageData) ||
      LivechatPayload.is.operatorDisconnected(lastMessageData) ||
      LivechatPayload.is.operatorManuallyTransferredDialog(lastMessageData) ||
      LivechatPayload.is.operatorAutomaticallyTransferredDialog(lastMessageData) ||
      LivechatPayload.is.startLivechat(lastMessageData)
    );
  }, []);

  const messageType = useMemo(() => {
    if (!isDefined(lastMessageData)) return null;
    if (LivechatPayload.is.leaveWaitingQueue(lastMessageData)) return MESSAGE_TYPE.leaveWaitingQueue;
    if (LivechatPayload.is.getContextResponse(lastMessageData)) return MESSAGE_TYPE.contextResponse;
    if (LivechatPayload.is.historyResponse(lastMessageData)) return MESSAGE_TYPE.historyResponse;
    if (LivechatPayload.is.surveyConfigurationResponse(lastMessageData))
      return MESSAGE_TYPE.surveyConfigurationResponse;
    if (LivechatPayload.is.topKnowledgeResponse(lastMessageData)) return MESSAGE_TYPE.topKnowledge;
    if (LivechatPayload.is.endPolling(lastMessageData)) return MESSAGE_TYPE.endPolling;
    if (LivechatPayload.is.operatorSendSurvey(lastMessageData)) return MESSAGE_TYPE.survey;
    if (LivechatPayload.is.operatorSendUploadRequest(lastMessageData)) return MESSAGE_TYPE.uploadRequest;
    if (isOperatorStateNotification(lastMessageData)) return MESSAGE_TYPE.notification;
    if (LivechatPayload.is.dialogPicked(lastMessageData)) return MESSAGE_TYPE.dialogPicked;
    return MESSAGE_TYPE.operatorResponse;
  }, [isOperatorStateNotification, lastMessageData]);

  const messageText = useMemo(() => {
    if (!isDefined(lastMessageData)) return null;
    return lastMessageData.values?.text?.fromBase64();
  }, [lastMessageData]);

  const displayMessage = useCallback(() => {
    if (isDefined(messageText)) {
      addNewMessageAndNotificationOrResponse(b64decodeObject(lastMessageData?.values));

      let operator = lastMessageData?.values?.operatorExternalId?.fromBase64();
      if (operator) {
        Local.operator.save(operator);
      }
    }
  }, [messageText]);

  const displayNotification = useCallback(() => {
    if (!isDefined(messageText)) {
      return;
    }

    if (LivechatPayload.is.operatorWriting(lastMessageData) && lastMessageData?.values?.text?.length > 0) {
      return showAnimationOperatorWriting();
    }
    decodeAndDisplayNotification(lastMessageData);
  }, [lastMessageData, messageText]);

  const _onFail = useCallback(() => {
    console.log('_onFail', 'Failing connection !');
    if (isDefined(onFailOpenTunnel)) onFailOpenTunnel();
    flushSocketProps();
  }, [flushSocketProps]);

  const flushSocketProps = useCallback(() => {
    setSocketProps([null, {}]);
  }, []);

  const close = useCallback(() => {
    flushSocketProps();
    if (endLivechat) endLivechat();
  }, [flushSocketProps]);

  useEffect(() => {
    if (!isDefined(messageType)) return;
    switch (messageType) {
      case MESSAGE_TYPE.survey:
        needToAnswerSurvey = true;
        flushOldSurvey();
        return getSurveyConfiguration(b64decode(lastMessageData?.values?.survey));

      case MESSAGE_TYPE.surveyConfigurationResponse:
        setSurveyConfig(b64dAllFields(lastMessageData?.values));
        return;

      case MESSAGE_TYPE.uploadRequest:
        return showUploadFileButton();

      case MESSAGE_TYPE.operatorResponse:
        return displayMessage();

      case MESSAGE_TYPE.notification:
        return displayNotification();

      case MESSAGE_TYPE.dialogPicked:
        leaveWaitingQueue();
        return displayNotification();

      case MESSAGE_TYPE.historyResponse:
        if (!lastMessageData?.values?.interactions || lastMessageData?.values?.interactions?.length === 0) {
          close();
        } else if (!history) {
          const decodedInteractions = decode(lastMessageData.values).interactions;
          setHistory(decodedInteractions);
        }
        return;

      case MESSAGE_TYPE.topKnowledge:
        if (lastMessageData) {
          setTopKnowledge(extractPayload(lastMessageData));
        }
        return;

      case MESSAGE_TYPE.endPolling:
        endPollingReceived = true;
        displayNotification();
        if (!needToAnswerSurvey) {
          endPollingReceived = false;
          close();
        }
        return;

      case MESSAGE_TYPE.leaveWaitingQueue:
        displayNotification();
        leaveWaitingQueue();
        return close();
    }
  }, [close, displayMessage, displayNotification, lastMessageData, messageType, showUploadFileButton]);

  const getSocketConfig = useCallback(() => {
    return {
      share: true,
      onReconnectStop: _onFail,
      onOpen: (onOpen) => {
        console.log('websocket: on open !', onOpen);
        sendTopKnowledge(configuration);
        sendHistory();
      },
      onClose: (closeEvent) => {
        console.log('websocket: on close !', closeEvent);
      },
      onError: (errorEvent) => {
        console.log('websocket: on error !', errorEvent);
        _onFail();
      },
    };
  }, [_onFail, close]);

  const getSocketUrl = useCallback(() => {
    return makeWsUrl(buildServletUrl());
  }, []);

  const initSocketProps = useCallback(() => {
    setSocketProps([getSocketUrl(), getSocketConfig()]);
  }, [getSocketConfig, getSocketUrl]);

  const open = useCallback(
    (livechatContextFunctions) => {
      return new Promise((resolve) => {
        completeLivechatPayload(livechatContextFunctions);
        linkToLivechatFunctions(livechatContextFunctions);
        initSocketProps();
        resolve(true);
      });
    },
    [initSocketProps, linkToLivechatFunctions],
  );

  const sendSurvey = useCallback((surveyAnswer) => {
    const message = LivechatPayload.create.surveyAnswerMessage(surveyAnswer);
    try {
      needToAnswerSurvey = false;
      trySendMessage(message);
      dydu.displaySurveySent(surveyAnswer.reword, {}, 200);
      if (endPollingReceived) {
        endPollingReceived = false;
        close();
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getSurveyConfiguration = (surveyId) => {
    const message = LivechatPayload.create.surveyConfigurationMessage(surveyId);
    try {
      trySendMessage(message);
    } catch (e) {
      console.error(e);
    }
  };

  const trySendMessage = (message) => {
    try {
      sendJsonMessage(message);
    } catch (e) {
      _onFail();
    }
  };

  const send = useCallback(
    (userInput, options) => {
      const message = LivechatPayload.create.talkMessage(userInput, options);
      trySendMessage(message);
    },
    [sendJsonMessage],
  );

  const sendHistory = useCallback(() => {
    const message = LivechatPayload.create.historyMessage();
    trySendMessage(message);
  }, [sendJsonMessage]);

  const sendTopKnowledge = useCallback(
    (configuration) => {
      const message = LivechatPayload.create.topKnowledgeMessage(configuration?.top?.period, configuration?.top?.size);
      trySendMessage(message);
    },
    [sendJsonMessage],
  );

  const onUserTyping = useCallback(
    (userInput) => {
      const message = LivechatPayload.create.userTypingMessage(userInput);
      trySendMessage(message);
    },
    [sendJsonMessage],
  );

  return {
    isAvailable: () => isDefined(window.WebSocket),
    mode: TUNNEL_MODE.websocket,
    open,
    send,
    sendSurvey,
    close,
    onUserTyping,
    setLastPollingResponse: () => {},
  };
}
