import '../../prototypes/strings';

import { act, render } from '@testing-library/react';

import { TUNNEL_MODE } from '../../constants';
import WS from 'jest-websocket-mock';
import dydu from '../../dydu';
import { extractDomainFromUrl } from '../../helpers';
import useDyduWebsocket from '../useDyduWebsocket';

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
}));

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
    expect(Object.keys(tunnel).length).toEqual(Object.keys(InterfaceTunnel).length);
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

  it('should initialize dydu websocket handshake on connection', async () => {
    // GIVEN
    await act(async () => await tunnel.open(getTunnelInitialConfiguration()));
    await server.connected;
    expect(tunnel.isConnected).toEqual(true);

    // WHEN
    // THEN
    await server.nextMessage.then((message) => {
      /* step 1/3 of handshake */
      expect(message.type).toEqual('getContext');
    });

    /* step 2/3 of handshake */
    await server.send({ type: 'getContextResponse' });

    await server.nextMessage.then((message) => {
      /* step 3/3 of handshake */
      expect(message.type).toEqual('addInternautEvent');
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
