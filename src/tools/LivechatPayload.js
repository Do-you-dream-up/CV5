/* eslint-disable */

import { ATRIA_TYPE_RESPONSE, LIVECHAT_NOTIFICATION, RESPONSE_SPECIAL_ACTION, SOLUTION_TYPE } from './constants';
import {
  b64encode,
  browserName,
  isDefined,
  isEmptyString,
  isOfTypeString,
  osName,
  recursiveBase64EncodeString,
} from './helpers';

import { Local } from './storage';
import dydu from './dydu';

let PAYLOAD_COMMON_CONTENT = {
  contextId: null,
  botId: null,
  space: null,
  clientId: null,
  language: null,
  solutionUsed: SOLUTION_TYPE.assistant,
  userUrl: window.location.href,
  browser: browserName(),
  os: osName(),
  saml2_info: Local.saml.load(),
};

export const getPayloadCommonContentBase64Encoded = () => {
  return Object.keys(PAYLOAD_COMMON_CONTENT).reduce((mapRes, key) => {
    const val = PAYLOAD_COMMON_CONTENT[key];
    mapRes[key] = isOfTypeString(val) ? b64encode(val) : val;
    return mapRes;
  }, {});
};

const nowTime = () => new Date().getTime();

export const REQUEST_TYPE = {
  getContext: 'getContext',
  addInternautEvent: 'addInternautEvent',
  talk: 'talk',
  survey: 'survey',
  surveyConfiguration: 'surveyConfiguration',
  typing: 'typing',
  history: 'history',
  topKnowledge: 'topknowledge',
};

export const LivechatPayloadCreator = {
  surveyConfigurationMessage: (surveyId) => {
    return {
      type: REQUEST_TYPE.surveyConfiguration,
      parameters: {
        ...getPayloadCommonContentBase64Encoded(),
        surveyId: b64encode(surveyId),
      },
    };
  },
  surveyAnswerMessage: (surveyAnswer) => {
    const fields = recursiveBase64EncodeString(surveyAnswer.fields);
    return {
      type: REQUEST_TYPE.survey,
      parameters: {
        ...getPayloadCommonContentBase64Encoded(),
        surveyId: b64encode(surveyAnswer.surveyId),
        operator: Local.operator.load() && b64encode(Local.operator.load()),
        interactionSurveyAnswer: surveyAnswer.interactionSurvey,
        fields,
      },
    };
  },
  userTypingMessage: (userInput = '') => ({
    type: REQUEST_TYPE.typing,
    parameters: {
      ...getPayloadCommonContentBase64Encoded(),
      typing: !isEmptyString(userInput),
      content: b64encode(userInput),
    },
  }),

  talkMessage: (userInput = '', options) => {
    const extraParameters =
      options &&
      Object.keys(options).reduce((acc, key) => {
        acc[`${key}`] = btoa(options[key]);
        return acc;
      }, {});
    return {
      type: REQUEST_TYPE.talk,
      parameters: {
        ...getPayloadCommonContentBase64Encoded(),
        userInput: b64encode(userInput),
        alreadyCame: dydu.alreadyCame(),
        contextType: b64encode('Web'),
        qualificationMode: dydu.qualificationMode,
        doNotRegisterInteraction: options?.doNotRegisterInteraction || false,
        useServerCookieForContext: false,
        disableLanguageDetection: true,
        timestamp: nowTime(),
        ...(extraParameters && {
          extraParameters: extraParameters,
        }),
      },
    };
  },

  historyMessage: () => {
    const contextId = localStorage.getItem('dydu.context');

    return {
      type: REQUEST_TYPE.history,
      parameters: {
        ...getPayloadCommonContentBase64Encoded(),
        dialog: b64encode(contextId),
        useServerCookieForContext: false,
        timestamp: nowTime(),
      },
    };
  },

  topKnowledgeMessage: (period, size) => {
    return {
      type: REQUEST_TYPE.topKnowledge,
      parameters: {
        ...getPayloadCommonContentBase64Encoded(),
        maxKnowledge: b64encode(size),
        period: b64encode(period),
      },
    };
  },
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
  historyResponse: (payload) => {
    return payload?.type?.equals('historyResponse');
  },
  topKnowledgeResponse: (payload) => {
    return payload?.type?.equals('topKnowledgeResponse');
  },
  surveyConfigurationResponse: (payload) => {
    return payload?.type?.equals('surveyConfigurationResponse');
  },
  startLivechat: (payload) => {
    const payloadValues = payload?.values || payload;
    return (
      payloadValues?.specialAction?.fromBase64()?.equals(RESPONSE_SPECIAL_ACTION.startPolling) ||
      payloadValues?.typeResponse?.fromBase64()?.equals(ATRIA_TYPE_RESPONSE.dmLivechatConnectionSucceed)
    );
  },
  endPolling: (payload) => {
    const payloadValues = payload?.values || payload;
    return (
      payloadValues?.typeResponse?.fromBase64()?.equals(ATRIA_TYPE_RESPONSE.naAutoCloseDialog) ||
      payloadValues?.typeResponse?.fromBase64()?.equals(ATRIA_TYPE_RESPONSE.naAutoCloseDialogBecauseUserLeft) ||
      payloadValues?.typeResponse?.fromBase64()?.equals(ATRIA_TYPE_RESPONSE.opLivechatEndByOperator) ||
      payloadValues?.specialAction?.fromBase64()?.equals(RESPONSE_SPECIAL_ACTION.endPolling)
    );
  },
  dialogPicked: (payload) => {
    return payload?.values?.code?.fromBase64()?.equals(LIVECHAT_NOTIFICATION.dialogPicked);
  },
  leaveWaitingQueue: (payload) => {
    const payloadValues = payload?.values || payload;
    return (
      payloadValues?.typeResponse?.fromBase64()?.equals(ATRIA_TYPE_RESPONSE.dMLiveChatLeaveQueue) ||
      payloadValues?.specialAction?.fromBase64()?.equals(RESPONSE_SPECIAL_ACTION.endPolling) ||
      payloadValues?.specialAction?.fromBase64()?.equals(RESPONSE_SPECIAL_ACTION.leaveWaitingQueue)
    );
  },
  startWaitingQueue: (payload) => {
    const payloadValues = payload?.values || payload;
    return payloadValues?.specialAction?.fromBase64()?.equals(RESPONSE_SPECIAL_ACTION.startWaitingQueue);
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
