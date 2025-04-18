// As defined in astro -> ConsultationSpaceMg::DEFAULT
export const DEFAULT_CONSULTATION_SPACE = 'Defaut';

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
  carousel_array: 'dydu_carousel_array',
  product: 'dydu_product_001',
  quickReply: 'dydu_quick_reply_001',
  uploadFile: 'dydu_upload_001',
};

export const knownTemplates = Object.values(INTERACTION_TEMPLATE);

export const INTERACTION_TYPE = {
  request: 'request',
  response: 'response',
  notification: 'notification',
};

export const ATRIA_TYPE_RESPONSE = {
  dmLivechatConnectionSucceed: 'DMLiveChatConnectionSucceed',
  dmLiveChatConnectionInQueue: 'DMLiveChatConnectionInQueue',
  dmLiveChatLeaveQueue: 'DMLiveChatLeaveQueue',
  naAutoCloseDialog: 'NAAutoCloseDialog',
  naAutoCloseDialogBecauseUserLeft: 'NAAutoCloseDialogBecauseUserLeft',
  opLivechatEndByOperator: 'OPLiveChatEndByOperator',
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
  waitingQueue: 'waitingQueue',
  leaveWaitingQueue: 'leaveWaitingQueue',
  dmLiveChatConnectionInQueue: 'DMLiveChatConnectionInQueue',
};

export const RESPONSE_SPECIAL_ACTION = {
  startPolling: 'StartPolling',
  endPolling: 'EndPolling',
  startWaitingQueue: 'StartWaitingQueue',
  leaveWaitingQueue: 'LeaveWaitingQueue',
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
  dialogAddedOperatorPanel: 'DialogAddedOperatorPanel',
};

export const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;

export const CHATBOX_EVENT_NAME = {
  newMessage: 'dydu/event__newMessage',
  closeSidebar: 'dydu/event__closeSidebar',
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

export const COLOR_RGAA = {
  error: '#CD4242',
  success: '#1A7451',
};

export const ALLOWED_FORMAT = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/svg+xml',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.presentation',
  'application/x-log',
  'application/log',
  'text/x-log',
  'text/csv',
  'text/plain',
  'text/log',
];

// from Atria EQuestionType enum
export const E_QUESTION_TYPE = {
  redirection: 'redirection',
  redirection_newpage: 'redirection_newpage',
  redirection_invalidlink: 'redirection_invalidlink',
};
