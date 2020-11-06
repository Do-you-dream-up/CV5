import Bowser from 'bowser';
import dydu from './dydu';
import { LOREM_HTML } from './lorem';


/**
 * Forge the #meta# response and add it the conversation.
 */
const meta = () => {
  const { parsedResult: {
    browser = {},
    os = {},
    platform = {},
  } = {} } = Bowser.getParser(window.navigator.userAgent);
  const html = [
    '<dl>',
    ...[
      {label: 'Bot Name', value: '-'},
      {label: 'Bot Configuration', value: '-'},
      {label: 'Deployed On', value: '-'},
      {label: 'Language', value: dydu.getLocale() || '-'},
      {label: 'Space', value: '-'},
      {label: 'Operating System', value: `${os.name} ${os.versionName}`},
      {label: 'Browser', value: `${browser.name} ${browser.version}`},
      {label: 'Platform', value: platform.type},
    ].map(it => `<dt>${it.label}</dt><dd>${it.value}</dd>`),
    '</dl>',
  ];
  window.dydu.chat.reply(html.join(''));
};


/**
 * List the supported keywords and yield their current implementation.
 */
export const ACTIONS = {
  '#comment#':    null,
  '#context#':    null,
  '#feedback#':   null,
  '#host#':       () => dydu.whoami().then(window.dydu.chat.reply),
  '#iframe#':     null,
  '#lorem#':      () => window.dydu.lorem.standard(),
  '#meta#':       meta,
  '#reset#':      () => dydu.reset().then(window.dydu.chat.empty),
  '#secondary#':  () => window.dydu.ui.secondary(true, {body: LOREM_HTML, title: 'Secondary'}),
  '#split#':      () => window.dydu.lorem.split(),
  '#steps#':      null,
  '#template#':   null,
};


/**
 * Talk with the provided input or dispatch to the selected keyword when
 * relevant.
 *
 * @param {string} text - Request text.
 * @param {object} [options] - Extra options to pass to {@link Dydu#talk}.
 * @returns {Promise}
 */
export default (text, options) => new Promise(resolve => {
  if (ACTIONS[text]) {
    ACTIONS[text]();
  }
  else {
    resolve(dydu.talk(text, options));
  }
});
