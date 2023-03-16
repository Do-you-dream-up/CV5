import Bowser from 'bowser';
import { LOREM_HTML } from '../lorem';
import dydu from '../dydu';
import { meta } from '../talk';

describe('talk', () => {
  it('should return the meta information', () => {
    const userAgent = Bowser.getParser(window.navigator.userAgent);
    const browser = Bowser.parse(userAgent).browser;
    const os = Bowser.parse(userAgent).os;
    const platform = Bowser.parse(userAgent).platform;
    const expectedHtml = [
      '<dl>',
      '<dt>Bot Name</dt><dd>-</dd>',
      '<dt>Bot Configuration</dt><dd>-</dd>',
      '<dt>Bot ID</dt><dd>-</dd>',
      '<dt>Deployed On</dt><dd>-</dd>',
      '<dt>Language</dt><dd>-</dd>',
      '<dt>Space</dt><dd>-</dd>',
      `<dt>Operating System</dt><dd>${os.name} ${os.versionName}</dd>`,
      `<dt>Browser</dt><dd>${browser.name} ${browser.version}</dd>`,
      `<dt>Platform</dt><dd>${platform.type}</dd>`,
      '</dl>',
    ].join('');

    const chatApi = {
      reply: jest.fn(),
    };
    window.dydu = {
      chat: chatApi,
    };

    meta();

    expect(chatApi.reply).toHaveBeenCalledWith(expectedHtml);
  });
});
