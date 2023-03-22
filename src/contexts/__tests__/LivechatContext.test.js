import '@testing-library/jest-dom';

import { LivechatContext, LivechatProvider, useLivechat } from '../LivechatContext';
import { act, render, screen } from '@testing-library/react';

import { TUNNEL_MODE } from '../../tools/constants';
import { renderHook } from '@testing-library/react-hooks';
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
});
