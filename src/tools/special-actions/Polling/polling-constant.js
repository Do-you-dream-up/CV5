export const RESPONSE_SPECIAL_ACTION = {
  startPolling: 'StartPolling',
  endPolling: 'EndPolling',
};

export const POLLING = {
  dialogPicked: 'DialogPicked',
  TYPE_RESPONSE: {
    operatorAnswer: 'OPRegularOperatorAnswer',
    operatorWritingsStatus: 'OperatorWritingStatus',
    invalidRequest: 'ERRInvalidRequest',
    waintingForOperator: 'NAWaitingForOperator',
  },
};

export const RESPONSE_TYPE = {
  message: 'message',
  status: 'status',
  specialAction: 'specialAction',
};
