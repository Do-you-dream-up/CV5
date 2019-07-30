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


export default text => new Promise((resolve, reject) => {
  if (ACTIONS[text]) {
    ACTIONS[text](() => resolve(text));
  }
  else {
    reject(text);
  }
});
