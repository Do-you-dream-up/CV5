import '../../../tools/prototypes/strings';

import useDyduPolling, { linkToLivechatFunctions } from '../useDyduPolling';

import React from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

const mockDisplayResponse = jest.fn();
const mockDisplayNotification = jest.fn();
const mockOnOperatorWriting = jest.fn();
const mockHandleSurvey = jest.fn();
const mockOnEndLivechat = jest.fn();

beforeEach(() => {
  // Reset the mocks before each test
  mockDisplayResponse.mockReset();
  mockDisplayNotification.mockReset();
  mockOnOperatorWriting.mockReset();
  mockHandleSurvey.mockReset();
  mockOnEndLivechat.mockReset();

  jest.clearAllMocks();
});
describe('useDyduPolling', () => {
  it('should save configuration properly', () => {
    const configuration = {
      showAnimationOperatorWriting: true,
      displayResponseText: true,
      displayNotification: true,
      endLivechat: jest.fn(),
      api: {},
      handleSurvey: jest.fn(),
    };
    const TestComponent = () => {
      const { open } = useDyduPolling();

      React.useEffect(() => {
        open(configuration);
      }, [open]);

      return null;
    };

    render(<TestComponent />);

    expect(configuration.endLivechat).not.toHaveBeenCalled();
    expect(configuration.handleSurvey).not.toHaveBeenCalled();
  });
});
