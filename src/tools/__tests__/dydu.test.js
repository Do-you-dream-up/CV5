/* eslint-disable */

import '../prototypes/strings';

import { Cookie, Local, Session } from '../storage';
import { objectContainFields, secondsToMs, strContains } from '../helpers';

import { ConfigurationFixture } from '../../test/fixtures/configuration';

const dyduRelativeLocation = '../dydu';
let _dydu = jest.requireActual(dyduRelativeLocation).default;

import { emit, SERVLET_API } from '../axios';
import { BOT } from '../bot';

jest.mock('../axios', () => ({
  emit: jest.fn().mockReturnValue(Promise.resolve({})),
  setConfiguration: jest.fn(),
  SERVLET_API: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock(dyduRelativeLocation, () => ({
  default: jest.fn(),
}));

jest.mock('../bot', () => ({
  BOT: {
    id: 'current-bot-id',
  },
}));

jest.mock('../storage', () => ({
  Local: {
    visit: {
      save: jest.fn(),
    },
    welcomeKnowledge: {
      isSet: jest.fn(),
      save: jest.fn(),
      load: jest.fn(),
    },
    saml: {
      load: jest.fn(),
      save: jest.fn(),
    },
    get: jest.fn(),
    set: jest.fn(),
    names: { space: 'LS-KEY-SPACE', locale: '' },
    byBotId: jest.fn(),
    contextId: {
      save: jest.fn(),
      load: jest.fn(),
      createKey: jest.fn(),
    },
    clientId: {
      getKey: jest.fn(),
      isSet: jest.fn(),
      createAndSave: jest.fn(),
      load: jest.fn(),
    },
    isChannels: {
      load: jest.fn(),
    },
  },
  Cookie: {
    get: jest.fn(),
  },
  Session: {
    names: {
      lastPoll: 'dydu.lastPoll',
    },
    get: jest.fn(() => ''),
  },
}));

let spied = [];
let dydu;

describe('dydu.js', function () {
  beforeEach(() => {
    jestRestoreMocked(spied);
    spied = [];
    dydu = _dydu;
  });

  afterEach(() => {
    jestRestoreMocked(spied);
    jestRestoreMocked(Object.values(spied));
    spied = [];
    dydu = _dydu;
  });

  describe('getConfiguration', function () {
    it('should return |configuration| class attribute', () => {
      // GIVEN
      const expected = 'expected';
      dydu.configuration = expected;

      // WHEN
      const received = dydu.getConfiguration();

      // THEN
      expect(received).toEqual(expected);
    });
  });

  describe('setConfiguration', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['onConfigurationLoaded']);
    });

    it('should set the configuration', () => {
      // GIVEN
      const expected = 'expected';

      // WHEN
      dydu.setConfiguration(expected);

      // THEN
      expect(dydu.configuration).toEqual(expected);
    });
    it('should call |this.onConfigurationLoaded| after set configuration', () => {
      // GIVEN
      // WHEN
      dydu.setConfiguration();

      // THEN
      expect(spied.onConfigurationLoaded).toHaveBeenCalled();
    });
  });

  describe('onConfigurationLoaded', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['setInitialSpace', 'setQualificationMode', 'getSpace', 'getConfiguration']);
      const c = new ConfigurationFixture();
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
    });
    afterEach(() => {
      jestRestoreMocked(Object.values(spied));
    });
    it('should call initializers', () => {
      const initializerFnList = ['setInitialSpace', 'setQualificationMode'];
      dydu.onConfigurationLoaded();
      initializerFnList.forEach((initializerFn) => {
        expect(spied[initializerFn]).toHaveBeenCalled();
      });
    });
  });

  describe('registerVisit', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['welcomeCall', 'getInfos']);
      spied.welcomeCall.mockResolvedValue(true);
    });
    afterEach(() => {
      jestRestoreMocked(Object.values(spied));
    });
    it('should call |this.welcomeCall|', () => {
      // GIVEN
      // WHEN
      dydu.registerVisit();

      // THEN
      expect(spied.welcomeCall).toHaveBeenCalled();
    });
  });

  describe('getInfos', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getLocale', 'getSpace']);
    });
    afterEach(() => {
      jestRestoreMocked(Object.values(spied));
    });
    it('should match info object design', async () => {
      const infosEntity = {
        botId: '',
        locale: '',
        space: '',
      };

      // WHEN
      const receivedInfos = await dydu.getInfos();

      // THEN
      Object.keys(infosEntity).forEach((key) => {
        expect(`${key}` in receivedInfos).toEqual(true);
      });
    });
    it('should call methods to feed the info object', async () => {
      // GIVEN
      const methods = ['getLocale', 'getSpace'];

      // WHEN
      await dydu.getInfos();

      // THEN
      methods.every((methodName) => {
        expect(spied[methodName]).toHaveBeenCalled();
      });
    });
  });

  describe('getSurvey', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getLocale', 'getConfiguration', 'post']);
    });
    afterEach(() => {
      jestRestoreMocked(Object.values(spied));
    });
    it('should return null when argument is null or undefined', async () => {
      // GIVEN
      // WHEN
      const received = await dydu.getSurvey(null);

      // THEN
      expect(received).toBeFalsy();
    });
    it('should call /chat/survey/configuration with the |surveyId| argument', async () => {
      // GIVEN
      // WHEN
      const received = await dydu.getSurvey('survey-id');

      // THEN
      const paramPosition = 0;
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.post, paramPosition);
      const expectedPath = 'chat/survey/configuration';
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should use a formUrlEncoded data', async () => {
      // GIVEN
      // WHEN
      const received = await dydu.getSurvey('survey-id');

      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.post, paramPosition);
      expect(isUrlFormEncoded(effectiveParamValue)).toEqual(true);
    });
    it('should make a post', async () => {
      const received = await dydu.getSurvey('survey-id');

      expect(spied.post).toHaveBeenCalled();
    });
  });

  describe('sendSurvey', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, [
        'formatFieldsForSurveyAnswerRequest',
        'createSurveyPayload',
        'post',
        'displaySurveySent',
      ]);
    });
    afterEach(() => {
      jestRestoreMocked(Object.values(spied));
    });
    it('should POST on /chat/survey', async () => {
      // GIVEN
      spied.createSurveyPayload.mockResolvedValue({ surveyPayload: true });
      spied.post.mockResolvedValue(true);

      // WHEN
      const surveyAnswer = {};
      await dydu.sendSurvey(surveyAnswer);

      // THEN
      const paramPosition = 0;
      const effectiveParam = mockFnGetParamValueAtPosition(spied.post, paramPosition);
      expect(spied.post).toHaveBeenCalled();
      const expectedPath = 'chat/survey';
      expect(strContains(effectiveParam, expectedPath)).toEqual(true);
    });
    it('should call |this.displaySurveySent| as a resolve of POST request', async () => {
      // GIVEN
      const surveyAnswer = { surveyId: 'survey-id' };
      spied.post.mockResolvedValue(true);
      spied.createSurveyPayload.mockResolvedValue(surveyAnswer);

      // WHEN
      await dydu.sendSurvey(surveyAnswer);

      // THEN
      expect(spied.displaySurveySent).toHaveBeenCalled();
    });
  });

  describe('createSurveyPayload', function () {
    it('should create correct object', async () => {
      // GIVEN
      const getContextIdSpy = jest.spyOn(dydu, 'getContextId').mockReturnValue('');

      const surveyId = 'survey-id';
      const surveyEntity = {
        ctx: '',
        uuid: surveyId,
      };
      // WHEN
      const received = await dydu.createSurveyPayload(surveyId, {});

      // THEN
      const isValid = objectContainFields(received, Object.keys(surveyEntity));
      expect(isValid).toEqual(true);
      jestRestoreMocked([getContextIdSpy]);
    });
  });

  describe('whoami', () => {
    it('should GET request on whoami/ api', async () => {
      // WHEN
      await dydu.whoami();

      // THEN
      const paramPosition = 1;
      const effectiveValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      const expectedPath = 'whoami/';
      expect(effectiveValue).toEqual(expectedPath);
    });
  });

  describe('welcomeCall', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getContextId', 'getLocale', 'getSpace', 'getConfiguration', 'getVariables']);
    });
    it('should call |getContextId|', () => {
      // GIVEN
      // WHEN
      dydu.welcomeCall();
    });
    it('should POST request on chat/welcomecall/', async () => {
      // GIVEN
      // WHEN
      await dydu.welcomeCall();

      // THEN
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      const expectedPath = 'chat/welcomecall/';
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should requests with url encoded datas', async () => {
      //GIVEN
      // WHEN
      await dydu.welcomeCall();

      // THEN
      expect(emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(isUrlFormEncoded(effectivePayloadParameterValue)).toEqual(true);
    });
    it('should match correct datas', async () => {
      // GIVEN
      const payload = {
        contextUuid: '',
        language: '',
        qualificationMode: '',
        solutionUsed: '',
        space: '',
        variables: '',
      };
      spied.getContextId.mockResolvedValue('context-id');
      const expectedKeys = Object.keys(payload);

      // WHEN
      await dydu.welcomeCall();

      // THEN
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expectedKeys.forEach((keyString) => {
        expect(strContains(effectivePayloadParameterValue, keyString)).toEqual(true);
      });
    });
  });

  describe('top', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getLocale', 'getSpace', 'getConfiguration']);
    });
    it('should POST on chat/topknowledge api', async () => {
      // GIVEN
      // WHEN
      await dydu.top();

      // THEN
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      const expectedPath = 'chat/topknowledge';
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should use url encoded as data parameter of |emit|', async () => {
      //GIVEN
      // WHEN
      await dydu.top();

      // THEN
      expect(emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(isUrlFormEncoded(effectivePayloadParameterValue)).toEqual(true);
    });
    it('should match correct datas', async () => {
      // GIVEN
      spied.getLocale.mockReturnValue('fr');
      spied.getSpace.mockReturnValue('space');

      const payload = {
        language: '',
        solutionUsed: '',
        space: '',
      };

      const expectedKeys = Object.keys(payload).concat(['period', 'maxKnowledge']);

      // WHEN
      const periodValue = 'periodValue';
      const size = 2;
      await dydu.top(periodValue, size);

      // THEN
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expectedKeys.forEach((keyString) => {
        expect(strContains(effectivePayloadParameterValue, keyString)).toEqual(true);
      });
    });
  });

  describe('poll', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getContextId', 'getLocale', 'getConfiguration', 'getSpace']);
    });

    it('should POST on /chat/poll/last', async () => {
      // GIVEN
      spied.getContextId.mockResolvedValue('');

      // WHEN
      await dydu.poll({});

      // THEN
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      const expectedPath = 'chat/poll/last/';
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should use form url encoded', async () => {
      //GIVEN
      // WHEN
      await dydu.poll({});

      // THEN
      expect(emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(isUrlFormEncoded(effectivePayloadParameterValue)).toEqual(true);
    });
    it('should send correct payload', async () => {
      // GIVEN
      const payload = {
        solutionUsed: '',
        format: '',
        space: '',
        contextUuid: '',
        language: '',
        lastPoll: '',
      };
      spied.getLocale.mockReturnValue('');
      spied.getSpace.mockReturnValue('');

      // WHEN
      await dydu.poll({ contextId: '' });

      // THEN
      const paramPosition = 2;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      Object.keys(payload).forEach((key) => {
        expect(strContains(effectiveParamValue, key)).toEqual(true);
      });
    });
  });

  describe('getSaml2Status', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getConfiguration']);
    });
    it('should GET request on /saml2/status with query parameter', async () => {
      const expectedValue = 'saml2/status';

      await dydu.getSaml2Status();

      expect(emit).toHaveBeenCalled();
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(strContains(effectiveParamValue, expectedValue)).toEqual(true);
    });
    it('should send saml value in payload when saml is enabled', () => {
      const c = new ConfigurationFixture();
      c.enableSaml();

      spied.getConfiguration.mockReturnValue(c.getConfiguration());

      const tokenValue = 'token-value';
      dydu.getSaml2Status(tokenValue);

      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(strContains(effectiveParamValue, tokenValue)).toEqual(true);
    });
  });

  describe('getSaml2UserInfo', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getConfiguration']);
    });
    it('should GET request on /saml2/status with query parameter', async () => {
      const expectedValue = 'saml2/userinfo';

      await dydu.getSaml2UserInfo();

      expect(emit).toHaveBeenCalled();
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(strContains(effectiveParamValue, expectedValue)).toEqual(true);
    });
    it('should send saml value in payload when saml is enabled', () => {
      const c = new ConfigurationFixture();
      c.enableSaml();

      spied.getConfiguration.mockReturnValue(c.getConfiguration());

      const tokenValue = 'token-value';
      dydu.getSaml2UserInfo(tokenValue);

      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(strContains(effectiveParamValue, tokenValue)).toEqual(true);
    });
  });

  describe('suggest', () => {
    it('should call |emit| for POST on /chat/search with bot id', () => {
      //GIVEN
      spied = jestSpyOnList(dydu, ['getLocale', 'getSpace', 'getConfiguration']);
      const text = 'voici le texte';
      //WHEN
      dydu.suggest(text);
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      const expectedPath = `chat/search/${BOT.id}`;

      //THEN
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should uses form url data encoding', () => {
      //WHEN
      //GIVEN
      //THEN
    });
  });

  describe('qualificationMode', () => {
    it('should get the value from window object', () => {
      //GIVEN
      window.DYDU_QUALIFICATION_MODE = true;

      //WHEN
      dydu.setQualificationMode(false);
      //THEN
      expect(dydu.qualificationMode).toEqual(true);
      window.DYDU_QUALIFICATION_MODE = false;
    });
    it('should use the argument as value', () => {
      //GIVEN
      const value = false;

      //WHEN
      dydu.setQualificationMode(value);
      //THEN
      expect(dydu.qualificationMode).toEqual(false);
    });
    it('should set the |qualificationMode| class attribute', () => {
      //GIVEN
      const value = undefined;

      //WHEN
      dydu.setQualificationMode(value);
      //THEN
      expect(dydu.qualificationMode).toEqual(false);
    });
  });

  describe('setSpace', () => {
    it('should set the |space| class attribute to the argument', () => {
      //GIVEN
      const newSpace = 'newSpace';

      //WHEN
      dydu.setSpace(newSpace);

      //THEN
      expect(dydu.space).toEqual(newSpace);
    });
    it('should save the space to localStorage', () => {
      //GIVEN
      const newSpace = 'newSpace';

      //WHEN
      dydu.setSpace(newSpace);

      //THEN
      expect(Local.set).toHaveBeenCalledWith(Local.names.space, newSpace);
    });
    it("should save lowercased if value is 'default'", () => {
      //GIVEN
      const space = 'default';

      //WHEN
      dydu.setSpace(space);

      //THEN
      expect(Local.set).toHaveBeenCalledWith(Local.names.space, space);
    });
  });
  describe('getContextVariables', () => {
    it('should return an html list of variables', () => {
      //GIVEN
      dydu.setRegisterContext('hello', 'bonjour');

      //WHEN
      const effective = dydu.getContextVariables();

      //THEN
      expect(effective).toEqual('<ul><li>hello&nbsp;=&nbsp;bonjour</li></ul>');
    });
  });

  describe('printHistory', () => {
    it('should call |getContextId|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId']);

      // WHEN
      await dydu.printHistory();
    });
  });

  describe('pushrules', () => {
    it('should call |emit|', async () => {
      // WHEN
      await dydu.pushrules();

      // THEN
      expect(emit).toHaveBeenCalled();
    });
  });

  describe('getSpace', () => {
    it('should get the space value from configuration when space is not defined and no argument is given', () => {
      // GIVEN
      const defaultSpace = 'default-space';
      spied = jestSpyOnList(dydu, ['getConfiguration']);
      spied.getConfiguration.mockReturnValue({ spaces: { items: [defaultSpace] } });

      // WHEN

      dydu.space = null;
      const nullArg = null;
      const receivedSpace = dydu.getSpace(nullArg);

      // THEN
      expect(receivedSpace).toEqual(defaultSpace);
    });
    it('should save space to localStorage', () => {
      // GIVEN
      const currentSpace = 'current-space';

      // WHEN
      dydu.space = currentSpace;
      dydu.getSpace();

      // THEN
      expect(Local.set).toHaveBeenCalledWith(Local.names.space, currentSpace);
    });
    it('should return the |space| class attribute', () => {
      // GIVEN
      const currentSpace = 'current-space';

      // WHEN
      dydu.space = currentSpace;
      const receivedSpace = dydu.getSpace();

      // THEN
      expect(receivedSpace).toEqual(currentSpace);
    });
    it('should get space from configuration when no strategy mode is active in the list argument and current space is null', () => {
      // GIVEN
      const configurationFixture = new ConfigurationFixture();
      dydu.getConfiguration = jest.fn().mockReturnValue(configurationFixture.getConfiguration());
      const strategiesAllDisabled = configurationFixture.getSpaceConfig().detection.map((modeObject) => {
        return {
          ...modeObject,
          active: false, // disable all
        };
      });

      // WHEN
      const currentSpace = null;
      dydu.space = currentSpace;
      const receivedSpace = dydu.getSpace(strategiesAllDisabled);

      // THEN
      expect(receivedSpace).toEqual(dydu.getConfiguration().spaces.items[0]);
    });
    it('should use cookie strategy', () => {
      // GIVEN
      const result = 'result-value';
      Cookie.get.mockReturnValue(result);
      const cookieModeValue = 'cookie-mode-value';
      const cookieDetectionItem = {
        mode: ConfigurationFixture.SPACE_DETECTION_MODE.cookie,
        active: true,
        value: cookieModeValue,
      };
      const configuration = new ConfigurationFixture();
      configuration.updateSpaceDetectionMode(cookieDetectionItem);
      const strategies = configuration.getSpaceConfig().detection;

      // WHEN
      const receivedSpace = dydu.getSpace(strategies);

      // THEN
      expect(Cookie.get).toHaveBeenCalledWith(cookieModeValue);
      expect(receivedSpace).toEqual(result);
    });
    it('should use global strategy', () => {
      // GIVEN
      const expectedResult = 'expectedSpacename';
      const targetWindowKey = 'customKey';
      window[targetWindowKey] = expectedResult;

      const globalModeItem = {
        mode: ConfigurationFixture.SPACE_DETECTION_MODE.global,
        active: true,
        value: targetWindowKey,
      };
      const configuration = new ConfigurationFixture();
      configuration.updateSpaceDetectionMode(globalModeItem);
      const strategies = configuration.getSpaceConfig().detection;

      // WHEN
      const receivedSpace = dydu.getSpace(strategies);

      // THEN
      expect(receivedSpace).toEqual(expectedResult);
    });
    it('should use localstorage strategy', () => {
      // GIVEN
      const expectedResult = 'expected-space';
      Local.get.mockReturnValue(expectedResult);

      const lsModeValue = 'value';
      const localstorageModeItem = {
        mode: ConfigurationFixture.SPACE_DETECTION_MODE.localstorage,
        active: true,
        value: lsModeValue,
      };
      const configuration = new ConfigurationFixture();
      configuration.updateSpaceDetectionMode(localstorageModeItem);
      const strategies = configuration.getSpaceConfig().detection;

      // WHEN
      const receivedSpace = dydu.getSpace(strategies);

      // THEN
      expect(receivedSpace).toEqual(expectedResult);
    });
  });

  describe('getConfiguration', () => {
    it('should return |configuration| class attribute value', () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['onConfigurationLoaded', 'getSpace', 'setInitialSpace', 'setQualificationMode']);

      const config = new ConfigurationFixture();
      const _config = config.getConfiguration();
      dydu.configuration = _config;

      // WHEN
      const receivedValue = dydu.getConfiguration();

      // THEN
      expect(receivedValue).toEqual(_config);
    });
  });

  describe('getContextIdStorageKey', function () {
    it('should call |Local.contextId.createKey|', () => {
      // GIVEN
      const s = jest.spyOn(Local.contextId, 'createKey');

      // THEN
      s.mockRestore();
    });
    it('should call |getBotId|', () => {
      // GIVEN
      dydu.getBotId = jest.fn();
    });
  });

  describe('getClientId', function () {
    it('should call |Local.clientId.getKey| with infoObject', () => {
      // WHEN
      dydu.getClientId();

      // THEN
      expect(Local.clientId.getKey).toHaveBeenCalled();
    });

    it('should call |Local.clientId.createAndSave| if |alreadyCame| is false', () => {
      // GIVEN
      dydu.alreadyCame = jest.fn().mockReturnValue(false);
      Local.clientId.createAndSave = jest.fn();
      // WHEN
      dydu.getClientId();

      // THEN
      expect(Local.clientId.createAndSave).toHaveBeenCalled();
    });
  });

  describe('hasUserAcceptedGdpr', () => {
    it('should return false', () => {
      // GIVEN
      const value = null;
      const expected = !!value;
      Local.get.mockReturnValue(value);
      Local.byBotId.mockReturnValue({ get: jest.fn().mockReturnValue(value) });

      // WHEN
      const received = dydu.hasUserAcceptedGdpr();

      // THEN
      expect(received).toEqual(expected);
    });
    it('should return true', () => {
      // GIVEN
      const value = 'value';
      const expected = !!value;
      Local.get.mockReturnValue(value);
      Local.byBotId.mockReturnValue({ get: jest.fn().mockReturnValue(value) });

      // WHEN
      const received = dydu.hasUserAcceptedGdpr();

      // THEN
      expect(received).toEqual(expected);
    });
    it('should call |getBotId|', () => {
      // GIVEN
      dydu.getBotId = jest.fn();
      Local.byBotId.mockReturnValue({ get: jest.fn() });

      // WHEN
      dydu.hasUserAcceptedGdpr();
      // THEN
      expect(Local.byBotId).toHaveBeenCalled();
    });
    it('should call |Local.byBotId| with current botId', () => {
      // GIVEN
      const currentBotId = 'current-bot-id';
      dydu.getBotId = jest.fn().mockReturnValue(currentBotId);
      Local.byBotId.mockReturnValue({ get: jest.fn() });

      // WHEN
      dydu.hasUserAcceptedGdpr();
      // THEN
      expect(Local.byBotId).toHaveBeenCalledWith(currentBotId);
    });
    it('should call |Local.get| with gdpr localStorage key name', () => {
      // GIVEN
      const gdprLSKeyName = 'gdrp';
      Local.names.gdpr = gdprLSKeyName;
      const spiedLocalGet = jest.spyOn(Local, 'get');
      const spiedByBotId = jest.spyOn(Local, 'byBotId');
      spiedByBotId.mockReturnValue({ get: jest.fn() });

      // WHEN
      dydu.hasUserAcceptedGdpr();

      // THEN
      expect(spiedLocalGet).toHaveBeenCalledWith(gdprLSKeyName);
      jestRestoreMocked([spiedLocalGet, spiedByBotId]);
    });
  });

  describe('feedbackInsatisfaction', function () {
    it('should call |getContextId|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId']);

      // WHEN
      await dydu.feedbackInsatisfaction();
    });
    it('should include the |choiceKey| parameter in payload', async () => {
      // GIVEN

      spied = jestSpyOnList(dydu, ['getConfiguration', 'getContextId']);
      const config = new ConfigurationFixture();
      config.enableSaml();
      spied.getConfiguration.mockReturnValue(config.getConfiguration());
      const s = jest.spyOn(Local.saml, 'load');

      // WHEN
      const choiceKey = 'choice-key';
      await dydu.feedbackInsatisfaction(choiceKey);

      // THEN
      expect(emit).toHaveBeenCalledWith(
        SERVLET_API.post,
        'chat/feedback/insatisfaction/current-bot-id/',
        `choiceKey=${choiceKey}&contextUUID=&solutionUsed=ASSISTANT`,
      );
      s.mockRestore();
    });
    it('should call |emit|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration']);
      const c = new ConfigurationFixture();
      spied.getContextId.mockResolvedValue(null);
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
      Local.saml.load = jest.fn();

      // WHEN
      await dydu.feedbackInsatisfaction();

      // THEN
      expect(emit).toHaveBeenCalled();
    });
    it('should call |emit| with chat/feedback/insatisfaction/ as path argument', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration']);
      const c = new ConfigurationFixture();
      spied.getContextId.mockResolvedValue(null);
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
      Local.saml.load = jest.fn();

      // WHEN
      await dydu.feedbackInsatisfaction();

      // THEN

      const targetPath = 'chat/feedback/insatisfaction/';
      const pathArg = emit.mock.calls[0][1];
      expect(strContains(pathArg, targetPath)).toEqual(true);
    });
    it('should call |emit| with form url encoded string as data argument', async () => {
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration']);
      const c = new ConfigurationFixture();
      spied.getContextId.mockResolvedValue(null);
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
      Local.saml.load = jest.fn();

      // WHEN
      await dydu.feedbackInsatisfaction();

      // THEN
      const dataArg = emit.mock.calls[0][2];
      expect(isUrlFormEncoded(dataArg)).toEqual(true);
    });
  });

  describe('feedbackComment', function () {
    it('should call |getContextId|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration']);
      spied.getContextId.mockResolvedValue(null);
      const spiedSamlLoad = jest.spyOn(Local.saml, 'load');

      // WHEN
      await dydu.feedbackComment();

      // THEN
      jestRestoreMocked([spiedSamlLoad]);
    });
    it('should call |getConfiguration|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration']);
      spied.getContextId.mockResolvedValue(null);
      const c = new ConfigurationFixture();
      const spiedSamlLoad = jest.spyOn(Local.saml, 'load');

      // WHEN
      await dydu.feedbackComment();

      // THEN
      expect(spied.getConfiguration).toHaveBeenCalled();
      jestRestoreMocked([spiedSamlLoad]);
    });
  });

  describe('feedback', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration']);
    });

    it('should call |getContextId|', async () => {
      // GIVEN
      spied.getContextId.mockResolvedValue(null);
      const spiedSamlLoad = jest.spyOn(Local.saml, 'load');

      // WHEN
      await dydu.feedback();

      // THEN
      jestRestoreMocked([spiedSamlLoad]);
    });
    it('should call |getConfiguration|', async () => {
      // GIVEN
      spied.getContextId.mockResolvedValue(null);
      const spiedSamlLoad = jest.spyOn(Local.saml, 'load');

      // WHEN
      await dydu.feedback();

      // THEN
      expect(spied.getConfiguration).toHaveBeenCalled();
      jestRestoreMocked([spiedSamlLoad]);
    });
    it('should call |Local.saml.load| if saml is enabled in configuration', async () => {
      // GIVEN
      spied.getContextId.mockResolvedValue(null);
      const c = new ConfigurationFixture();
      c.enableSaml();
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
      const spiedSamlLoad = jest.spyOn(Local.saml, 'load');

      // WHEN
      await dydu.feedback();

      // THEN
      expect(spiedSamlLoad).toHaveBeenCalled();
      jestRestoreMocked([spiedSamlLoad]);
    });
    it('should call |emit| with path chat/feedback/', async () => {
      // GIVEN
      spied.getContextId.mockResolvedValue(null);

      // WHEN
      await dydu.feedback();

      // THEN
      const targetPath = 'chat/feedback/';
      const pathArg = emit.mock.calls[0][1];
      expect(strContains(pathArg, targetPath)).toEqual(true);
    });
    it('should call |emit| with form url payload', async () => {
      // GIVEN
      // WHEN
      await dydu.feedback();

      // THEN
      const dataArg = emit.mock.calls[0][2];
      expect(isUrlFormEncoded(dataArg)).toEqual(true);
    });
    it('should includes saml info in payload when saml is enabled in configuration', async () => {
      // GIVEN
      const samlValue = 'saml-value';
      const spiedSamlLoad = jest.spyOn(Local.saml, 'load').mockReturnValue(samlValue);
      const c = new ConfigurationFixture();
      c.enableSaml();
      spied.getConfiguration.mockReturnValue(c.getConfiguration());

      // WHEN
      await dydu.feedback();

      // THEN
      const paramPosition = 2;
      const formUrlPayload = mockFnGetParamValueAtPosition(emit, paramPosition);
      const samlInfo = `saml2_info=${samlValue}`;
      expect(strContains(formUrlPayload, samlInfo)).toEqual(true);
      jestRestoreMocked([spiedSamlLoad]);
    });
    it('should includes |feedback| in payload', async () => {
      // GIVEN
      // WHEN
      await dydu.feedback(false);
      // THEN
      const paramPosition = 2;
      const formUrlPayload = mockFnGetParamValueAtPosition(emit, paramPosition);
      const feedbackKey = 'feedBack=';
      expect(strContains(formUrlPayload, feedbackKey)).toEqual(true);
    });
    it('should set |feedback| payload value to negative', async () => {
      // GIVEN
      const userResponse = false;
      // WHEN
      await dydu.feedback(userResponse);
      // THEN
      const paramPosition = 2;
      const formUrlPayload = mockFnGetParamValueAtPosition(emit, paramPosition);
      const feedbackKey = 'feedBack=negative';
      expect(strContains(formUrlPayload, feedbackKey)).toEqual(true);
    });
    it('should set |feedback| payload value to positive', async () => {
      // GIVEN
      const userResponse = true;
      // WHEN
      await dydu.feedback(userResponse);
      // THEN
      const paramPosition = 2;
      const formUrlPayload = mockFnGetParamValueAtPosition(emit, paramPosition);
      const feedbackKey = 'feedBack=positive';
      expect(strContains(formUrlPayload, feedbackKey)).toEqual(true);
    });
  });

  describe('exportConverstaion', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getContextId', 'getClientId', 'getLocale', 'getSpace', 'getConfiguration']);
    });
    it('should call |getContextId|', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();
    });
    it('should call |getClientId|', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // then
      expect(spied.getClientId).toHaveBeenCalled();
    });
    it('should call |getLocale|', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // then
      expect(spied.getLocale).toHaveBeenCalled();
    });
    it('should call |getSpace|', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // then
      expect(spied.getSpace).toHaveBeenCalled();
    });
    it('should call |getConfiguration|', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // then
      expect(spied.getConfiguration).toHaveBeenCalled();
    });
    it('should call |Local.saml.load| as saml is enable in configuration', async () => {
      // GIVEN
      const mockLocalSamlLoad = jest.spyOn(Local.saml, 'load');
      const c = new ConfigurationFixture();
      c.enableSaml();
      spied.getConfiguration.mockReturnValue(c.getConfiguration());

      // WHEN
      await dydu.exportConversation();

      // then
      expect(mockLocalSamlLoad).toHaveBeenCalled();
      jestRestoreMocked([mockLocalSamlLoad]);
    });
    it('should contains saml info in data form url when saml is enable in configuration', async () => {
      // GIVEN
      const samlValue = 'saml-value';
      const mockLocalSamlLoad = jest.spyOn(Local.saml, 'load');
      mockLocalSamlLoad.mockReturnValue(samlValue);

      const c = new ConfigurationFixture();
      c.enableSaml();
      spied.getConfiguration.mockReturnValue(c.getConfiguration());

      // WHEN
      await dydu.exportConversation();

      // then
      const dataParamPosition = 2;
      const effectiveParam = mockFnGetParamValueAtPosition(emit, dataParamPosition);
      const samlInfoPayloadFormUrl = `saml2_info=${samlValue}`;
      expect(strContains(effectiveParam, samlInfoPayloadFormUrl)).toEqual(true);
      jestRestoreMocked([mockLocalSamlLoad]);
    });
    it('should call |emit| with chat/talk as path parameter', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // THEN
      expect(emit).toHaveBeenCalled();
      const expectedPath = 'chat/talk';
      const paramPosition = 1;
      const effectiveParam = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(strContains(effectiveParam, expectedPath)).toEqual(true);
    });
    it('should call |emit| with form url encoded as payload parameter', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // THEN
      expect(emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(isUrlFormEncoded(effectivePayloadParameterValue)).toEqual(true);
    });
    it('should include the text argument in the payload', async () => {
      // GIVEN
      const text = 'text-value';

      // WHEN
      await dydu.exportConversation(text);

      // THEN
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(strContains(effectivePayloadParameterValue, text)).toEqual(true);
    });
    it('should match payload with schema', async () => {
      const schemaPayload = {
        clientId: '',
        language: '',
        qualificationMode: '',
        space: '',
        userInput: '',
        solutionUsed: '',
      };
      const schemaKeyList = Object.keys(schemaPayload);

      // WHEN
      await dydu.exportConversation();

      // THEN
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(emit, paramPosition);
      expect(schemaKeyList.every((key) => strContains(effectivePayloadParameterValue, key))).toEqual(true);
    });
    it("should contains contextId in path if it's defined", async () => {
      // GIVEN
      const contextId = 'defined-contextid';
      spied.getContextId.mockResolvedValue(contextId);

      // WHEN
      await dydu.exportConversation();

      // THEN
      const pathParamPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(emit, pathParamPosition);
      expect(strContains(effectiveParamValue, contextId)).toEqual(false);
    });
  });

  describe('alreadyCame', function () {
    it('should call |Local.clientId.getKey|', () => {
      //GIVEN

      //WHEN
      dydu.alreadyCame();
      //THEN
      expect(dydu.alreadyCame).toHaveBeenCalled();
    });
  });
});

const jestSpyOnList = (obj, methodNameList) => {
  return methodNameList.reduce(
    (mapRes, methodName) => ({
      ...mapRes,
      [methodName]: jest.spyOn(obj, methodName).mockReturnValue(null),
    }),
    {},
  );
};

const jestRestoreMocked = (spies) => {
  const spyRestore = (s) => s.mockRestore();
  try {
    spies.forEach(spyRestore);
  } catch (e) {
    Object.values(spies).forEach(spyRestore);
  }
};

const isUrlFormEncoded = (s) => strContains(s, '=');
const mockFnGetParamValueAtPosition = (mockFn, paramPosition, callNum = 0) => mockFn.mock.calls[callNum][paramPosition];
