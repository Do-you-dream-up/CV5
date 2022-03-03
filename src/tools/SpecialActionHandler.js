import { isDefined } from './helpers';
import StartPolling from './special-actions/Polling/StartPolling';

const extractActionName = (data) => data?.specialAction || data?.type;
const getActionFnByName = (actionName) => ActionHandler.SPECIAL_ACTION_NAME_MAPPING_FUNCTION[actionName];

export default class ActionHandler {
  static processIfContainsAction = (dyduApi, httpResponse) => {
    const action = getActionFnByName(extractActionName(httpResponse));
    if (isDefined(action)) action(dyduApi, httpResponse);
  };

  static SPECIAL_ACTION_NAME_MAPPING_FUNCTION = {
    [StartPolling.specialActionName]: StartPolling,
  };
}
