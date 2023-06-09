import { useCallback, useEffect, useMemo, useState } from 'react';
import useWebsocket, { ReadyState } from 'react-use-websocket';

import LivechatPayload from '../LivechatPayload';
import { TUNNEL_MODE } from '../constants';
import dydu from '../dydu';
import { isDefined } from '../helpers';

const urlExtractDomain = (url) => url.replace(/^http[s]?:\/\//, '').split('/')[0];

const makeWsUrl = (url) => 'wss://' + urlExtractDomain(url) + '/servlet/chatWs';

const countdownRetryHandshake = {
  reset: function () {
    this.maxRetry = this.MAX_RETRY_HANDSHAKE_STEP;
  },
  count: function () {
    this.maxRetry--;
  },
  inc: function () {
    this.maxRetry++;
  },
  retryEnd() {
    return this.maxRetry === 0;
  },
};
const MAX_RETRY_HANDSHAKE_STEP = 3;
countdownRetryHandshake.MAX_RETRY_HANDSHAKE_STEP = MAX_RETRY_HANDSHAKE_STEP;
countdownRetryHandshake.maxRetry = MAX_RETRY_HANDSHAKE_STEP;

const MESSAGE_TYPE = {
  survey: 'survey',
  error: 'error',
  operatorResponse: 'operatorResponse',
  operatorWriting: 'operatorWriting',
  contextResponse: 'contextResponse',
  notification: 'notification',
  endPolling: 'endPolling',
  startPolling: 'StartPolling',
};

let handleSurvey = null;
let onFail = null;
let onEndCommunication = null;
let displayResponseText = null;
let displayNotificationMessage = null;
let onOperatorWriting = null;

const completeLivechatPayload = (configuration) =>
  LivechatPayload.addPayloadCommonContent({
    contextId: configuration.contextId,
    botId: configuration.botId,
    space: configuration.api.getSpace(),
    clientId: configuration.api.getClientId(),
    language: configuration.api.getLocale(),
  });

export default function useDyduWebsocket() {
  const [socketProps, setSocketProps] = useState([null, {}]);
  const [handshakeStepCountdown, setHandshakeStepCountdown] = useState(2);
  const { lastMessage, sendJsonMessage, readyState } = useWebsocket(socketProps[0], socketProps[1]);

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
    if (LivechatPayload.is.endPolling(messageData)) return MESSAGE_TYPE.endPolling;
    if (LivechatPayload.is.operatorSendSurvey(messageData)) return MESSAGE_TYPE.survey;
    if (isOperatorStateNotification(messageData)) return MESSAGE_TYPE.notification;
    return MESSAGE_TYPE.operatorResponse;
  }, [isOperatorStateNotification, messageData]);

  const messageText = useMemo(() => {
    if (!isDefined(messageData)) return null;
    return messageData?.values?.text?.fromBase64();
  }, [messageData]);

  const displayMessage = useCallback(() => {
    if (isDefined(messageText)) {
      displayResponseText(messageText);
      //window.dydu.chat.reply(messageText);
    }
  }, [messageText]);

  const displayNotification = useCallback(() => {
    if (!isDefined(messageText)) return;

    if (LivechatPayload.is.operatorWriting(messageData)) return onOperatorWriting();
    displayNotificationMessage(messageData);
  }, [messageData, messageText]);

  const decrementHandshakeCountDown = useCallback(
    () => setHandshakeStepCountdown(handshakeStepCountdown - 1),
    [handshakeStepCountdown],
  );

  const processHandshakeNextStep = useCallback(() => {
    if (!isDefined(messageData) || handshakeStepCountdown === 0) return;
    LivechatPayload.addPayloadCommonContent({
      contextId: messageData?.values?.contextId?.fromBase64(),
      botId: messageData?.values?.botId?.fromBase64(),
    });
    decrementHandshakeCountDown();
  }, [decrementHandshakeCountDown, handshakeStepCountdown, messageData]);

  const _onFail = useCallback(() => {
    console.log('_onFail', 'Failing connection !');
    countdownRetryHandshake.reset();
    if (isDefined(onFail)) onFail();
    flushSocketProps();
  }, [flushSocketProps]);

  const sendFirstHandshake = useCallback(() => {
    if (countdownRetryHandshake.retryEnd()) return _onFail();
    countdownRetryHandshake.count();
    sendJsonMessage(LivechatPayload.create.getContextMessage());
  }, [_onFail, sendJsonMessage]);

  const sendSecondHandshake = useCallback(() => {
    countdownRetryHandshake.reset();
    sendJsonMessage(LivechatPayload.create.internautEventMessage());
  }, [sendJsonMessage]);

  const handleError = useCallback(() => {
    if (handshakeStepCountdown === 1) sendFirstHandshake();
  }, [handshakeStepCountdown, sendFirstHandshake]);

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
        return handleSurvey(messageData);

      case MESSAGE_TYPE.operatorResponse:
        return displayMessage();

      case MESSAGE_TYPE.notification:
        return displayNotification();

      case MESSAGE_TYPE.contextResponse:
        return processHandshakeNextStep();

      case MESSAGE_TYPE.error:
        return handleError();

      case MESSAGE_TYPE.endPolling: {
        displayNotification();
        return close();
      }
    }
  }, [close, displayMessage, displayNotification, handleError, messageData, messageType, processHandshakeNextStep]);

  useEffect(() => {
    if (handshakeStepCountdown === 1) return sendFirstHandshake();
    if (handshakeStepCountdown === 0) return sendSecondHandshake();
  }, [handshakeStepCountdown, sendFirstHandshake, sendSecondHandshake]);

  const getSocketConfig = useCallback(() => {
    return {
      onReconnectStop: _onFail,
      onOpen: (onOpen) => {
        console.log('🚀 ~ file: useDyduWebsocket.js:198 ~ getSocketConfig ~ onOpen:', onOpen);
        decrementHandshakeCountDown();
      },
      // onClose: (closeEvent) => {
      //   _onFail();
      //   if (closeEvent.wasClean) close();
      //   console.log('websocket: on close !', closeEvent);
      // },
      onError: (errorEvent) => {
        _onFail(), console.log('websocket: on error !', errorEvent);
      },
    };
  }, [_onFail, close, decrementHandshakeCountDown]);

  const getSocketUrl = useCallback((configuration) => {
    return makeWsUrl(configuration.api.getBot().server);
  }, []);

  const initSocketProps = useCallback(
    (configuration) => {
      setSocketProps([getSocketUrl(configuration), getSocketConfig()]);
    },
    [getSocketConfig, getSocketUrl],
  );

  const setupOutputs = useCallback((configuration) => {
    onEndCommunication = configuration.endLivechat;
    displayResponseText = configuration.displayResponseText;
    displayNotificationMessage = configuration.displayNotification;
    onOperatorWriting = configuration.showAnimationOperatorWriting;
    onFail = configuration.onFail;
    handleSurvey = configuration.handleSurvey;
  }, []);

  const open = useCallback(
    (configuration) => {
      return new Promise((resolve) => {
        completeLivechatPayload(configuration);
        setupOutputs(configuration);
        initSocketProps(configuration);
        resolve(true);
      });
    },
    [initSocketProps, setupOutputs],
  );

  const sendSurvey = useCallback((surveyAnswer) => {
    const message = LivechatPayload.create.surveyAnswerMessage(surveyAnswer);
    try {
      trySendMessage(message);
      dydu.displaySurveySent({}, 200);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const trySendMessage = (message) => {
    try {
      sendJsonMessage(message);
      console.log('🚀 ~ file: useDyduWebsocket.js:250 ~ trySendMessage ~ message:', message);
    } catch (e) {
      console.log('🚀 ~ file: useDyduWebsocket.js:247 ~ trySendMessage ~ e:', e);
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
    console.log('Sending History Message');
  }, [sendJsonMessage]);

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
    sendSurvey,
    close,
    onUserTyping,
    displayMessage,
    displayNotification,
    sendJsonMessage,
  };
}
