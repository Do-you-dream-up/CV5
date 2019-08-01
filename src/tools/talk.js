import Bowser from 'bowser';
import dydu from './dydu';


const meta = () => {
  const { parsedResult: {
    browser={},
    os={},
    platform={},
  }={} } = Bowser.getParser(window.navigator.userAgent);
  const html = [
    '<dl>',
    ...[
      {label: 'Bot Name', value: '-'},
      {label: 'Bot Configuration', value: '-'},
      {label: 'Deployed On', value: '-'},
      {label: 'Language', value: '-'},
      {label: 'Space', value: '-'},
      {label: 'Operating System', value: `${os.name} ${os.versionName}`},
      {label: 'Browser', value: `${browser.name} ${browser.version}`},
      {label: 'Platform', value: platform.type},
    ].map(it => `<dt>${it.label}</dt><dd>${it.value}</dd>`),
    '</dl>',
  ];
  window.dydu.reply(html.join(''));
};


export const ACTIONS = {
  '#comment#':    null,
  '#context#':    null,
  '#feedback#':   null,
  '#host#':       () => dydu.whoami().then(text => window.dydu.reply(`<p>${text}</p>`)),
  '#iframe#':     null,
  '#link#':       null,
  '#list#':       null,
  '#meta#':       meta,
  '#reset#':      null,
  '#secondary#':  null,
  '#split#':      null,
  '#steps#':      null,
  '#template#':   null,
};


export default (text, options) => new Promise(resolve => {
  if (ACTIONS[text]) {
    ACTIONS[text]();
  }
  else {
    resolve(dydu.talk(text, options));
  }
});
