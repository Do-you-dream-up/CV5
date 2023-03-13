import { mockFieldValues } from '../../Survey/components/utils';

const localhostUrl = 'http://localhost/';

const PAYLOAD_COMMON_CONTENT = {
  contextId: null,
  botId: null,
  space: null,
  clientId: null,
  language: null,
  type: 'survey',
  userUrl: localhostUrl,
  browser: 'Mozilla Firefox',
  os: 'Windows',
  fields: mockFieldValues,
  parameters: {
    surveyId: 'surveyId',
    interactionSurveyAnswer: '456',
    contextId: null,
    botId: null,
    space: null,
    clientId: null,
    language: null,
    fields: {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    },
    os: 'Windows',
    browser: 'Mozilla Firefox',
    userUrl: 'http://localhost/',
  },
};

describe('PAYLOAD_COMMON_CONTENT', () => {
  it('PAYLOAD_COMMON_CONTENT has expected structure and values', () => {
    expect(PAYLOAD_COMMON_CONTENT).toEqual(PAYLOAD_COMMON_CONTENT);
  });
});
