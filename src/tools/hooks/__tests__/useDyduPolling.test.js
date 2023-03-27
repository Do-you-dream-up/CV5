import '../../../tools/prototypes/strings';

import useDyduPolling, {
  RESPONSE_TYPE,
  getHandler,
  getType,
  saveConfiguration,
  typeToChecker,
  typeToHandler,
} from '../useDyduPolling';

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

  describe('typeToHandler', () => {
    test('should display response text for message type', () => {
      const mockDisplayResponse = jest.fn();

      saveConfiguration({ displayResponseText: mockDisplayResponse });
      const response = { type: 'message', text: 'Hello world!' };
      const handler = typeToHandler[response.type];
      handler(response);
      expect(mockDisplayResponse).toHaveBeenCalledWith(response.text);
    });

    test('should call handleSurvey function for operatorSendSurvey type', () => {
      saveConfiguration({
        handleSurvey: mockHandleSurvey,
        displayNotification: mockDisplayNotification,
        endLivechat: mockOnEndLivechat,
      });
      const response = { type: 'notification', typeResponse: 'TkFBdXRvQ2xvc2VEaWFsb2c=' };
      const handler = typeToHandler[response.type];
      handler(response);
      setTimeout(() => {
        expect(mockHandleSurvey).toHaveBeenCalled();
      }, 500);
    });
  });

  describe('getType', () => {
    test('should return "notification" for a notification response', () => {
      const response = { typeResponse: 'TkFBdXRvQ2xvc2VEaWFsb2c=' }; // "NAAutoCloseDialog" in base64
      const type = getType(response);
      expect(type).toEqual('notification');
    });

    test('should return "message" for a message response', () => {
      const response = { text: 'Hello world!', fromDetail: 'user' };
      const type = getType(response);
      expect(type).toEqual('message');
    });

    test('should return null for an unknown response', () => {
      const response = {};
      const type = getType(response);
      expect(type).toBeNull();
    });
  });

  describe('getHandler', () => {
    it('should return a function for a message response', () => {
      const response = { text: 'Hello', fromDetail: 'Bot' };
      const handler = getHandler(response);
      expect(typeof handler).toBe('function');
    });

    it('should return a function for a notification response', () => {
      const response = { code: '101', typeResponse: 'TkFBdXRvQ2xvc2VEaWFsb2c=' };
      const handler = getHandler(response);
      expect(typeof handler).toBe('function');
    });

    it('should return null for an invalid response', () => {
      const response = { foo: 'bar' };
      const handler = getHandler(response);
      expect(handler).toBeNull();
    });
  });

  describe('sendSurvey', () => {
    let apiMock, handleSurveyMock;

    beforeEach(() => {
      apiMock = {
        poll: jest.fn(),
        talk: jest.fn(),
        typing: jest.fn(),
        sendSurveyPolling: jest.fn(),
      };
      handleSurveyMock = jest.fn();

      saveConfiguration({
        api: apiMock,
        showAnimationOperatorWriting: jest.fn(),
        displayResponseText: jest.fn(),
        displayNotification: jest.fn(),
        endLivechat: jest.fn(),
        handleSurvey: jest.fn(),
      });
    });

    it('should call api.sendSurveyPolling when sendSurvey is called', () => {
      // Arrange
      const { result } = renderHook(() => useDyduPolling());

      result.current.api = apiMock;
      result.current.handleSurvey = handleSurveyMock;
      result.current.sendSurvey('yes');

      // Assert
      expect(apiMock.sendSurveyPolling).toHaveBeenCalledWith('yes', { solutionUsed: 'LIVECHAT' });
    });
  });
});
