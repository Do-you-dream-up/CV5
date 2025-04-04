import Bowser from 'bowser';
import { LOREM_HTML } from './lorem';
import dydu from './dydu';
import { BOT } from './bot';
import { getChatboxId } from './helpers';

/**
 * Forge the #meta# response and add it the conversation.
 */
export const meta = () => {
  const { parsedResult: { browser = {}, os = {}, platform = {} } = {} } = Bowser.getParser(window.navigator.userAgent);
  const html = [
    '<dl>',
    ...[
      { label: 'Bot Name', value: '-' },
      { label: 'Bot Configuration', value: '-' },
      { label: 'Bot ID', value: BOT.id || '-' },
      { label: 'Deployed On', value: '-' },
      { label: 'Language', value: dydu.getLocale() || '-' },
      { label: 'Space', value: dydu.getSpace() || '-' },
      { label: 'Operating System', value: `${os.name} ${os.versionName}` },
      { label: 'Browser', value: `${browser.name} ${browser.version}` },
      { label: 'Platform', value: platform.type },
      { label: 'Chatbox ID', value: getChatboxId() ? getChatboxId() : '-' },
    ].map((it) => `<dt>${it.label}</dt><dd>${it.value}</dd>`),
    '</dl>',
  ];
  window.dydu?.chat?.reply(html.join(''));
};

/**
 * List the supported keywords and yield their current implementation.
 */
export const ACTIONS = {
  '#comment#': null,
  '#context#': null,
  '#contextVariables#': () => window.dydu.chat.reply(dydu.getContextVariables()),
  '#contextvariables#': () => window.dydu.chat.reply(dydu.getContextVariables()), // like on CV4
  '#feedback#': null,
  '#botid#': () => window.dydu.chat.reply(dydu.getBot().id),
  '#host#': () => dydu.whoami().then(window.dydu.chat.reply),
  '#iframe#': null,
  '#lorem#': () => window.dydu.lorem.standard(),
  '#meta#': meta,
  '#sidebar#': () => window.dydu.ui?.sidebar(true, { body: LOREM_HTML, title: 'Sidebar' }),
  '#space#': () => window.dydu.chat.reply(dydu.getSpace()),
  '#split#': () => window.dydu.lorem.split(),
  '#steps#': null,
  '#template#': null,
  '#newdialog#': () => window.dydu.newdialog(),
};

/**
 * Talk with the provided input or dispatch to the selected keyword when
 * relevant.
 *
 * @param {string} text - Request text.
 * @param {object} [options] - Extra options to pass to {@link Dydu#talk}.
 * @returns {Promise}
 */
export default (text, options) =>
  new Promise((resolve) => {
    if (ACTIONS[text]) {
      ACTIONS[text]();
    } else {
      resolve(dydu.talk(text, options));
    }
  });
