/* eslint-disable */

import { SOLUTION_TYPE, TUNNEL_MODE } from '../constants';
import { isDefined, recursiveBase64DecodeString } from '../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dydu from '../dydu';

import LivechatPayload from '../LivechatPayload';
import { Local } from '../storage';

let endLivechatAndCloseTunnel = null;
let addNewMessageAndNotificationOrResponse = null;
let decodeAndDisplayNotification = null;
let showAnimationOperatorWriting = null;
let getSurveyConfiguration = null;
let showUploadFileButton = null;

export const linkToLivechatFunctions = (livechatContextFunctions) => {
  endLivechatAndCloseTunnel = livechatContextFunctions.endLivechatAndCloseTunnel;
  addNewMessageAndNotificationOrResponse = livechatContextFunctions.addNewMessageAndNotificationOrResponse;
  decodeAndDisplayNotification = livechatContextFunctions.decodeAndDisplayNotification;
  showAnimationOperatorWriting = livechatContextFunctions.showAnimationOperatorWriting;
  getSurveyConfiguration = livechatContextFunctions.getSurveyConfiguration;
  showUploadFileButton = livechatContextFunctions.showUploadFileButton;
};

const INTERVAL_MS = 2500;

let interval;
let initialized = false;

const stopPolling = () => {
  clearInterval(interval);
  interval = null;
  initialized = false;
};

const responseToLivechatPayload = (r) => ({
  ...r,
  values: { ...r },
});

const sendNotificationOrMessage = (response) => {
  if (isDefined(response) && isDefined(response?.text) && isDefined(response?.fromDetail)) {
    addNewMessageAndNotificationOrResponse(response);
  } else if (
    isDefined(response?.code) ||
    (isDefined(response?.typeResponse) && response?.typeResponse?.fromBase64()?.equals('NAAutoCloseDialog'))
  ) {
    const notification = responseToLivechatPayload(response);

    notification.type = 'notification';

    if (LivechatPayload.is.operatorWriting(notification)) return showAnimationOperatorWriting();
    if (LivechatPayload.is.operatorSendSurvey(notification)) return getSurveyConfiguration(notification);
    if (LivechatPayload.is.operatorSendUploadRequest(notification)) return showUploadFileButton();

    decodeAndDisplayNotification(notification);

    if (LivechatPayload.is.endPolling(notification)) {
      stopPolling();
      endLivechatAndCloseTunnel();
    }
  }
};

export default function useDyduPolling() {
  const [intervalId, setIntervalId] = useState(null);
  let lastResponse = null;

  const setLastPollingResponse = (newLastResponse) => {
    lastResponse = newLastResponse;
  };

  const isRunning = useMemo(() => isDefined(intervalId), [intervalId]);

  useEffect(() => () => stopPolling(), []);

  const startPolling = () => {
    clearInterval(interval);
    interval = setInterval(() => {
      if (!isDefined(lastResponse)) {
        return;
      }
      dydu
        .poll(lastResponse)
        .then((pollResponse) => {
          if (pollResponse?.pollUpdatedInteractionDate) {
            setLastPollingResponse(pollResponse);
          }
          sendNotificationOrMessage(recursiveBase64DecodeString(pollResponse));
        })
        .catch((error) => {
          interval.console.error('Error polling ', error);
          Local.livechatType.remove();
          clearInterval(interval);
        });
    }, INTERVAL_MS);
  };

  const open = (livechatContextFunctions) => {
    return new Promise((resolve) => {
      if (initialized !== true) {
        linkToLivechatFunctions(livechatContextFunctions);
        startPolling();
        initialized = true;
      }
      resolve(true);
    });
  };

  const closeLivechatIfEndSurveyClosed = () => {
  };

  const sendSurvey = useCallback((surveyUserAnswer) => {
    dydu.sendSurveyPolling(surveyUserAnswer, { solutionUsed: SOLUTION_TYPE.livechat });
  }, []);

  const send = useCallback((userInput) => {
    return dydu.talk(userInput, { solutionUsed: SOLUTION_TYPE.livechat });
  }, []);

  const onUserTyping = useCallback((userInput) => {
    dydu.typing(userInput);
  }, []);

  const onUserReading = useCallback(() => {
    dydu.reading();
  }, []);

  const close = useCallback(() => {
    setIntervalId(null);
    if (isRunning && endLivechatAndCloseTunnel) endLivechatAndCloseTunnel();
  }, []);

  return {
    isAvailable: () => true,
    mode: TUNNEL_MODE.polling,
    open,
    send,
    sendSurvey,
    close,
    onUserTyping,
    onUserReading,
    setLastPollingResponse,
    closeLivechatIfEndSurveyClosed,
  };
}
