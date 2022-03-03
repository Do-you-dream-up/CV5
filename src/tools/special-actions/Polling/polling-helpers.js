import { b64decode, b64dFields, isDefined } from '../../helpers';
import StartPolling from './StartPolling';
import { RESPONSE_SPECIAL_ACTION, RESPONSE_TYPE } from './polling-constant';

export const POLLING_STATE_INITIAL_VALUE = {
  savedMessage: null,
  savedResponse: null,
  lastDisplayedMessage: null,
  timeoutMs: 2000,
};

export let pollingState = { ...POLLING_STATE_INITIAL_VALUE };

const ResponseTypeChecker = {
  [RESPONSE_TYPE.message]: (response) =>
    isDefined(response) && isDefined(response?.text) && isDefined(response?.fromDetail),
  [RESPONSE_TYPE.status]: (response) => isDefined(response) && isDefined(response?.code) && isDefined(response?.text),
  [RESPONSE_TYPE.specialAction]: (response) => isDefined(response) && isDefined(response?.specialAction),
};

const delayFlushStatusMessage = () => {
  const { displayStatus } = StartPolling.options;
  const emptyStatusMessage = () => displayStatus(null);
  setTimeout(emptyStatusMessage, 1500);
};

export const postStopAction = () => {
  reinitPollingState();
  delayFlushStatusMessage();
};

const reinitPollingState = () => (pollingState = POLLING_STATE_INITIAL_VALUE);

export const getPollId = () => pollingState?.savedResponse?.serverTime;

export const shouldStopPolling = (response) => {
  return (
    response?.livechat === false ||
    (ResponseTypeChecker[RESPONSE_TYPE.specialAction](response) &&
      atob(response?.specialAction) === RESPONSE_SPECIAL_ACTION.endPolling)
  );
};

const canSaveResponse = (r) => isDefined(r?.serverTime);

export const saveResponse = (r) => {
  if (canSaveResponse(r)) pollingState.savedResponse = r;
};

const determinateResponseType = (response) => {
  return Object.keys(ResponseTypeChecker).reduce((typeNameResult, typeName) => {
    return typeNameResult.length > 0 ? typeNameResult : ResponseTypeChecker[typeName](response) ? typeName : '';
  }, '');
};

const extractHumanReadableTextFromResponse = ({ text }) => b64decode(text);

const displayOperatorMessageWithResponse = (response) => {
  const { displayStatus, displayResponse } = StartPolling.options;
  displayStatus(null);
  displayResponse(b64dFields(response, ['text']));
};

const displayStatusWithResponse = (response) => {
  StartPolling.options.displayStatus(extractHumanReadableTextFromResponse(response));
};

const handleSpecialActionWithResponse = () => {};

export const handleResponse = (response) => {
  const type = determinateResponseType(response);
  switch (type) {
    case RESPONSE_TYPE.message:
      return displayOperatorMessageWithResponse(response);

    case RESPONSE_TYPE.status:
      if (shouldStopPolling(response)) return displayOperatorMessageWithResponse(response);
      return displayStatusWithResponse(response);

    case RESPONSE_TYPE.specialAction:
      return handleSpecialActionWithResponse(response);

    default:
      console.info('[response type unknown]: ', type);
  }
};
