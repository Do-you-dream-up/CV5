import { LivechatProvider, useLivechat } from '../LivechatContext';
import { render, screen } from '@testing-library/react';

import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useDialog } from '../DialogContext';
import useDyduPolling from '../../tools/hooks/useDyduPolling';
import useDyduWebsocket from '../../tools/hooks/useDyduWebsocket';
import { useEvent } from '../EventsContext';
import useQueue from '../../tools/hooks/useQueue';
import { useSurvey } from '../../Survey/SurveyProvider';

jest.mock('../../Survey/SurveyProvider');
jest.mock('../DialogContext');
jest.mock('../EventsContext');
jest.mock('../../tools/hooks/useQueue');
jest.mock('../../tools/hooks/useDyduPolling');
jest.mock('../../tools/hooks/useDyduWebsocket');

describe('LivechatProvider', () => {
  window.dydu = {
    chat: {
      reply: jest.fn(),
    },
  };
  beforeEach(() => {
    useSurvey.mockReturnValue({
      showSurvey: jest.fn(),
    });
    useDialog.mockReturnValue({
      lastResponse: {},
      displayNotification: jest.fn(),
      showAnimationOperatorWriting: jest.fn(),
    });
    useEvent.mockReturnValue({
      onNewMessage: jest.fn(),
    });
    useQueue.mockReturnValue({
      pop: jest.fn(),
      put: jest.fn(),
      list: [],
      isEmpty: true,
    });
    useDyduPolling.mockReturnValue({
      mode: 'polling',
      isAvailable: jest.fn(),
      open: jest.fn(),
      send: jest.fn(),
      onUserTyping: jest.fn(),
    });
    useDyduWebsocket.mockReturnValue({
      mode: 'websocket',
      isAvailable: jest.fn(),
      open: jest.fn(),
      send: jest.fn(),
      onUserTyping: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const ChildComponent = () => <div>Child Component</div>;
    render(
      <LivechatProvider>
        <ChildComponent />
      </LivechatProvider>,
    );
    expect(screen.getByText('Child Component')).toBeDefined();
  });

  it('should provide livechat context', () => {
    const ChildComponent = () => {
      const { isWebsocket, send, isLivechatOn, typing, sendSurvey } = useLivechat();
      return (
        <div>
          <span>{isWebsocket.toString()}</span>
          <span>{isLivechatOn.toString()}</span>
          <button onClick={() => send('test')}>Send</button>
          <button onClick={() => typing('test')}>Typing</button>
          <button onClick={() => sendSurvey('test')}>Send Survey</button>
        </div>
      );
    };
    render(
      <LivechatProvider>
        <ChildComponent />
      </LivechatProvider>,
    );
    screen.getByRole('button', { name: 'Send' }).click();
    expect(useDyduPolling().send).toBeDefined();
    screen.getByRole('button', { name: 'Typing' }).click();
    screen.getByRole('button', { name: 'Send Survey' }).click();
    expect(useQueue().put).toHaveBeenCalledWith('test');
  });

  it('should call window.dydu.chat.reply with the expected text', () => {
    const { result } = renderHook(() => useLivechat(), {
      wrapper: LivechatProvider,
    });

    const text = 'Example response text';
    const windowSpy = jest.spyOn(window.dydu.chat, 'reply');

    act(() => {
      result.current.displayResponseText(text);
    });

    expect(windowSpy).toHaveBeenCalledWith(text);
    windowSpy.mockRestore();
  });
});
