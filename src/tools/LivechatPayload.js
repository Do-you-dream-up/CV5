/* eslint-disable */

import { LIVECHAT_NOTIFICATION, RESPONSE_SPECIAL_ACTION } from './constants';
import {
  browserName,
  isDefined,
  isEmptyString,
  isOfTypeString,
  osName,
  recursiveBase64DecodeString,
  recursiveBase64EncodeString,
} from './helpers';

let PAYLOAD_COMMON_CONTENT = {
  contextId: null,
  botId: null,
  space: null,
  clientId: null,
  language: null,
  userUrl: window.location.href,
  browser: browserName(),
  os: osName(),
};

export const getPayloadCommonContentBase64Encoded = () => {
  return Object.keys(PAYLOAD_COMMON_CONTENT).reduce((mapRes, key) => {
    const val = PAYLOAD_COMMON_CONTENT[key];
    mapRes[key] = isOfTypeString(val) ? val.toBase64() : val;
    return mapRes;
  }, {});
};

const nowTime = () => new Date().getTime();

export const REQUEST_TYPE = {
  getContext: 'getContext',
  addInternautEvent: 'addInternautEvent',
  talk: 'talk',
  survey: 'survey',
  typing: 'typing',
};

export const LivechatPayloadCreator = {
  surveyAnswerMessage: (surveyAnswer) => {
    const fields = recursiveBase64EncodeString(surveyAnswer.fields);
    return {
      type: REQUEST_TYPE.survey,
      parameters: {
        ...getPayloadCommonContentBase64Encoded(),
        surveyId: surveyAnswer.surveyId,
        interactionSurveyAnswer: surveyAnswer.interactionSurvey,
        fields,
      },
    };
  },
  userTypingMessage: (userInput = '') => ({
    type: REQUEST_TYPE.typing,
    parameters: {
      typing: !isEmptyString(userInput),
      ...getPayloadCommonContentBase64Encoded(),
      content: userInput?.toBase64(),
      alreadyCame: true,
      contextType: 'V2Vi',
      disableLanguageDetection: true,
      mode: 'U3luY2hyb24=',
      pureLivechat: false,
      qualificationMode: true,
      saml2_info: '',
      solutionUsed: 'QVNTSVNUQU5U',
      templateFormats: '',
      timestamp: nowTime(),
      useServerCookieForContext: false,
    },
  }),

  talkMessage: (userInput = '') => ({
    type: REQUEST_TYPE.talk,
    parameters: {
      ...getPayloadCommonContentBase64Encoded(),
      alreadyCame: true,
      contextType: 'V2Vi',
      disableLanguageDetection: true,
      mode: 'U3luY2hyb24=',
      pureLivechat: false,
      qualificationMode: true,
      saml2_info: '',
      solutionUsed: 'QVNTSVNUQU5U',
      templateFormats: '',
      timestamp: nowTime(),
      useServerCookieForContext: false,
      userInput: userInput?.toBase64(),
    },
  }),

  getContextMessage: () => ({
    type: REQUEST_TYPE.getContext,
    parameters: {
      ...getPayloadCommonContentBase64Encoded(),
      alreadyCame: false,
      browser: 'Chrome 100'.toBase64(),
      contextType: 'Web'.toBase64(),
      disableLanguageDetection: true,
      mode: 'Synchron'.toBase64(),
      os: 'Linux x86_64'.toBase64(),
      pureLivechat: false,
      qualificationMode: true,
      saml2_info: '',
      solutionUsed: 'ASSISTANT'.toBase64(),
      timestamp: nowTime(),
      useServerCookieForContext: false,
      userUrl: window.location.href,
    },
  }),

  internautEventMessage: () => ({
    type: REQUEST_TYPE.addInternautEvent,
    parameters: {
      ...getPayloadCommonContentBase64Encoded(),
      eventName: 'ZGlhbG9nX3N0YXJ0',
      eventValue: getPayloadCommonContentBase64Encoded()?.contextId,
      qualificationMode: true,
      saml2_info: '',
      solutionUsed: 'QVNTSVNUQU5U',
      timestamp: nowTime(),
      useServerCookieForContext: false,
    },
  }),
};

const LivechatPayloadChecker = {
  operatorSendUploadRequest: (payload) => {
    return isDefined(payload.values.code) && payload.values.code.fromBase64()?.equals('UploadRequest');
  },
  operatorSendSurvey: (payload) => {
    return (
      payload?.type?.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals('OperatorSendSurvey') &&
      isDefined(payload?.values?.survey) &&
      !isEmptyString(payload?.values?.survey)
    );
  },
  operatorAutomaticallyTransferredDialog: (payload) => {
    return (
      payload?.type?.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.dialogTransferredAutomatically)
    );
  },
  operatorManuallyTransferredDialog: (payload) => {
    return (
      payload?.type?.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.dialogTransferredManually)
    );
  },
  operatorDisconnected: (payload) => {
    return (
      payload?.type?.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.operatorDisconnected)
    );
  },
  operatorConnected: (payload) => {
    return (
      payload?.type?.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.operactorConnected)
    );
  },
  operatorBusy: (payload) => {
    return (
      payload?.type?.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.operatorBusy)
    );
  },
  startLivechat: (payload) => {
    return payload?.specialAction?.fromBase64()?.equals('StartPolling');
  },
  timeout: (payload) => {
    return (
      payload?.type?.equals('payload') &&
      payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.almostTimeout)
    );
  },
  operatorWriting: (payload) => {
    return (
      payload?.type?.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.operatorWriting)
    );
  },
  getContextResponse: (payload) => {
    return payload?.type?.equals('getContextResponse');
  },
  endPolling: (payload) => {
    return (
      payload?.values?.typeResponse?.fromBase64()?.equals('NAAutoCloseDialog') ||
      payload?.values?.specialAction?.fromBase64()?.equals(RESPONSE_SPECIAL_ACTION.endPolling) ||
      (payload?.type?.equals('notification') && payload?.values?.code?.fromBase64()?.equals('OnOperatorCloseDialog'))
    );
  },
};

const LivechatPayload = {
  create: Object.create(LivechatPayloadCreator),
  is: Object.create(LivechatPayloadChecker),
  addPayloadCommonContent: (additionalContent = {}) => {
    PAYLOAD_COMMON_CONTENT = { ...PAYLOAD_COMMON_CONTENT, ...additionalContent };
  },
};

export default LivechatPayload;
