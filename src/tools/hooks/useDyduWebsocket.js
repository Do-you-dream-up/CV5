import { useCallback, useEffect, useMemo, useState } from 'react';
import useWebsocket, { ReadyState } from 'react-use-websocket';

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

const urlExtractDomain = (url) => url.replace(/^http[s]?:\/\//, '');

const makeWsUrl = (url) => 'wss://' + urlExtractDomain(url) + '/chatWs';

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
};

let onFail = null;
let onEndCommunication = null;
let displayResponseText = null;
let displayNotificationMessage = null;
let onOperatorWriting = null;

const completeLivechatPayload = (configuration) =>
  LivechatPayload.addPayloadCommonContent({
    contextId: configuration.contextId || Local.contextId.load(),
    botId: configuration.botId || BOT.id || Local.get(Local.names.botId),
    space: configuration.api.getSpace() || Local.get(Local.names.space),
    clientId: configuration.api.getClientId() || Local.get(Local.names.client),
    language: configuration.api.getLocale() || Local.get(Local.names.locale),
  });

export default function useDyduWebsocket() {
  const { showUploadFileButton } = useUploadFile();
  const [socketProps, setSocketProps] = useState([null, {}]);
  const { lastMessage, sendJsonMessage, readyState } = useWebsocket(socketProps[0], socketProps[1]);
  const { history, setHistory } = useConversationHistory();
  const { setTopKnowledge, extractPayload } = useTopKnowledge();
  const { setSurveyConfig } = useSurvey();
  const { configuration } = useConfiguration();

  const messageData = useMemo(() => {
    if (!isDefined(lastMessage)) return null;
    return JSON.parse(lastMessage?.data);
  }, [lastMessage]);

  const isOperatorStateNotification = useCallback((messageData) => {
    return (
      LivechatPayload.is.operatorWriting(messageData) ||
      LivechatPayload.is.operatorBusy(messageData) ||
      LivechatPayload.is.operatorConnected(messageData) ||
      LivechatPayload.is.operatorDisconnected(messageData) ||
      LivechatPayload.is.operatorManuallyTransferredDialog(messageData) ||
      LivechatPayload.is.operatorAutomaticallyTransferredDialog(messageData)
    );
  }, []);

  const messageType = useMemo(() => {
    if (!isDefined(messageData)) return null;
    if (LivechatPayload.is.getContextResponse(messageData)) return MESSAGE_TYPE.contextResponse;
    if (LivechatPayload.is.historyResponse(messageData)) return MESSAGE_TYPE.historyResponse;
    if (LivechatPayload.is.surveyConfigurationResponse(messageData)) return MESSAGE_TYPE.surveyConfigurationResponse;
    if (LivechatPayload.is.topKnowledgeResponse(messageData)) return MESSAGE_TYPE.topKnowledge;
    if (LivechatPayload.is.endPolling(messageData)) return MESSAGE_TYPE.endPolling;
    if (LivechatPayload.is.operatorSendSurvey(messageData)) return MESSAGE_TYPE.survey;
    if (LivechatPayload.is.operatorSendUploadRequest(messageData)) return MESSAGE_TYPE.uploadRequest;
    if (isOperatorStateNotification(messageData)) return MESSAGE_TYPE.notification;
    return MESSAGE_TYPE.operatorResponse;
  }, [isOperatorStateNotification, messageData]);

  const messageText = useMemo(() => {
    if (!isDefined(messageData)) return null;
    return messageData?.values?.text?.fromBase64();
  }, [messageData]);

  const displayMessage = useCallback(() => {
    if (isDefined(messageText)) {
      displayResponseText(b64decodeObject(messageData?.values));

      let operator = messageData?.values?.operatorExternalId?.fromBase64();
      if (operator) {
        Local.operator.save(operator);
      }
    }
  }, [messageText]);

  const displayNotification = useCallback(() => {
    if (!isDefined(messageText)) {
      return;
    }

    if (LivechatPayload.is.operatorWriting(messageData)) return onOperatorWriting();
    displayNotificationMessage(messageData);
  }, [messageData, messageText]);

  const _onFail = useCallback(() => {
    console.log('_onFail', 'Failing connection !');
    if (isDefined(onFail)) onFail();
    flushSocketProps();
  }, [flushSocketProps]);

  const flushSocketProps = useCallback(() => {
    console.log('Flushing Socket Props');
    setSocketProps([null, {}]);
  }, []);

  const close = useCallback(() => {
    flushSocketProps();
    if (onEndCommunication) onEndCommunication();
  }, [flushSocketProps]);

  useEffect(() => {
    if (!isDefined(messageType)) return;
    switch (messageType) {
      case MESSAGE_TYPE.survey:
        return sendSurveyConfiguration(b64decode(messageData?.values?.survey));

      case MESSAGE_TYPE.surveyConfigurationResponse:
        setSurveyConfig(b64dAllFields(messageData?.values));
        return;

      case MESSAGE_TYPE.uploadRequest:
        return showUploadFileButton();

      case MESSAGE_TYPE.operatorResponse:
        return displayMessage();

      case MESSAGE_TYPE.notification:
        return displayNotification();

      case MESSAGE_TYPE.historyResponse:
        if (!messageData?.values?.interactions || messageData?.values?.interactions?.length === 0) {
          Local.isLivechatOn.save(false);
          Local.operator.remove();
        } else if (!history || history?.length === 0) {
          setHistory(messageData.values.interactions);
        }
        return;

      case MESSAGE_TYPE.topKnowledge:
        if (messageData) {
          setTopKnowledge(extractPayload(messageData));
        }
        return;

      case MESSAGE_TYPE.endPolling:
        displayNotification();
        return close();
    }
  }, [close, displayMessage, displayNotification, messageData, messageType, showUploadFileButton]);

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
      },
    };
  }, [_onFail, close]);

  const getSocketUrl = useCallback(() => {
    return makeWsUrl(buildServletUrl());
  }, []);

  const initSocketProps = useCallback(() => {
    setSocketProps([getSocketUrl(), getSocketConfig()]);
  }, [getSocketConfig, getSocketUrl]);

  const setupOutputs = useCallback((configuration) => {
    onEndCommunication = configuration.endLivechat;
    displayResponseText = configuration.displayResponseText;
    displayNotificationMessage = configuration.displayNotification;
    onOperatorWriting = configuration.showAnimationOperatorWriting;
    onFail = configuration.onFail;
  }, []);

  const open = useCallback(
    (config) => {
      return new Promise((resolve) => {
        completeLivechatPayload(config);
        setupOutputs(config);
        initSocketProps();
        resolve(true);
      });
    },
    [initSocketProps, setupOutputs],
  );

  const sendSurvey = useCallback((surveyAnswer) => {
    const message = LivechatPayload.create.surveyAnswerMessage(surveyAnswer);
    try {
      trySendMessage(message);
      dydu.displaySurveySent(surveyAnswer.reword, {}, 200);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const sendSurveyConfiguration = (surveyId) => {
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

  const isRunning = useMemo(() => isDefined(socketProps[0]), [socketProps]);

  const isConnected = readyState === ReadyState.OPEN;

  const onUserTyping = useCallback(
    (userInput) => {
      const message = LivechatPayload.create.userTypingMessage(userInput);
      trySendMessage(message);
    },
    [sendJsonMessage],
  );

  return {
    isConnected,
    isRunning,
    isAvailable: () => isDefined(window.WebSocket),
    mode: TUNNEL_MODE.websocket,
    open,
    send,
    sendHistory,
    sendSurveyConfiguration,
    sendSurvey,
    close,
    onUserTyping,
    displayMessage,
    displayNotification,
    displayResponseText,
    sendJsonMessage,
  };
}
