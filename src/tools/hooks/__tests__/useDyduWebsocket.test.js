import '../../prototypes/strings';

import { act, render } from '@testing-library/react';

import { TUNNEL_MODE } from '../../constants';
import WS from 'jest-websocket-mock';
import dydu from '../../dydu';
import { extractDomainFromUrl } from '../../helpers';
import { renderHook } from '@testing-library/react-hooks';
import useDyduWebsocket from '../../hooks/useDyduWebsocket';

jest.mock('../../../tools/axios', () => ({
  buildServletUrl: jest.fn().mockReturnValue('http://localhost:1234/servlet'),
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
  isAvailable: jest.fn(),
  onUserTyping: jest.fn(),
  mode: TUNNEL_MODE.websocket,
  open: jest.fn(),
  send: jest.fn(),
  sendSurvey: jest.fn(),
  sendSurveyConfiguration: jest.fn(),
  close: jest.fn(),
  setLastResponse: jest.fn(),
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
});
