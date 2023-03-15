/* eslint-disable */

import { Cookie, Local } from './storage';
import { ConfigurationFixture } from '../test/fixtures/configuration';
import { objectToQueryParam } from './helpers';

let _dydu = jest.requireActual('../tools/dydu').default;

jest.mock('../tools/dydu', () => ({
  default: jest.fn(),
}));

jest.mock('./storage', () => ({
  Local: {
    saml: {
      load: jest.fn(),
    },
    get: jest.fn(),
    set: jest.fn(),
    names: { space: 'LS-KEY-SPACE' },
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

beforeEach(() => {
  jestRestoreMocked(spied);
  spied = [];
  dydu = _dydu;
});

afterEach(() => {
  jestRestoreMocked(spied);
  spied = [];
  dydu = _dydu;
});

describe('dydu.js', function () {
  describe('getWelcomeKnowledge', function () {
    it('should check in localStorage', () => {});
    it('should return localStorage value', () => {});
    it('should call |this.talk| when localStorage has no value', () => {});
    it('should save the wlecomeKnowledge in localStorage after requesting it', () => {});
  });

  describe('getConfiguration', function () {
    it('should call |this.configuration|', () => {});
    it('should return the short format of local value from configuration', () => {});
    it('should get the value from local browser when error occurs accessing the configuration', () => {});
  });

  describe('setConfiguration', function () {
    it('should set the configuration', () => {});
    it('should call |this.onConfigurationLoaded| after set confiration', () => {});
  });

  describe('onConfigurationLoaded', function () {
    it('should call initializer', () => {});
  });

  describe('initLocalWithConfiguration', () => {
    it('should get the local from Browser as configuration |getDefaultLanguageFromSite| is true', () => {});
    it('should get the local from configuration as |getDefaultLanguageFromSite| is false', () => {});
    it('should init I18N with the determinated locale', () => {});
  });

  describe('registerVisit', () => {
    it('should call |this.wellcomeCall|', () => {});
    it('should register the |getInfos| values in Local', () => {});
  });

  describe('getInfos', function () {
    it('should match info object design', () => {});
    it('should call methods to feed the info object', () => {});
  });

  describe('getSurvey', () => {
    it('should return null when argument is null or undefined', () => {});
    it('should call /chat/survey/configuration with the |surveyId| argument', () => {});
    it('should use a formUrlEncoded data', () => {});
    it('should make a post', () => {});
  });

  describe('sendSurvey', function () {
    it('should returns when not payload is given as argument', () => {});
    it('should POST on /chat/survey', () => {});
    it('should call |this.displaySurveySent| as a resolve of POST request', () => {});
  });

  describe('displaySurveySent', () => {
    it('should call |window.dydu.chat.reply| with error message string', () => {});
    it('should call |window.dydu.chat.reply| with success message string', () => {});
  });

  describe('createSurveyPayload', function () {
    it('should create correct object', () => {});
  });

  describe('sendSurveyPolling', () => {
    it('should GET on /servlet/chatHttp api', () => {});
    it('should set the lastResponse to the just fetched value', () => {});
    it('should call |displaySurveySent| after setting |lastResponse|', () => {});
  });

  describe('getTalkBasePayload', function () {
    it('should return a talk object payload', () => {});
    it('should considere option argument for |doNotRegisterInteraction| field', () => {});
    it('should call methods to get values', () => {});
  });

  describe('formatFieldsForSurveyAnswerRequest', () => {
    it('should return an object with fields keys prepended by field_', () => {});
  });

  describe('get', function () {
    it('should call |emit| with axios.get as first parameter', () => {});
  });

  describe('post', function () {
    it('should call |emit| with axios.post as first parameter', () => {});
  });

  describe('whoami', () => {
    it('should GET request on whoami/ api', () => {});
  });

  describe('welcomeCall', function () {
    it('should call |getContextId|', () => {});
    it('should POST request on chat/welcomecall/', () => {});
    it('should requests with url encoded datas', () => {});
    it('should match correct datas', () => {});
  });

  describe('top', () => {
    it('should POST on chat/topknowledge api', () => {});
    it('should use url encoded as data parameter of |emit|', () => {});
    it('should match correct datas', () => {});
  });

  describe('getBotId', () => {
    it('should return the correct bot id', () => {});
  });

  describe('poll', () => {
    it('should POST on /chat/poll/last', () => {});
    it('should use form url encoded', () => {});
    it('should send correct payload', () => {});
  });

  describe('typing', () => {
    it('should GET request on /servlet/chatHttp with url parameter', () => {});
    it('should user |server| from bot.json as domain value', () => {});
    it('should use https protocol', () => {});
  });

  describe('getSaml2Status', () => {
    it('should GET request on /saml2/status with query parameter', () => {});
    it('should use correct query parameters keys', () => {});
  });

  describe('getServerStatus', () => {
    it('should GET request on /serverstatus', () => {});
  });

  describe('handleSpaceWithTalkResponse', () => {
    it('should check #guiCSName keys in the argument object', () => {});
    it('should call |setSpace| if #guiCSName is defined', () => {});
    it('should not modify the argument and return it', () => {});
  });

  describe('processTalkResponse', () => {
    it('should call |handleSpaceWithTalkResponse|', () => {});
    it('should call |handleKnownledgeQuerySurveyWithTalkResponse|', () => {});
    it('should not modify the argument and return it as is', () => {});
  });

  describe('talk', () => {
    it('should call |emit| for POST on /chat/talk using bot id and context id', () => {});
    it('should create a correct payload', () => {});
    it('should includes saml infos as part of the payload if it is enabled in configuration', () => {});
    it('should use a form url encoded payload', () => {});
  });

  describe('suggest', () => {
    it('should call |emit| for POST on /chat/search with bot id', () => {});
    it('should uses form url data encoding', () => {});
  });

  describe('qualificationMode', () => {
    it('should get the value from window object', () => {});
    it('should use the argument as value', () => {});
    it('should set the |qualificationMode| class attribute', () => {});
  });

  describe('setSpace', () => {
    it('should set the |space| class attribute to the argument', () => {});
    it('should save the space to localStorage', () => {});
    it("should save lowercased if value is 'defaul'", () => {});
  });
  describe('getContextVariables', () => {
    it('should return an html list of variables', () => {});
  });
  describe('setLocale', () => {
    it('should set the |local| class attribute when the local is includes in the |languages| parameter', () => {});
    it('should save the |locale| parameter in the localStorage', () => {});
  });

  describe('reset', () => {
    it('should call |getContextId| with parameter to force request', () => {});
    it('should |emit| POST request to path chat/context/ and bot id', () => {});
  });

  describe('printHistory', () => {
    it('should call |getContextId|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId']);

      // WHEN
      await dydu.printHistory();

      // THEN
      expect(spied.getContextId).toHaveBeenCalled();
    });
    it('should insert an iframe with correct path', () => {});
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
    it('should |emit| POST request on /chat/pushrules and bot id', () => {});
  });

  describe('history', () => {
    it('should call |getContextId|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId']);

      // WHEN
      await dydu.history();

      // THEN
      expect(spied.getContextId).toHaveBeenCalled();
    });
    it('should call |emit| when contextId exist', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['emit', 'getContextId']);
      spied.getContextId.mockResolvedValue('context-id');

      // WHEN
      await dydu.history();

      // THEN
      expect(spied.emit).toHaveBeenCalled();
    });
    it('should |emit| POST request with chat/history path and correct data', () => {});
  });

  describe('getSpace', () => {
    const { location } = window;
    beforeAll(() => {
      delete window.location;
      window.location = { href: '' };
    });

    afterAll(() => {
      window.location = location;
    });

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
    it('should use hostname strategy', () => {
      // GIVEN
      const targetHostname = 'target-hostname.io';
      window.location = {
        hostname: targetHostname,
      };

      const expectedResult = 'expected-space';
      const hostnameModeItem = {
        mode: ConfigurationFixture.SPACE_DETECTION_MODE.hostname,
        active: true,
        value: {
          [targetHostname]: expectedResult,
        },
      };
      const configuration = new ConfigurationFixture();
      configuration.updateSpaceDetectionMode(hostnameModeItem);
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
    it('should use route strategy', () => {
      // GIVEN
      const targetPathname = '/urlpart/test/file';
      window.location = {
        pathname: targetPathname,
      };

      const expectedResult = 'expected-space';
      const routeModeItem = {
        mode: ConfigurationFixture.SPACE_DETECTION_MODE.route,
        active: true,
        value: {
          [targetPathname]: expectedResult,
        },
      };
      const configuration = new ConfigurationFixture();
      configuration.updateSpaceDetectionMode(routeModeItem);
      const strategies = configuration.getSpaceConfig().detection;

      // WHEN
      const receivedSpace = dydu.getSpace(strategies);

      // THEN
      expect(receivedSpace).toEqual(expectedResult);
    });
    it('should use urlparameter strategy', () => {
      // GIVEN
      const expectedResult = 'urlpart';
      const targetQparameterName = 'test';
      const targetSearch = `?${targetQparameterName}=${expectedResult}`;
      window.location = {
        search: targetSearch,
      };

      const urlparameterModeItem = {
        mode: ConfigurationFixture.SPACE_DETECTION_MODE.urlparameter,
        active: true,
        value: targetQparameterName,
      };
      const configuration = new ConfigurationFixture();
      configuration.updateSpaceDetectionMode(urlparameterModeItem);
      const strategies = configuration.getSpaceConfig().detection;

      // WHEN
      const receivedSpace = dydu.getSpace(strategies);

      // THEN
      expect(receivedSpace).toEqual(expectedResult);
    });
    it('should use urlpart strategy', () => {
      // GIVEN
      // set current url
      window.location = {
        href: 'http://currenthref/urlpart/test/file',
      };

      // activate urlpart Item
      const urlpartTarget = 'urlpart/test/';
      const urlpartSpaceName = 'urlpart-space-name';
      const urlpartDetectionItem = {
        mode: ConfigurationFixture.SPACE_DETECTION_MODE.urlpart,
        active: true,
        value: {
          [urlpartTarget]: urlpartSpaceName,
        },
      };
      const configuration = new ConfigurationFixture();
      configuration.updateSpaceDetectionMode(urlpartDetectionItem);

      // get strategy list
      const strategies = configuration.getSpaceConfig().detection;

      // WHEN
      const receivedSpace = dydu.getSpace(strategies);

      // THEN
      expect(receivedSpace).toEqual(urlpartSpaceName);
    });
  });

  describe('getLocal', () => {
    it('should get local from configuration when |locale| class attribute is not defined', () => {});
    it('should get locale value from localStorage when |locale| class attribute is not defined', () => {});
    it('should get locale from site document when configuration |getDefaultLanguageFromSite| is set to true', () => {});
    it('should not save language dash separator in localstorage', () => {});
    it('should not contains language dash separator', () => {});
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

  describe('setContextId', () => {
    it('should call |saveContextIdToLocalStorage| with the argument when argument is defined', () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['saveContextIdToLocalStorage']);

      // WHEN
      const contextId = 'context-id';
      dydu.setContextId(contextId);

      // THEN
      expect(spied.saveContextIdToLocalStorage).toHaveBeenCalledWith(contextId);
    });
  });

  describe('saveContextIdToLocalStorage', function () {
    it('it should call |getContextIdStorageKey|', () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextIdStorageKey']);
      const s = jest.spyOn(Local.contextId, 'save');

      // WHEN
      const contextId = 'context-id';
      dydu.saveContextIdToLocalStorage(contextId);

      // THEN
      expect(spied.getContextIdStorageKey).toHaveBeenCalled();
      s.mockRestore();
    });
    it('should call |Local.contextId.save| with the correct key and value', () => {
      // GIVEN
      const contextIdKey = 'context-id-key';
      spied = jestSpyOnList(dydu, ['getContextIdStorageKey']);
      dydu.getContextIdStorageKey.mockReturnValue(contextIdKey);
      const s = jest.spyOn(Local.contextId, 'save');

      // WHEN
      const contextIdValue = 'context-id-value';
      dydu.saveContextIdToLocalStorage(contextIdValue);

      // THEN
      expect(s).toHaveBeenCalledWith(contextIdKey, contextIdValue);
      s.mockRestore();
    });
  });

  describe('getContextId', function () {
    it('should call |getContextIdFromLocalStorage| when argument is false or is not set', () => {});
    it('should |emit| POST on chat/context with form url encoded data', () => {});
    it('should call |setContextId| with the request response', () => {});
    it('should return empty string if error occurs', () => {});
    it('should send correct payload', () => {});
  });

  describe('getContextIdFromLocalStorage', function () {
    it('should call |getContextIdStorageKey', () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextIdStorageKey']);

      // WHEN
      dydu.getContextIdFromLocalStorage();

      // THEN
      expect(spied.getContextIdStorageKey).toHaveBeenCalled();
    });
    it('should call |Local.contextId.load| with key from storage', () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextIdStorageKey']);
      const storageSavedKey = 'storage-saved-key';
      spied.getContextIdStorageKey.mockReturnValue(storageSavedKey);

      const s = jest.spyOn(Local.contextId, 'load');

      // WHEN
      dydu.getContextIdFromLocalStorage();

      // THEN
      expect(s).toHaveBeenCalledWith(storageSavedKey);
      s.mockRestore();
    });
  });

  describe('getContextIdStorageKey', function () {
    it('should call |Local.contextId.createKey|', () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getBotId']);
      const s = jest.spyOn(Local.contextId, 'createKey');

      // WHEN
      dydu.getContextIdStorageKey();

      // THEN
      expect(s).toHaveBeenCalled();
      s.mockRestore();
    });
    it('should call |getBotId|', () => {
      // GIVEN
      dydu.getBotId = jest.fn();

      // WHEN
      dydu.getContextIdStorageKey();

      // THEN
      expect(dydu.getBotId).toHaveBeenCalled();
    });
    it('should call |Local.contextId.createKey| with currentBotId and configId', () => {
      // GIVEN
      const currentBotId = 'current-bot-id';
      dydu.getBotId = jest.fn().mockReturnValue(currentBotId);

      //const currentConfigId = "current-config-id"; // to fix
      const currentConfigId = undefined;
      const botConfigContentFile = {
        bot: 'bot-id',
        configId: currentConfigId,
        server: 'server',
        backUpServer: 'backupServer',
      };
      window.location = {
        search: `?${objectToQueryParam(botConfigContentFile)}`,
      };
      /*
      loadDyduWithBotConfig({
        bot: "bot-id",
        configId: currentConfigId,
        server: "server",
        backUpServer: "backupServer"
      });
       */

      // WHEN
      dydu.getContextIdStorageKey();

      expect(Local.contextId.createKey).toHaveBeenCalledWith(currentBotId, currentConfigId);
    });
  });

  describe('getClientId', function () {
    it('should call |Local.clientId.getKey| with infoObject', () => {
      // GIVEN
      const infoObject = {
        locale: 'locale',
        space: 'space',
        botId: 'botId',
      };
      dydu.infos = infoObject;

      // WHEN
      dydu.getClientId();

      // THEN
      expect(Local.clientId.getKey).toHaveBeenCalledWith(infoObject);
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
    it('should call |Local.clientId.load|', () => {
      // GIVEN
      const infoObject = {
        locale: 'locale',
        space: 'space',
        botId: 'botId',
      };
      dydu.infos = infoObject;

      // WHEN
      dydu.getClientId();

      // THEN
      expect(Local.clientId.getKey).toHaveBeenCalledWith(infoObject);
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

  describe('gdpr', function () {
    it('should call |emit|', () => {
      // GIVEN
    });
    it('should call |emit| for POST', () => {});
    it('should call |emit| with chat/gdpr as path argument', () => {});
    it('should call |emit| with form url encoded string as data argument', () => {});
    it('should include saml infos in payload if it is enabled in configuration', () => {});
  });

  describe('feedbackInsatisfaction', function () {
    it('should call |getContextId|', async () => {
      // GIVEN
      spied = jestSpyOnList(dydu, ['getContextId']);

      // WHEN
      await dydu.feedbackInsatisfaction();

      // THEN
      expect(spied.getContextId).toHaveBeenCalled();
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
    it('should call |emit| for POST', () => {});
    it('should call |emit| with chat/feedback/insatisfaction/ as path argument', () => {});
    it('should call |emit| with form url encoded string as data argument', () => {});
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
