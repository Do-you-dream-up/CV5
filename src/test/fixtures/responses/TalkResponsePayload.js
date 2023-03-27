import { mergeDeep } from '../../../tools/helpers';

const getBaseTalkResponse = () => {
  return {
    values: {
      contextId: '',
      language: 'fr'.toBase64(),
      hasProfilePicture: false,
      keepPopinMinimized: false,
      askFeedback: false,
      knowledgeId: 522388,
      typeResponse: 'DMSocial'.toBase64(),
      actionId: 1157051,
      serverTime: 1678353568304,
      botId: '',
      text: 'Bonjour !',
      startLivechat: false,
      human: false,
      enableAutoSuggestion: false,
    },
    type: 'talkResponse',
  };
};

export class TalkResponsePayload {
  constructor() {
    this.payload = getBaseTalkResponse();
  }
  getPayload() {
    return this.payload;
  }
  withContextId(cid = '') {
    this.getPayload().values.contextId = cid;
    return this;
  }
  withTypeResponse(tr = '') {
    this.getPayload().values.typeResponse = tr.toBase64();
    return this;
  }
  withText(text = '') {
    this.getPayload().values.text = text.toBase64();
    return this;
  }
  mergePayload(...sources) {
    this.payload = mergeDeep(this.getPayload(), ...sources);
    return this;
  }
}
