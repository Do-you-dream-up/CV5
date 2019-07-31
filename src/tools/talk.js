import dydu from './dydu';


export const ACTIONS = {
  '#comment#':    null,
  '#context#':    null,
  '#feedback#':   null,
  '#host#':       () => dydu.whoami().then(window.dydu.reply),
  '#iframe#':     null,
  '#link#':       null,
  '#list#':       null,
  '#meta#':       null,
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
