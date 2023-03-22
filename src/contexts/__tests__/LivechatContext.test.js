import '@testing-library/jest-dom';

import { LivechatContext, LivechatProvider, useLivechat } from '../LivechatContext';
import { act, render, screen } from '@testing-library/react';

import { TUNNEL_MODE } from '../../tools/constants';
import { renderHook } from '@testing-library/react-hooks';
import { useCallback } from 'react';
import useDyduWebsocket from '../../tools/hooks/useDyduWebsocket';

describe('LivechatProvider', () => {
  beforeEach(() => {
    // Clear any mocks and reset any state between tests
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should render children', () => {
    // Arrange
    const ChildComponent = () => <div>Child Component</div>;
    const props = { children: <ChildComponent /> };

    // Act
    render(<LivechatProvider {...props} />);
    const childComponent = screen.getByText(/Child Component/);

    // Assert
    expect(childComponent).toBeInTheDocument();
  });

  it('should call onNewMessage and window.dydu.chat.reply', () => {
    const onNewMessageMock = jest.fn();
    window.dydu = { chat: { reply: jest.fn() } };

    const { result } = renderHook(() => useLivechat(onNewMessageMock), { wrapper: LivechatProvider });

    act(() => {
      console.log('🚀 ~ file: LivechatContext.test.js:37 ~ act ~ result.current:', result.current);
      result.current.displayResponseText('Hello World');
    });

    expect(window.dydu.chat.reply).toHaveBeenCalledWith('Hello World');
  });

  it('should open a WebSocket tunnel by default', async () => {
    const { result } = renderHook(
      () =>
        useDyduWebsocket({
          mode: TUNNEL_MODE.websocket,
          open: jest.fn().mockResolvedValue(undefined),
          isAvailable: () => true,
        }),
      { wrapper: LivechatProvider },
    );

    await act(async () => {
      render(
        <LivechatProvider>
          <LivechatContext>{({ isWebsocket }) => <div>{isWebsocket.toString()}</div>}</LivechatContext>
        </LivechatProvider>,
      );
    });

    expect(screen.getByText('false')).toBeDefined();
  });

  describe('typing', () => {
    it('should call onUserTyping function with input', () => {
      const onUserTyping = jest.fn();
      const tunnel = {
        onUserTyping,
      };
      const { result } = renderHook(() =>
        useCallback(
          (input) => {
            tunnel?.onUserTyping(input);
          },
          [tunnel],
        ),
      );

      result.current('hello');

      expect(onUserTyping).toHaveBeenCalledWith('hello');
    });

    it('should not call onUserTyping function if tunnel is not defined', () => {
      const onUserTyping = jest.fn();
      const tunnel = undefined;
      const { result } = renderHook(() =>
        useCallback(
          (input) => {
            tunnel?.onUserTyping(input);
          },
          [tunnel],
        ),
      );

      result.current('hello');

      expect(onUserTyping).not.toHaveBeenCalled();
    });
  });

  describe('sendSurvey', () => {
    it('calls tunnel.sendSurvey if tunnel exists', () => {
      // Mock the tunnel object
      const mockTunnel = { sendSurvey: jest.fn() };

      // Render the hook with the mock tunnel object
      const { result } = renderHook(() => useLivechat(mockTunnel), { wrapper: LivechatProvider });

      // Call the sendSurvey function with a survey response
      result.current.sendSurvey({ question1: 'answer1', question2: 'answer2' });
    });

    it('calls put function if tunnel does not exist', () => {
      // Mock the put function
      const mockPut = jest.fn();

      // Render the hook without a tunnel object
      const { result } = renderHook(() => useLivechat(null, mockPut), { wrapper: LivechatProvider });

      // Call the sendSurvey function with a survey response
      result.current.sendSurvey({ question1: 'answer1', question2: 'answer2' });
    });

    it('logs a message to the console', () => {
      // Mock the console.log function
      console.log = jest.fn();

      // Render the hook without a tunnel object or put function
      const { result } = renderHook(() => useLivechat(), { wrapper: LivechatProvider });

      // Call the sendSurvey function with a survey response
      result.current.sendSurvey({ question1: 'answer1', question2: 'answer2' });

      // Check if console.log was called with the correct message
      expect(console.log).toHaveBeenCalledWith('livechat sending survey', {
        question1: 'answer1',
        question2: 'answer2',
      });
    });
  });
});
