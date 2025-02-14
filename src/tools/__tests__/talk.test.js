/**
 * @jest-environment jsdom
 */

import talk, { ACTIONS, meta } from '../talk';

import Bowser from 'bowser';
import dydu from '../dydu';
import { Local } from '../storage';

describe('talk', () => {
  const chatApi = {
    reply: jest.fn(),
    empty: jest.fn(),
    split: jest.fn(),
    standard: jest.fn(() => 'Lorem ipsum'),
  };
  const uiApi = {
    sidebar: jest.fn(),
  };

  window.dydu = {
    lorem: chatApi,
    chat: chatApi,
    ui: uiApi,
  };
  it('should return the meta information', () => {
    const locale = Local.get(Local.names.locale) || '-';
    const userAgent = Bowser.getParser(window.navigator.userAgent);
    const { browser = {}, os = {}, platform = {} } = userAgent.parsedResult;
    const expectedHtml = [
      '<dl>',
      '<dt>Bot Name</dt><dd>-</dd>',
      '<dt>Bot Configuration</dt><dd>-</dd>',
      '<dt>Bot ID</dt><dd>-</dd>',
      '<dt>Deployed On</dt><dd>-</dd>',
      `<dt>Language</dt><dd>${locale}</dd>`,
      '<dt>Space</dt><dd>-</dd>',
      `<dt>Operating System</dt><dd>${os.name} ${os.versionName}</dd>`,
      `<dt>Browser</dt><dd>${browser.name} ${browser.version}</dd>`,
      `<dt>Platform</dt><dd>${platform.type}</dd>`,
      `<dt>Chatbox ID</dt><dd>-</dd>`,
      '</dl>',
    ].join('');

    meta();

    expect(chatApi.reply).toHaveBeenCalledWith(expectedHtml);
  });

  it('should reply with context variables', () => {
    ACTIONS['#contextVariables#']();
    expect(window.dydu.chat.reply).toHaveBeenCalledWith(expect.anything());
  });

  it('should reply with context variables', () => {
    ACTIONS['#contextvariables#']();
    expect(window.dydu.chat.reply).toHaveBeenCalledWith(expect.anything());
  });

  it('should reply with the bot ID', () => {
    ACTIONS['#botid#']();
    expect(window.dydu.chat.reply).toHaveBeenCalledWith(dydu.getBot().id);
  });

  it('should reply with the space', () => {
    ACTIONS['#space#']();
    expect(window.dydu.chat.reply).toHaveBeenCalledWith(dydu.getSpace());
  });

  it('should call dydu.whoami() and window.dydu.chat.reply()', async () => {
    const whoamiResult = 'whoami result';
    const whoamiMock = jest.fn().mockResolvedValue(whoamiResult);
    const oldWhoami = dydu.whoami;
    dydu.whoami = whoamiMock;

    await ACTIONS['#host#']();

    expect(whoamiMock).toHaveBeenCalledTimes(1);
    expect(window.dydu.chat.reply).toHaveBeenCalledTimes(1);
    expect(window.dydu.chat.reply).toHaveBeenCalledWith(whoamiResult);

    dydu.whoami = oldWhoami;
  });

  it('should reply with the standard lorem ipsum text', () => {
    ACTIONS['#lorem#']();
    expect(window.dydu.lorem.standard).toHaveBeenCalled();
  });
  it('should open a sidebar panel', () => {
    ACTIONS['#sidebar#']();
    expect(window.dydu.ui.sidebar).toHaveBeenCalledWith(true, expect.anything());
  });

  it('should call window.dydu.lorem.split() when #split# is passed to talk', () => {
    talk('#split#');
    expect(window.dydu.lorem.split).toHaveBeenCalled();
  });

  it('should call the appropriate action', () => {
    const mockAction = jest.fn();
    ACTIONS['#action#'] = mockAction;
    talk('#action#');
    expect(mockAction).toHaveBeenCalled();
  });

  it('should call Dydu talk', () => {
    const mockTalk = jest.spyOn(dydu, 'talk').mockResolvedValue('response');
    const result = talk('hello');
    expect(mockTalk).toHaveBeenCalledWith('hello', undefined);
    expect(result).resolves.toBe('response');
  });

  it('should call Dydu talk with options', () => {
    const mockTalk = jest.spyOn(dydu, 'talk').mockResolvedValue('response');
    const options = { language: 'fr' };
    const result = talk('hello', options);
    expect(mockTalk).toHaveBeenCalledWith('hello', options);
    expect(result).resolves.toBe('response');
  });
});
