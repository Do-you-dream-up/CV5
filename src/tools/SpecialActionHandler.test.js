import ActionHandler from './SpecialActionHandler';

const getDyduApi = () => {
  return {
    poll: jest.fn(),
  };
};

describe('SpecialActionHandler', () => {
  it('should call function that match |specialAction| in response', () => {
    // GIVEN
    const actionNameMapFunction = {
      action1: jest.fn(),
      action2: jest.fn(),
    };
    ActionHandler.SPECIAL_ACTION_NAME_MAPPING_FUNCTION = actionNameMapFunction;

    const mockHttpResponse = { specialAction: 'action1' };
    const mockHttpResponse2 = { specialAction: 'action2' };

    // WHEN
    ActionHandler.processIfContainsAction(getDyduApi(), mockHttpResponse);
    ActionHandler.processIfContainsAction(getDyduApi(), mockHttpResponse2);

    // THEN
    expect(actionNameMapFunction.action1).toHaveBeenCalledTimes(1);
    expect(actionNameMapFunction.action2).toHaveBeenCalledTimes(1);
  });

  it('should call function that match |type| in response', () => {
    // GIVEN
    const actionNameMapFunction = {
      action1: jest.fn(),
      action2: jest.fn(),
    };
    ActionHandler.SPECIAL_ACTION_NAME_MAPPING_FUNCTION = actionNameMapFunction;

    const mockHttpResponse = { type: 'action1' };
    const mockHttpResponse2 = { type: 'action2' };

    // WHEN
    ActionHandler.processIfContainsAction(getDyduApi(), mockHttpResponse);
    ActionHandler.processIfContainsAction(getDyduApi(), mockHttpResponse2);

    // THEN
    expect(actionNameMapFunction.action1).toHaveBeenCalledTimes(1);
    expect(actionNameMapFunction.action2).toHaveBeenCalledTimes(1);
  });

  it('should not call function when no |specialAction| in response', () => {
    // GIVEN
    const actionNameMapFunction = {
      action1: jest.fn(),
      action2: jest.fn(),
    };
    ActionHandler.SPECIAL_ACTION_NAME_MAPPING_FUNCTION = actionNameMapFunction;

    const mockHttpResponse = {};

    // WHEN
    ActionHandler.processIfContainsAction(getDyduApi(), mockHttpResponse);

    // THEN
    expect(actionNameMapFunction.action1).not.toBeCalled();
    expect(actionNameMapFunction.action2).not.toBeCalled();
  });
});
