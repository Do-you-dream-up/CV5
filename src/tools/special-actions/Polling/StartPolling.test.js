import StartPolling from './StartPolling';
import { RESPONSE_SPECIAL_ACTION } from './polling-constant';

describe('StartPolling', () => {
  it('should have a static field named |specialActionName|', function () {
    expect(StartPolling.specialActionName).toBe(RESPONSE_SPECIAL_ACTION.startPolling);
  });
  it('should have a static field named |options|', function () {
    expect(StartPolling.options).toBeDefined();
  });
  it('should have a static field named |options| with specific fields', function () {
    const optionType = {
      displayResponse: null,
      displayStatus: null,
    };
    expect(StartPolling.options).toEqual(optionType);
  });
});
