import useWebsocket, { ReadyState } from 'react-use-websocket';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TUNNEL_MODE } from '../../contexts/LivechatContext';
import { isDefined } from '../helpers';
import LivechatPayload from '../LivechatPayload';

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
  error: 'error',
  operatorResponse: 'operatorResponse',
  operatorWriting: 'operatorWriting',
  contextResponse: 'contextResponse',
  notification: 'notification',
  endPolling: 'endPolling',
};

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
  const { lastMessage, sendJsonMessage, readyState } = useWebsocket(...socketProps);

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
    setSocketProps([null, {}]);
  }, []);

  const close = useCallback(() => {
    flushSocketProps();
    if (onEndCommunication) onEndCommunication();
  }, [flushSocketProps]);

  useEffect(() => {
    if (!isDefined(messageType)) return;
    switch (messageType) {
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
  }, [close, displayMessage, displayNotification, handleError, messageType, processHandshakeNextStep]);

  useEffect(() => {
    if (handshakeStepCountdown === 1) return sendFirstHandshake();
    if (handshakeStepCountdown === 0) return sendSecondHandshake();
  }, [handshakeStepCountdown, sendFirstHandshake, sendSecondHandshake]);

  const getSocketConfig = useCallback(() => {
    return {
      reconnectAttempts: 3,
      onReconnectStop: _onFail,
      onOpen: () => {
        decrementHandshakeCountDown();
      },
      onClose: (closeEvent) => {
        if (closeEvent.wasClean) close();
        console.log('websocket: on close !', closeEvent);
      },
      onError: (errorEvent) => {
        console.log('websocket: on error !', errorEvent);
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

  const send = useCallback(
    (userInput) => {
      const message = LivechatPayload.create.talkMessage(userInput);
      sendJsonMessage(message);
    },
    [sendJsonMessage],
  );

  const isRunning = useMemo(() => isDefined(socketProps[0]), [socketProps]);

  const isConnected = useMemo(() => readyState === ReadyState.OPEN, [readyState]);

  return {
    isConnected,
    isRunning,
    isAvailable: () => true,
    mode: TUNNEL_MODE.websocket,
    open,
    send,
    close,
  };
}