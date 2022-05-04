/* eslint-disable */
import { browserName, isOfTypeString, osName } from './helpers';

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

const getPayloadCommonContentBase64Encoded = () => {
  return Object.keys(PAYLOAD_COMMON_CONTENT).reduce((mapRes, key) => {
    const val = PAYLOAD_COMMON_CONTENT[key];
    mapRes[key] = isOfTypeString(val) ? val.toBase64() : val;
    return mapRes;
  }, {});
};

const nowTime = () => new Date().getTime();

const LivechatPayloadCreator = {
  talkMessage: (userInput) => ({
    type: 'talk',
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
      userInput: userInput.toBase64(),
    },
  }),

  getContextMessage: () => ({
    type: 'getContext',
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
    type: 'addInternautEvent',
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
  operatorAutomaticallyTransferredDialog: (payload) => {
    return (
      payload?.type.equals('notification') &&
      payload?.values?.code?.fromBase64()?.equals('DialogTransferredAutomatically')
    );
  },
  operatorManuallyTransferredDialog: (payload) => {
    return (
      payload?.type.equals('notification') && payload?.values?.code?.fromBase64()?.equals('DialogTransferredManually')
    );
  },
  operatorDisconnected: (payload) => {
    return payload?.type.equals('notification') && payload?.values?.code?.fromBase64()?.equals('OperatorDisconnected');
  },
  operatorConnected: (payload) => {
    return payload?.type.equals('notification') && payload?.values?.code?.fromBase64()?.equals('OperatorConnected');
  },
  operatorBusy: (payload) => {
    return payload?.type.equals('notification') && payload?.values?.code?.fromBase64()?.equals('OperatorBusy');
  },
  startLivechat: (payload) => {
    return payload?.specialAction?.fromBase64()?.equals('StartPolling');
  },
  timeout: (payload) => {
    return payload?.type?.equals('payload') && payload?.values?.code?.fromBase64().equals('AlmostTimedOut');
  },
  operatorWriting: (payload) => {
    return payload?.type?.equals('notification') && payload?.values?.code?.fromBase64().equals('OperatorWritingStatus');
  },
  getContextResponse: (payload) => {
    return payload?.type?.equals('getContextResponse');
  },
  endPolling: (payload) => {
    return (
      payload?.values?.specialAction?.fromBase64().equals('EndPolling') ||
      (payload?.type?.equals('notification') && payload?.values?.code?.fromBase64().equals('OnOperatorCloseDialog'))
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

/*
ON USER TYPING

{
  type: "typing"
  parameters: {
    botId: "MjNmNWU0YzYtNzNlNC00OTEyLWFkMzctNjU4YWFlNTE1NjA5"
    clientId: "aktuWFRwZ1ZQWkxpT2p2"
    content: "Y291"
    contextId: "MTBkMjczYTYtYzQwMi00OThlLWI4OTItZjkwOTI4YjA5MmNm"
    language: "ZnI="
    qualificationMode: true
    saml2_info: ""
    solutionUsed: "TElWRUNIQVQ="
    space: "RGVmYXV0"
    timestamp: 1649837362363
    typing: true
    useServerCookieForContext: false
  }
}
 */

/*
ALMOST TIMEOUT NOTIFICATION

type: "notification"
values: {
  code: "QWxtb3N0VGltZWRPdXQ=" ===> "AlmostTimedOut"
  contextId: "MTBkMjczYTYtYzQwMi00OThlLWI4OTItZjkwOTI4YjA5MmNm"
  serverTime: 1649837945392
  text: null
}
*/
