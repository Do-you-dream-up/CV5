/* eslint-disable */
import Poller from '../../Poller';
import {
  getPollId,
  handleResponse,
  pollingState,
  postStopAction,
  saveResponse,
  shouldStopPolling,
} from './polling-helpers';
import { RESPONSE_SPECIAL_ACTION } from './polling-constant';

let pollerInstance = new Poller();

const StartPolling = (dyduApi, initialResponse) => {
  if (pollerInstance.isRunning()) return;
  saveResponse(initialResponse);

  pollerInstance
    .configure({
      conditionStart: () => true, // start immediatelly
      conditionStop: (response) => shouldStopPolling(response),
      postStopAction: postStopAction,
      timeoutMs: pollingState.timeoutMs,
      serverRequestAction: () => {
        const id = getPollId();
        return dyduApi.poll(id);
      },
      onResponse: (response) => {
        handleResponse(response);
        saveResponse(response);
      },
      onResponseError: (error) => {
        console.error('ERROR fetching', error);
      },
    })
    .run();
};

StartPolling.specialActionName = RESPONSE_SPECIAL_ACTION.startPolling;

// this is to be set externally
StartPolling.options = {
  displayResponse: null,
  displayStatus: null,
};

export default StartPolling;
