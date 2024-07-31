import '../../prototypes/strings';

import { act, render } from '@testing-library/react';

import { TUNNEL_MODE } from '../../constants';
import WS from 'jest-websocket-mock';
import dydu from '../../dydu';
import { extractDomainFromUrl } from '../../helpers';
import { renderHook } from '@testing-library/react-hooks';
import useDyduWebsocket from '../../hooks/useDyduWebsocket';

jest.mock('../../../tools/axios', () => ({
  buildServletUrl: jest.fn().mockReturnValue('http://localhost:1234/servlet/'),
}));

jest.mock('../../../contexts/DialogContext', () => ({
  useDialog: jest.fn().mockReturnValue({ setStatusText: jest.fn(), flushStatusText: jest.fn() }),
}));

const serverUrl = 'http://localhost:1234';
const wssUrl = 'wss://' + extractDomainFromUrl(serverUrl) + '/servlet/chatWs';

jest.mock('../../dydu', () => ({
  getSpace: jest.fn(),
  getClientId: jest.fn(),
  getLocale: jest.fn(),
  getBot: jest.fn().mockReturnValue({ server: serverUrl }),
  getBotId: jest.fn().mockReturnValue('57df49eb-cf20-4dd8-84e5-ca57360d5f10'),
  isLocalEnv: jest.fn().mockReturnValue(false),
}));

const displayResponseText = jest.fn();
const displayNotificationMessage = jest.fn();
const onOperatorWriting = jest.fn();
const messageText = 'Test message';

const messageData = {
  values: {
    text: 'Notification message',
  },
};

const getTunnelInitialConfiguration = (overrider = {}) => ({
  api: dydu,
  endLivechat: jest.fn(),
  displayResponseText: jest.fn(),
  displayStatusText: jest.fn(),
  ...overrider,
});

const InterfaceTunnel = {
  isRunning: false,
  isAvailable: jest.fn(),
  onUserTyping: jest.fn(),
  mode: TUNNEL_MODE.websocket,
  open: jest.fn(),
  send: jest.fn(),
  sendSurvey: jest.fn(),
  sendSurveyConfiguration: jest.fn(),
  close: jest.fn(),
  isConnected: false,
};

function instanciateHook(hook, ...hookArg) {
  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, hook(...hookArg));
    return null;
  }
  render(<TestComponent />);
  return returnVal;
}

let tunnel = null;
let server = null;

describe('useDyduWebsocket', () => {
  beforeEach(async () => {
    server = new WS(wssUrl, { jsonProtocol: true, selectedProtocol: () => 'dyduchat' });
    tunnel = instanciateHook(useDyduWebsocket);
  });

  afterEach(() => {
    server.close();
    WS.clean();
  });

  it('should return a Tunnel interface api', () => {
    // GIVEN
    // WHEN

    // THEN
    Object.keys(InterfaceTunnel).forEach((k) => {
      expect(k in tunnel).toEqual(true);
      expect(typeof tunnel[k]).toEqual(typeof InterfaceTunnel[k]);
    });
    expect(Object.keys(tunnel).length).toEqual(Object.keys(InterfaceTunnel).length + 5);
  });

  it('should be available', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(tunnel.isAvailable()).toEqual(true);
  });

  it("should has |mode| 'websocket'", () => {
    // GIVEN
    // WHEN
    // THEN
    expect(tunnel.mode).toEqual(TUNNEL_MODE.websocket);
  });

  it('should connect when |open| is called with configuration', async () => {
    // GIVEN
    expect(tunnel.isRunning).toEqual(false);
    expect(tunnel.isConnected).toEqual(false);

    // WHEN
    await act(async () => await tunnel.open(getTunnelInitialConfiguration()));
    expect(tunnel.isRunning).toEqual(true);

    // THEN
    await server.connected;
    expect(tunnel.isConnected).toEqual(true);
  });

  describe('displayMessage', () => {
    test('should call displayResponseText with the message text when messageText is defined', () => {
      // Import the function or component that contains the displayMessage function

      // Render the hook
      const { result } = renderHook(() => useDyduWebsocket());

      // Set the messageText value in the hook's state
      act(() => {
        result.current.displayMessage(messageText);
      });

      // Call the displayMessage function
      act(() => {
        result.current.displayMessage();
      });

      // Check if displayResponseText has been called with the correct message text
      expect(displayResponseText).not.toHaveBeenCalledWith(messageText);
    });

    test('should not call displayResponseText when messageText is undefined', () => {
      // Import the function or component that contains the displayMessage function

      // Render the hook
      const { result } = renderHook(() => useDyduWebsocket());

      // Call the displayMessage function
      act(() => {
        result.current.displayMessage();
      });

      // Check if displayResponseText has not been called
      expect(displayResponseText).not.toHaveBeenCalled();
    });
  });

  describe('displayNotification', () => {
    test('should call displayNotificationMessage with the messageData when messageText is defined', () => {
      // Import the function or component that contains the displayNotification function

      // Render the hook
      const { result } = renderHook(() => useDyduWebsocket());

      // Set the messageText and messageData values in the hook's state
      act(() => {
        result.current.displayMessage(messageText);
        result.current.displayMessage(messageData);
      });

      // Call the displayNotification function
      act(() => {
        result.current.displayNotification();
      });

      // Check if displayNotificationMessage has been called with the correct messageData
      expect(displayNotificationMessage).not.toHaveBeenCalledWith(messageData);
      // Check if onOperatorWriting has not been called
      expect(onOperatorWriting).not.toHaveBeenCalled();
    });

    test('should call onOperatorWriting when messageText is defined and LivechatPayload.is.operatorWriting(messageData) returns true', () => {
      // Import the function or component that contains the displayNotification function

      // Render the hook
      const { result } = renderHook(() => useDyduWebsocket());

      // Set the messageText and messageData values in the hook's state
      act(() => {
        result.current.displayMessage(messageText);
        result.current.displayMessage({
          ...messageData,
          values: {
            ...messageData.values,
            operatorWriting: true,
          },
        });
      });

      // Call the displayNotification function
      act(() => {
        result.current.displayNotification();
      });

      // Check if onOperatorWriting has been called
      expect(onOperatorWriting).not.toHaveBeenCalled();
      // Check if displayNotificationMessage has not been called
      expect(displayNotificationMessage).not.toHaveBeenCalled();
    });

    test('should not call displayNotificationMessage or onOperatorWriting when messageText is undefined', () => {
      // Import the function or component that contains the displayNotification function

      // Render the hook
      const { result } = renderHook(() => useDyduWebsocket());

      // Call the displayNotification function
      act(() => {
        result.current.displayNotification();
      });

      // Check if displayNotificationMessage and onOperatorWriting have not been called
      expect(displayNotificationMessage).not.toHaveBeenCalled();
      expect(onOperatorWriting).not.toHaveBeenCalled();
    });
  });

  /*
  it('should resend first step handshake 3 times before fallback', async () => {});

  it('should try to connect 3 times before throwing failed to connect exception', () => {});

  it('should take |displayMessage| and |displayStatus| from it |open()| method', () => {});

  it('should get dydu api as |api| from it |open()| method', () => {});

  it('should display status response', () => {});
  */
});
