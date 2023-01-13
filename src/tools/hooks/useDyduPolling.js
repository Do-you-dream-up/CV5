/* eslint-disable */

import { SOLUTION_TYPE, TUNNEL_MODE } from '../constants';
import { isDefined, isEmptyString, recursiveBase64DecodeString } from '../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

import LivechatPayload from '../LivechatPayload';

let onOperatorWriting = null;
let displayResponse = null;
let displayNotification = null;
let onEndLivechat = null;
let api = null;
let handleSurvey = null;

const saveConfiguration = (configuration) => {
  onOperatorWriting = configuration.showAnimationOperatorWriting;
  displayResponse = configuration.displayResponseText;
  displayNotification = configuration.displayNotification;
  onEndLivechat = configuration.endLivechat;
  api = configuration.api;
  handleSurvey = configuration.handleSurvey;
};

const RESPONSE_TYPE = {
  notification: 'notification',
  message: 'message',
};

const typeToChecker = {
  [RESPONSE_TYPE.message]: (response) => {
    return isDefined(response) && isDefined(response?.text) && isDefined(response?.fromDetail);
  },
  [RESPONSE_TYPE.notification]: (response) => {
    return (
      isDefined(response?.code) ||
      (isDefined(response?.typeResponse) && response?.typeResponse?.fromBase64()?.equals('NAAutoCloseDialog'))
    );
  },
};

const TYPE_NAME_LIST = Object.keys(RESPONSE_TYPE);

const INTERVAL_MS = 2500;

let interval;
const stopPolling = () => {
  clearInterval(interval);
  interval = null;
  initialized = false;
};

const responseToLivechatPayload = (r) => ({
  ...r,
  values: { ...r },
});

const typeToHandler = {
  [RESPONSE_TYPE.message]: (response) => {
    const { text } = response;
    displayResponse(text);
  },
  [RESPONSE_TYPE.notification]: (response) => {
    const notification = responseToLivechatPayload(response);
    notification.type = 'notification';

    if (LivechatPayload.is.operatorWriting(notification)) return onOperatorWriting();
    if (LivechatPayload.is.operatorSendSurvey(notification)) return handleSurvey(notification);

    displayNotification(notification);

    if (LivechatPayload.is.endPolling(notification)) {
      stopPolling();
      onEndLivechat();
    }
  },
};

const getType = (response) => {
  let res = TYPE_NAME_LIST.reduce((typeNameResult, typeName) => {
    if (!isEmptyString(typeNameResult)) return typeNameResult; // already found type
    if (typeToChecker[typeName](response)) return typeName; // just found the type
    return ''; // no type found yet
  }, '');

  if (isEmptyString(res)) res = null;
  return res;
};

const getHandler = (response) => {
  const type = getType(response);
  if (!isDefined(type)) return null;
  return typeToHandler[type];
};

let lastResponse = null;
const saveLastResponse = (r) => {
  if (!isDefined(r)) return;

  lastResponse = {
    ...lastResponse,
    ...r,
  };
};

const isAvailable = () => true;
let initialized = false;
const initializationDone = () => (initialized = true);
const hasAlreadyBeenInitialized = () => initialized === true;

const startPolling = () => {
  clearInterval(interval);
  interval = setInterval(() => {
    if (!isDefined(lastResponse)) return;
    api.poll(lastResponse).then((pollResponse) => {
      saveLastResponse(pollResponse);
      const handler = getHandler(pollResponse);
      const dataMessage = recursiveBase64DecodeString(pollResponse);
      if (isDefined(handler)) handler(dataMessage);
      else console.warn('received response but no handler', dataMessage);
    });
  }, INTERVAL_MS);
};

export default function useDyduPolling() {
  const [intervalId, setIntervalId] = useState(null);

  const isRunning = useMemo(() => isDefined(intervalId), [intervalId]);
  const isConnected = useMemo(() => isRunning, [isRunning]);

  useEffect(() => () => stopPolling(), []);

  const promiseInit = useCallback((initialData) => {
    return new Promise((resolve, reject) => {
      saveConfiguration(initialData);
      saveLastResponse(initialData);
      initializationDone();
      resolve(true);
    });
  }, []);

  const open = useCallback((initialData) => {
    return new Promise((resolve, reject) => {
      if (hasAlreadyBeenInitialized()) resolve(true);
      promiseInit(initialData).then(startPolling);
      resolve(true);
    });
  }, []);

  const sendSurvey = useCallback((surveyUserAnswer) => {
    api.sendSurveyPolling(surveyUserAnswer, { solutionUsed: SOLUTION_TYPE.livechat });
  }, []);

  const send = useCallback((userInput) => {
    return api.talk(userInput, { solutionUsed: SOLUTION_TYPE.livechat });
  }, []);

  const onUserTyping = useCallback((userInput) => {
    //const payload = LivechatPayload.create.userTypingMessage(userInput);
    api.typing(userInput);
  }, []);

  return {
    isConnected,
    isRunning,
    isAvailable,
    mode: TUNNEL_MODE.polling,
    open,
    send,
    sendSurvey,
    close,
    onUserTyping,
  };
}
