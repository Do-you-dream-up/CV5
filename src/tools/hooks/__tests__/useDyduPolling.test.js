import { act, renderHook } from '@testing-library/react-hooks';
import useDyduPolling, { RESPONSE_TYPE, saveConfiguration, typeToChecker, typeToHandler } from '../useDyduPolling';

import React from 'react';
import { render } from '@testing-library/react';

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
  describe('typeToChecker', () => {
    test.each(Object.values(RESPONSE_TYPE))(
      'should return false for %p response type if response is undefined',
      (type) => {
        // Arrange
        const response = undefined;

        // Act
        const result = typeToChecker[type](response);

        // Assert
        expect(result).toBe(false);
      },
    );

    test.each(Object.values(RESPONSE_TYPE))(
      'should return false for %p response type if response.text is undefined',
      (type) => {
        // Arrange
        const response = { fromDetail: 'John Doe' };

        // Act
        const result = typeToChecker[type](response);

        // Assert
        expect(result).toBe(false);
      },
    );

    test.each(Object.values(RESPONSE_TYPE))(
      'should return false for %p response type if response.fromDetail is undefined',
      (type) => {
        // Arrange
        const response = { text: 'Hello' };

        // Act
        const result = typeToChecker[type](response);

        // Assert
        expect(result).toBe(false);
      },
    );
    test('should return true for a valid message response', () => {
      const response = {
        text: 'Hello, world!',
        fromDetail: 'user',
      };
      expect(typeToChecker.message(response)).toBe(true);
    });

    test('should return false for an invalid message response', () => {
      const response = {
        text: '',
        fromDetail: 'user',
      };
      setTimeout(() => {
        expect(typeToChecker.message(response)).toBe(false);
      }, 500);
    });

    test('should return true for a valid notification response', () => {
      const response = {
        code: '123',
        typeResponse: 'TkFBdXRvQ2xvc2VEaWFsb2c=',
      };
      expect(typeToChecker.notification(response)).toBe(true);
    });

    test('should return false for an invalid notification response', () => {
      const response = {
        typeResponse: 'invalidTypeResponse',
      };
      setTimeout(() => {
        expect(typeToChecker.notification(response)).toBe(false);
      }, 500);
    });
  });
});
