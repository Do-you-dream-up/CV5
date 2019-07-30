import dydu from './dydu';


export const ACTIONS = {
  '#comment#':    null,
  '#context#':    null,
  '#feedback#':   null,
  '#host#':       null,
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
