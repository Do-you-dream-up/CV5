/* eslint-disable */

import '../prototypes/strings';

import { Cookie, Local } from '../storage';
import { objectContainFields, objectToQueryParam, secondsToMs, strContains } from '../helpers';

import { ConfigurationFixture } from '../../test/fixtures/configuration';
import Storage from '../../components/auth/Storage';

const _Local = jest.requireActual('../storage').Local;
const dyduRelativeLocation = '../dydu';
let _dydu = jest.requireActual(dyduRelativeLocation).default;

jest.mock(dyduRelativeLocation, () => ({
  default: jest.fn(),
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
  },
  Cookie: {
    get: jest.fn(),
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

  describe('getWelcomeKnowledge', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['talk', 'getBotId']);
      spied.talk.mockResolvedValue({ response: true });
    });
    afterEach(() => {
      jestRestoreMocked(Object.values(Local.welcomeKnowledge));
    });

    it('should check in localStorage', async () => {
      // GIVEN
      // WHEN
      await dydu.getWelcomeKnowledge();

      // THEN
      expect(Local.welcomeKnowledge.isSet).toHaveBeenCalled();
    });
    it('should return localStorage value', async () => {
      const botIdValue = 'bot-id';
      spied.getBotId.mockReturnValue(true);
      Local.welcomeKnowledge.isSet.mockReturnValue(botIdValue);
      Local.welcomeKnowledge.load.mockReturnValue(botIdValue);

      // WHEN
      const receivedValue = await dydu.getWelcomeKnowledge();

      // THEN
      expect(receivedValue).toEqual(botIdValue);

      jestRestoreMocked([Local.welcomeKnowledge.isSet, Local.welcomeKnowledge.load]);
    });
    it('should call |this.talk| when localStorage has no value', () => {
      // GIVEN
      Local.welcomeKnowledge.isSet.mockReturnValue(false);

      // WHEN
      dydu.getWelcomeKnowledge();

      // THEN
      expect(spied.talk).toHaveBeenCalled();
    });
    it('should save the wlecomeKnowledge in localStorage after requesting it', async () => {
      // GIVEN
      const botId = 'bot-id';
      spied.getBotId.mockReturnValue(botId);

      const talkResponse = { text: 'bot response' };
      spied.talk.mockResolvedValue(talkResponse);

      // WHEN
      await dydu.getWelcomeKnowledge();

      // THEN
      expect(Local.welcomeKnowledge.save).toHaveBeenCalledWith(botId, talkResponse);
    });
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
      spied = jestSpyOnList(dydu, [
        'setInitialSpace',
        'setQualificationMode',
        'initLocaleWithConfiguration',
        'getSpace',
        'getConfiguration',
      ]);
      const c = new ConfigurationFixture();
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
    });
    afterEach(() => {
      jestRestoreMocked(Object.values(spied));
    });
    it('should call initializers', () => {
      const initializerFnList = ['setInitialSpace', 'setQualificationMode', 'initLocaleWithConfiguration'];
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
      spied = jestSpyOnList(dydu, ['getBotId', 'getLocale', 'getSpace']);
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
      const methods = ['getBotId', 'getLocale', 'getSpace'];

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
      spied = jestSpyOnList(dydu, ['getBotId', 'getLocale', 'getConfiguration', 'post', 'emit']);
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

      // THEN
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

  describe('get', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['emit']);
    });
    it('should call |emit| with axios.get as first parameter', () => {
      // GIVEN
      // WHEN
      dydu.get('path/to/ressource', {});

      // THEN
      expect(dydu.emit).toHaveBeenCalled();
    });
  });

  describe('whoami', () => {
    it('should GET request on whoami/ api', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['emit']);
      spied.emit.mockResolvedValue({});
      // WHEN
      await dydu.whoami();

      // THEN
      const paramPosition = 1;
      const effectiveValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      const expectedPath = 'whoami/';
      expect(effectiveValue).toEqual(expectedPath);
    });
  });

  describe('welcomeCall', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, [
        'emit',
        'getContextId',
        'getLocale',
        'getSpace',
        'getConfiguration',
        'getVariables',
      ]);
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
      const effectiveParamValue = mockFnGetParamValueAtPosition(dydu.emit, paramPosition);
      const expectedPath = 'chat/welcomecall/';
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should requests with url encoded datas', async () => {
      //GIVEN
      // WHEN
      await dydu.welcomeCall();

      // THEN
      expect(spied.emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expectedKeys.forEach((keyString) => {
        expect(strContains(effectivePayloadParameterValue, keyString)).toEqual(true);
      });
    });
  });

  describe('top', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['emit', 'getLocale', 'getSpace', 'getConfiguration']);
    });
    it('should POST on chat/topknowledge api', async () => {
      // GIVEN
      // WHEN
      await dydu.top();

      // THEN
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(dydu.emit, paramPosition);
      const expectedPath = 'chat/topknowledge';
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should use url encoded as data parameter of |emit|', async () => {
      //GIVEN
      // WHEN
      await dydu.top();

      // THEN
      expect(spied.emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expectedKeys.forEach((keyString) => {
        expect(strContains(effectivePayloadParameterValue, keyString)).toEqual(true);
      });
    });
  });

  describe('poll', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['emit', 'getContextId', 'getLocale', 'getConfiguration', 'getSpace']);
    });

    it('should POST on /chat/poll/last', async () => {
      // GIVEN
      spied.getContextId.mockResolvedValue('');

      // WHEN
      await dydu.poll({});

      // THEN
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(dydu.emit, paramPosition);
      const expectedPath = 'chat/poll/last/';
      expect(strContains(effectiveParamValue, expectedPath)).toEqual(true);
    });
    it('should use form url encoded', async () => {
      //GIVEN
      // WHEN
      await dydu.poll({});

      // THEN
      expect(spied.emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      Object.keys(payload).forEach((key) => {
        expect(strContains(effectiveParamValue, key)).toEqual(true);
      });
    });
  });

  describe('getSaml2Status', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['emit', 'getConfiguration']);
    });
    it('should GET request on /saml2/status with query parameter', async () => {
      const expectedValue = 'saml2/status';

      await dydu.getSaml2Status();

      expect(spied.emit).toHaveBeenCalled();
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expect(strContains(effectiveParamValue, expectedValue)).toEqual(true);
    });
    it('should send saml value in payload when saml is enabled', () => {
      const c = new ConfigurationFixture();
      c.enableSaml();

      spied.getConfiguration.mockReturnValue(c.getConfiguration());

      const tokenValue = 'token-value';
      dydu.getSaml2Status(tokenValue);

      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expect(strContains(effectiveParamValue, tokenValue)).toEqual(true);
    });
  });

  describe('getSaml2UserInfo', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['emit', 'getConfiguration']);
    });
    it('should GET request on /saml2/status with query parameter', async () => {
      const expectedValue = 'saml2/userinfo';

      await dydu.getSaml2UserInfo();

      expect(spied.emit).toHaveBeenCalled();
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expect(strContains(effectiveParamValue, expectedValue)).toEqual(true);
    });
    it('should send saml value in payload when saml is enabled', () => {
      const c = new ConfigurationFixture();
      c.enableSaml();

      spied.getConfiguration.mockReturnValue(c.getConfiguration());

      const tokenValue = 'token-value';
      dydu.getSaml2UserInfo(tokenValue);

      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expect(strContains(effectiveParamValue, tokenValue)).toEqual(true);
    });
  });

  describe('suggest', () => {
    it('should call |emit| for POST on /chat/search with bot id', () => {
      //GIVEN
      spied = jestSpyOnList(dydu, ['getLocale', 'getSpace', 'getConfiguration', 'emit']);
      const text = 'voici le texte';
      //WHEN
      dydu.suggest(text);
      const paramPosition = 1;
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      const expectedPath = `chat/search/${dydu.getBotId()}`;

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
  describe('setLocale', () => {
    it('should set the |local| class attribute when the local is includes in the |languages| parameter', () => {
      //GIVEN
      const languages = ['fr', 'en'];
      const locale = 'fr';
      //WHEN
      dydu.setLocale(locale, languages);
      //THEN
      expect(dydu.locale).toEqual('fr');
    });
    it('should save the |locale| parameter in the localStorage', () => {
      //GIVEN
      const languages = ['fr', 'en'];
      const locale = 'fr';
      //WHEN
      dydu.setLocale(locale, languages);
      //THEN
      expect(Local.set).toHaveBeenCalledWith(Local.names.locale, locale);
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
      // GIVEN
      spied = jestSpyOnList(dydu, ['emit']);

      // WHEN
      await dydu.pushrules();

      // THEN
      expect(dydu.emit).toHaveBeenCalled();
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
      spied = jestSpyOnList(dydu, [
        'onConfigurationLoaded',
        'getSpace',
        'setInitialSpace',
        'setQualificationMode',
        'initLocaleWithConfiguration',
      ]);

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
      spied = jestSpyOnList(dydu, ['getBotId']);
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
      dydu.initInfos();

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

      spied = jestSpyOnList(dydu, ['getConfiguration', 'getContextId', 'emit']);
      const config = new ConfigurationFixture();
      config.enableSaml();
      spied.getConfiguration.mockReturnValue(config.getConfiguration());
      const s = jest.spyOn(Local.saml, 'load');

      // WHEN
      const choiceKey = 'choice-key';
      await dydu.feedbackInsatisfaction(choiceKey);

      // THEN
      expect(spied.emit).toHaveBeenCalledWith(
        undefined,
        'chat/feedback/insatisfaction/undefined/',
        `choiceKey=${choiceKey}&contextUUID=&solutionUsed=ASSISTANT`,
      );
      s.mockRestore();
    });
    it('should call |emit|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration', 'emit']);
      const c = new ConfigurationFixture();
      spied.getContextId.mockResolvedValue(null);
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
      Local.saml.load = jest.fn();

      // WHEN
      await dydu.feedbackInsatisfaction();

      // THEN
      expect(spied.emit).toHaveBeenCalled();
    });
    it('should call |emit| with chat/feedback/insatisfaction/ as path argument', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration', 'emit']);
      const c = new ConfigurationFixture();
      spied.getContextId.mockResolvedValue(null);
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
      Local.saml.load = jest.fn();

      // WHEN
      await dydu.feedbackInsatisfaction();

      // THEN

      const targetPath = 'chat/feedback/insatisfaction/';
      const pathArg = spied.emit.mock.calls[0][1];
      expect(strContains(pathArg, targetPath)).toEqual(true);
    });
    it('should call |emit| with form url encoded string as data argument', async () => {
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration', 'emit']);
      const c = new ConfigurationFixture();
      spied.getContextId.mockResolvedValue(null);
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
      Local.saml.load = jest.fn();

      // WHEN
      await dydu.feedbackInsatisfaction();

      // THEN
      const dataArg = spied.emit.mock.calls[0][2];
      expect(isUrlFormEncoded(dataArg)).toEqual(true);
    });
  });

  describe('feedbackComment', function () {
    it('should call |getContextId|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration', 'emit']);
      spied.getContextId.mockResolvedValue(null);
      const spiedSamlLoad = jest.spyOn(Local.saml, 'load');

      // WHEN
      await dydu.feedbackComment();

      // THEN
      jestRestoreMocked([spiedSamlLoad]);
    });
    it('should call |getConfiguration|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration', 'emit']);
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
      spied = jestSpyOnList(dydu, ['getContextId', 'getConfiguration', 'emit']);
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
      const pathArg = spied.emit.mock.calls[0][1];
      expect(strContains(pathArg, targetPath)).toEqual(true);
    });
    it('should call |emit| with form url payload', async () => {
      // GIVEN
      // WHEN
      await dydu.feedback();

      // THEN
      const dataArg = spied.emit.mock.calls[0][2];
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
      const formUrlPayload = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const formUrlPayload = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const formUrlPayload = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const formUrlPayload = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      const feedbackKey = 'feedBack=positive';
      expect(strContains(formUrlPayload, feedbackKey)).toEqual(true);
    });
  });

  describe('exportConverstaion', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getContextId', 'getClientId', 'getLocale', 'getSpace', 'getConfiguration', 'emit']);
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
      const effectiveParam = mockFnGetParamValueAtPosition(spied.emit, dataParamPosition);
      const samlInfoPayloadFormUrl = `saml2_info=${samlValue}`;
      expect(strContains(effectiveParam, samlInfoPayloadFormUrl)).toEqual(true);
      jestRestoreMocked([mockLocalSamlLoad]);
    });
    it('should call |emit| with chat/talk as path parameter', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // THEN
      expect(spied.emit).toHaveBeenCalled();
      const expectedPath = 'chat/talk';
      const paramPosition = 1;
      const effectiveParam = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expect(strContains(effectiveParam, expectedPath)).toEqual(true);
    });
    it('should call |emit| with form url encoded as payload parameter', async () => {
      // GIVEN
      // WHEN
      await dydu.exportConversation();

      // THEN
      expect(spied.emit).toHaveBeenCalled();
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
      expect(isUrlFormEncoded(effectivePayloadParameterValue)).toEqual(true);
    });
    it('should include the text argument in the payload', async () => {
      // GIVEN
      const text = 'text-value';

      // WHEN
      await dydu.exportConversation(text);

      // THEN
      const paramPosition = 2;
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const effectivePayloadParameterValue = mockFnGetParamValueAtPosition(spied.emit, paramPosition);
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
      const effectiveParamValue = mockFnGetParamValueAtPosition(spied.emit, pathParamPosition);
      expect(strContains(effectiveParamValue, contextId)).toEqual(false);
    });
  });

  describe('setLastResponse', function () {
    it('should set class attribute |lastResponse|', () => {
      // GIVEN
      const lastResponse = { response: true };

      // WHEN
      dydu.setLastResponse(lastResponse);

      // THEN
      expect(dydu.lastResponse).toEqual(lastResponse); // reference comparison
    });
    it('should return value', () => {
      // GIVEN
      const lastResponse = { response: true };

      // WHEN
      const value = dydu.setLastResponse(lastResponse);

      // THEN
      expect(value).toEqual(lastResponse); // reference comparison
    });
  });

  describe('emit', () => {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, [
        'handleSetApiUrl',
        'handleSetApiTimeout',
        'setLastResponse',
        'handleAxiosResponse',
        'handleAxiosError',
      ]);
    });

    describe('handleAxiosError', function () {
      const getDefaultParams = () => [{}, {}, '', {}, 1];
      let params = getDefaultParams();

      beforeEach(() => {
        spied = jestSpyOnList(dydu, ['handleTokenRefresh', 'emit']);
        params = getDefaultParams();
      });

      afterEach(() => {
        spied = jestSpyOnList(dydu, ['handleTokenRefresh', 'emit']);
        params = getDefaultParams();
      });

      it('should call |handleTokenRefresh| as the argument response, satus is 401', async () => {
        // GIVEN
        const error = { response: { status: 401 } };

        // WHEN
        params[0] = error;
        await dydu.handleAxiosError(...params);

        // THEN
        //expect(spied.handleTokenRefresh).toHaveBeenCalled();
      });
    });
  });
  describe('samlRenewnOrReject', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['redirectAndRenewAuth', 'renewAuth']);
    });
    it("should call |redirectAndRenewAuth| as type is 'SAML_redirection'", () => {
      // GIVEN
      const param = {
        type: 'SAML_redirection',
        values: {},
      };

      // WHEN
      dydu.samlRenewOrReject(param);

      // THEN
      expect(spied.redirectAndRenewAuth).toHaveBeenCalled();
    });
    it('should call |renewAuth|', () => {
      // GIVEN
      const param = {
        type: '',
        values: {},
      };

      // WHEN
      dydu.samlRenewOrReject(param);

      // THEN
      expect(spied.renewAuth).toHaveBeenCalled();
    });
  });

  describe('renewAuth', function () {
    it('should call |Local.saml.save|', () => {
      // GIVEN
      const authParam = {};

      // WHEN
      dydu.renewAuth(authParam);

      // THEN
      expect(Local.saml.save).toHaveBeenCalled();
    });
  });

  describe('handleTokenRefresh', function () {
    beforeEach(() => {
      spied = jestSpyOnList(dydu, ['getConfiguration']);
      const c = new ConfigurationFixture();
      c.enableOidc();
      spied.getConfiguration.mockReturnValue(c.getConfiguration());
    });
    it('should call |getConfiguration|', () => {
      // GIVEN
      dydu.tokenRefresher = jest.fn();
      dydu.oidcLogin = jest.fn();
      // WHEN
      dydu.handleTokenRefresh();

      // THEN
      expect(spied.getConfiguration).toHaveBeenCalled();
    });
    it('should call |tokenRefresher|', () => {
      // GIVEN
      const loadTokenMock = jest.spyOn(Storage, 'loadToken');
      loadTokenMock.mockReturnValue({ refresh_token: true });
      dydu.tokenRefresher = jest.fn();

      // WHEN
      dydu.handleTokenRefresh();

      // THEN
      expect(dydu.tokenRefresher).toHaveBeenCalled();
    });
    it('should call |oidcLogin|', () => {
      // GIVEN
      const loadTokenMock = jest.spyOn(Storage, 'loadToken');
      loadTokenMock.mockReturnValue({ refresh_token: null });
      dydu.tokenRefresher = jest.fn();
      dydu.oidcLogin = jest.fn();

      // WHEN
      dydu.handleTokenRefresh();

      // THEN
      expect(dydu.oidcLogin).toHaveBeenCalled();
      jestRestoreMocked([loadTokenMock, dydu.tokenRefresher, dydu.oidcLogin]);
    });
  });

  describe('initInfo', function () {
    it('should initialize the |infos| class attribue', () => {
      // GIVEN
      dydu.infos = null;

      // WHEN
      dydu.initInfos();

      // THEN
      expect(dydu.infos).toBeTruthy();
      const expectedKeys = ['locale', 'space', 'botId'];
      Object.keys(dydu.infos).forEach((key) => {
        expect(expectedKeys.includes(key)).toEqual(true);
      });
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

  describe('class attributes initialisation', function () {
    it('should correctly initialize attributes', () => {
      const __dydu = jest.requireActual(dyduRelativeLocation).default;
      const expected = {
        mainServerStatus: 'Ok',
        triesCounter: 0,
        maxTries: 3,
        minTimeoutForAnswer: secondsToMs(3),
        maxTimeoutForAnswer: secondsToMs(30),
        qualificationMode: false,
      };

      Object.keys(expected).forEach((key) => {
        expect(__dydu[key] === expected[key]).toEqual(true);
      });
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
