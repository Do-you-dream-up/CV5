export const PAYLOAD_TYPE = {
  survey: 'survey',
};

export const SOLUTION_TYPE = {
  assistant: 'ASSISTANT',
  livechat: 'LIVECHAT',
};

export const FEEDBACK_RESPONSE = {
  positive: 'positive',
  negative: 'negative',
  noResponseGiven: 'withoutAnswer',
};

export const RESPONSE_QUERY_FORMAT = {
  json: 'JSon',
  xml: 'XML',
  jsonDydu: 'JSonDydu',
  vocal: 'Vocal',
  html: 'Html',
};

export const VAR_TYPE = {
  string: 'string',
  object: 'object',
  array: 'array',
  number: 'number',
};

export const TUNNEL_MODE = {
  polling: 'polling',
  websocket: 'websocket',
};

export const LIVECHAT_ID_LISTENER = 'listener/livechat';

export const INTERACTION_TEMPLATE = {
  carousel: 'dydu_carousel_001',
  product: 'dydu_product_001',
  quickReply: 'dydu_quick_reply_001',
};

export const knownTemplates = Object.values(INTERACTION_TEMPLATE);

export const INTERACTION_TYPE = {
  request: 'request',
  response: 'response',
  notification: 'notification',
};

export const INTERACTION_NOTIFICATION_TYPE = {
  dialogTransferredManually: 'dialogTransferredManually',
  operatorDisconnected: 'operatorDisconnected',
  operatorConnected: 'operatorConnected',
  operatorBusy: 'operatorBusy',
  close: 'close',
  wait: 'wait',
  success: 'success',
  timeout: 'timeout',
  writing: 'writing',
  dialogTransferredAutomatically: 'dialogTransferredAutomatically',
};

export const RESPONSE_SPECIAL_ACTION = {
  startPolling: 'StartPolling',
  endPolling: 'EndPolling',
};

export const LIVECHAT_NOTIFICATION = {
  operatorAnswer: 'OPRegularOperatorAnswer',
  operatorWriting: 'OperatorWritingStatus',
  operatorBusy: 'OperatorBusy',
  operactorConnected: 'OperatorConnected',
  operatorDisconnected: 'OperatorDisconnected',
  invalidRequest: 'ERRInvalidRequest',
  waitingForOperator: 'NAWaitingForOperator',
  almostTimeout: 'AlmostTimedOut',
  dialogTransferredManually: 'DialogTransferredManually',
  dialogTransferredAutomatically: 'DialogTransferredAutomatically',
};

export const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;
export const REGEX_URL = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;

export const CHATBOX_EVENT_NAME = {
  newMessage: 'dydu/event__newMessage',
  closeSecondary: 'dydu/event__closeSecondary',
};

export const VIEW_MODE = {
  close: 0, // hidden
  minimize: 1, // teaser
  popin: 2,
  full: 3,
};

export const READ_MORE_CARACTERS_TEXT = {
  readmore: 85,
};
