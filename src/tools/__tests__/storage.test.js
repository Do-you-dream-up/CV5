import { Cookie, Local, Session } from '../storage';

import cookie from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

jest.mock('js-cookie');
describe('Local storage by bot id', () => {
  const contextName = Local.names.context;
  beforeEach(() => {
    localStorage.clear();
  });
  it('Should populate if no botsById store is present', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    Local.byBotId('xxx').get(Local.names.context);
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeDefined();
    const botsById = JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));
    expect(botsById).toBeInstanceOf(Object);
  });
  it('Given a botId, it should populate the store if no bot associated to the id is found', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    Local.byBotId('xxx').get(Local.names.context);
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeDefined();
    const botsById = JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));
    expect(botsById).toHaveProperty('xxx');
    expect(botsById['xxx']).toHaveProperty('id', 'xxx');
    expect(botsById['xxx'][Local.names.context]).toBe('');
  });
  it('Given a botId and a key, it should retrieve associated key associated to the bot', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    localStorage.setItem(
      Local._BOTS_BY_ID_KEY,
      JSON.stringify({
        xxx: {
          id: 'xxx',
          [Local.names.context]: 'unbelievable',
          extraKey: 'extraValue',
        },
      }),
    );
    const context = Local.byBotId('xxx').get(Local.names.context);
    expect(context).toBe('unbelievable');
    const extra = Local.byBotId('xxx').get('extraKey');
    expect(extra).toBe('extraValue');
  });
  it('Given a botId, a key and a value, it should set the given key to the given value into the given bot & do not touch to others bots', () => {
    expect(localStorage.getItem(Local._BOTS_BY_ID_KEY)).toBeNull();
    localStorage.setItem(
      Local._BOTS_BY_ID_KEY,
      JSON.stringify({
        xxx: {
          id: 'xxx',
          [Local.names.context]: 'unbelievable',
          extraKey: 'extraValue',
        },
        yyy: {
          id: 'yyy',
        },
      }),
    );
    Local.byBotId('xxx').set(Local.names.context, 'new ctx');
    Local.byBotId('xxx').set('extraKey', 'new extra value');
    Local.byBotId('xxx').set('not initial', 'new upsert');
    const botsById = JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));
    const currentBot = botsById['xxx'];
    expect(currentBot[Local.names.context]).toBe('new ctx');
    expect(currentBot).toHaveProperty('extraKey', 'new extra value');
    expect(currentBot).toHaveProperty('not initial', 'new upsert');

    const otherBot = botsById['yyy'];
    expect(otherBot).toHaveProperty('id', 'yyy');
  });

  test('should set initialStore in localStorage if botsById is not an object', () => {
    localStorage.setItem(Local._BOTS_BY_ID_KEY, 'not an object');

    Local._populateBotsById();

    const botsById = JSON.parse(localStorage.getItem(Local._BOTS_BY_ID_KEY));

    expect(botsById).toEqual(Local._getInitialStore());
  });

  describe('clear', () => {
    it('should clear all local storage', () => {
      localStorage.setItem(contextName, 'value');
      Local.clear();
      expect(localStorage.getItem(contextName)).toBeNull();
    });

    it('should clear a specific key if passed', () => {
      localStorage.setItem(contextName, 'value');
      Local.clear(contextName);
      expect(localStorage.getItem(contextName)).toBeNull();
    });

    it('should clear a specific item in local storage', () => {
      localStorage.setItem('test1', 'test value 1');
      localStorage.setItem('test2', 'test value 2');
      Local.clear('test1');
      expect(localStorage.getItem('test1')).toBeNull();
      expect(localStorage.getItem('test2')).not.toBeNull();
    });
  });

  describe('get', () => {
    it('should return a value from local storage', () => {
      localStorage.setItem('test', 'test value');
      const result = Local.get('test');
      expect(result).toBe('test value');
    });

    it('should return a fallback value when item not in local storage', () => {
      const fallback = 'test fallback value';
      const result = Local.get('test', fallback);
      expect(result).toBe(fallback);
    });

    it('should call a function as a fallback value', () => {
      const fallbackFn = jest.fn(() => 'test fallback value');
      const result = Local.get('test', fallbackFn);
      expect(fallbackFn).toHaveBeenCalled();
      expect(result).toBe('test fallback value');
    });

    it('should set the fallback value if save is true', () => {
      const fallback = 'test fallback value';
      Local.get('test', fallback, true);
      expect(localStorage.getItem('test')).toBe(fallback);
    });

    it('should return parsed JSON from local storage', () => {
      const data = { key: 'test value' };
      localStorage.setItem('test', JSON.stringify(data));
      const result = Local.get('test');
      expect(result).toEqual(data);
    });

    it('should return non-parsed value if unable to parse JSON from local storage', () => {
      const data = 'invalid JSON';
      localStorage.setItem('test', data);
      const result = Local.get('test');
      expect(result).toEqual(data);
    });

    describe('saml', () => {
      beforeEach(() => {
        // Reset localStorage before each test
        localStorage.clear();
      });

      describe('save', () => {
        it('should save the data to localStorage', () => {
          const data = 'some-saml-data';
          Local.saml.save(data);
          expect(localStorage.getItem(Local.names.saml)).toEqual(data);
        });
      });

      describe('load', () => {
        it('should load the data from localStorage', () => {
          const data = 'some-saml-data';
          localStorage.setItem(Local.names.saml, data);
          expect(Local.saml.load()).toEqual(data);
        });

        it('should return null if there is no data in localStorage', () => {
          expect(Local.saml.load()).toBeNull();
        });
      });

      describe('remove', () => {
        it('should remove the data from localStorage', () => {
          const data = 'some-saml-data';
          localStorage.setItem(Local.names.saml, data);
          Local.saml.remove();
          expect(localStorage.getItem(Local.names.saml)).toBeNull();
        });
      });
    });

    describe('isLivechatOn', () => {
      beforeEach(() => {
        localStorage.clear();
      });

      describe('save', () => {
        it('should save data to local storage', () => {
          Local.isLivechatOn.save(true);
          const savedData = JSON.parse(localStorage.getItem(Local.names.isLivechatOn));
          expect(savedData).toEqual(true);
        });
      });

      describe('load', () => {
        it('should return an empty object if no data is saved', () => {
          const loadedData = Local.isLivechatOn.load();
          expect(loadedData).toEqual(false);
        });

        it('should return the saved data', () => {
          localStorage.setItem(Local.names.isLivechatOn, JSON.stringify(true));
          const loadedData = Local.isLivechatOn.load();
          expect(loadedData).toEqual(true);
        });
      });

      describe('reset', () => {
        it('should reset the saved data to an empty object', () => {
          localStorage.setItem(Local.names.isLivechatOn, JSON.stringify(true));
          Local.isLivechatOn.reset();
          const savedData = JSON.parse(localStorage.getItem(Local.names.isLivechatOn));
          expect(savedData).toEqual(false);
        });
      });
    });

    describe('viewMode', () => {
      const testData = 'fullscreen';

      beforeEach(() => {
        localStorage.clear();
      });

      describe('load', () => {
        it('should return null if no data is saved', () => {
          const loadedData = Local.viewMode.load();
          expect(loadedData).toBeNull();
        });

        it('should return the saved data', () => {
          localStorage.setItem(Local.names.open, testData);
          const loadedData = Local.viewMode.load();
          expect(loadedData).toEqual(testData);
        });
      });

      describe('save', () => {
        it('should save data to local storage', () => {
          Local.viewMode.save(testData);
          const savedData = localStorage.getItem(Local.names.open);
          expect(savedData).toEqual(testData);
        });
      });
    });

    describe('visit', () => {
      const testParams = { locale: 'en', space: 'home', botId: 'abc123' };

      beforeEach(() => {
        localStorage.clear();
      });

      describe('getKey', () => {
        it('should return the correct key string', () => {
          const keyString = Local.visit.getKey(testParams);
          expect(keyString).toEqual(`DYDU_lastvisitfor_${testParams.botId}_${testParams.space}_${testParams.locale}`);
        });
      });

      describe('load', () => {
        it('should return null if no data is saved', () => {
          const loadedData = Local.visit.load();
          expect(loadedData).toBeNull();
        });

        it('should return the saved data', () => {
          const keyString = Local.visit.getKey(testParams);
          localStorage.setItem(keyString, '123456789');
          const loadedData = Local.visit.load(keyString);
          expect(loadedData).toEqual('123456789');
        });
      });

      describe('isSet', () => {
        it('should return false if no data is saved', () => {
          const isDataSet = Local.visit.isSet();
          expect(isDataSet).toBe(false);
        });

        it('should return false if data is saved but empty', () => {
          const keyString = Local.visit.getKey(testParams);
          localStorage.setItem(keyString, '');
          const isDataSet = Local.visit.isSet(keyString);
          expect(isDataSet).toBe(true);
        });

        it('should return true if data is saved and not empty', () => {
          const keyString = Local.visit.getKey(testParams);
          localStorage.setItem(keyString, '123456789');
          const isDataSet = Local.visit.isSet(keyString);
          expect(isDataSet).toBe(true);
        });
      });

      describe('save', () => {
        it('should save data to local storage', () => {
          Local.visit.save(testParams);
          const keyString = Local.visit.getKey(testParams);
          const savedData = localStorage.getItem(keyString);
          expect(savedData).not.toBeNull();
        });
      });
    });

    describe('clientId', () => {
      const testParams = { locale: 'en', space: 'home', botId: 'abc123' };

      beforeEach(() => {
        localStorage.clear();
      });

      describe('getKey', () => {
        it('should return the correct key string', () => {
          const keyString = Local.clientId.getKey(testParams);
          expect(keyString).toEqual(`DYDU_clientId_${testParams.botId}_${testParams.space}_${testParams.locale}`);
        });
      });

      describe('load', () => {
        it('should return an empty string if no data is saved', () => {
          const loadedData = Local.clientId.load();
          expect(loadedData).toEqual('');
        });

        it('should return the saved data', () => {
          const keyString = Local.clientId.getKey(testParams);
          localStorage.setItem(keyString, 'testClientId');
          const loadedData = Local.clientId.load(keyString);
          expect(loadedData).toEqual('testClientId');
        });
      });

      describe('isSet', () => {
        it('should return false if no data is saved', () => {
          const isDataSet = Local.clientId.isSet();
          expect(isDataSet).toBe(false);
        });

        it('should return false if data is saved but empty', () => {
          const keyString = Local.clientId.getKey(testParams);
          localStorage.setItem(keyString, '');
          const isDataSet = Local.clientId.isSet(keyString);
          expect(isDataSet).toBe(false);
        });

        it('should return false if data is an empty object', () => {
          const keyString = Local.clientId.getKey(testParams);
          localStorage.setItem(keyString, JSON.stringify({}));
          const isDataSet = Local.clientId.isSet(keyString);
          expect(isDataSet).toBe(true);
        });

        it('should return true if data is saved and not empty', () => {
          const keyString = Local.clientId.getKey(testParams);
          localStorage.setItem(keyString, 'testClientId');
          const isDataSet = Local.clientId.isSet(keyString);
          expect(isDataSet).toBe(true);
        });
      });

      describe('createAndSave', () => {
        it('should save a new client ID to local storage', () => {
          const keyString = Local.clientId.getKey(testParams);
          Local.clientId.createAndSave(keyString);
          const savedData = localStorage.getItem(keyString);
          expect(savedData).not.toBeNull();
        });

        it('should generate a new client ID with the correct format', () => {
          const keyString = Local.clientId.getKey(testParams);
          Local.clientId.createAndSave(keyString);
          const savedData = localStorage.getItem(keyString);
          const regex = /^[a-zA-Z0-9]{15}$/;
          expect(regex.test(savedData)).toBe(true);
        });
      });
    });

    describe('secondary', () => {
      afterEach(() => {
        localStorage.clear(); // Nettoyer le localStorage après chaque test
      });

      describe('getKey', () => {
        it('should return the correct key string', () => {
          const keyString = Local.secondary.getKey();
          expect(keyString).toBe('dydu.secondary');
        });
      });

      describe('load', () => {
        it('should return false if nothing has been saved in the localStorage', () => {
          const result = Local.secondary.load();
          expect(result).toBe(false);
        });

        it('should return the saved value if there is one in the localStorage', () => {
          localStorage.setItem('dydu.secondary', 'true');
          const result = Local.secondary.load();
          expect(result).toBe('true');
        });
      });

      describe('save', () => {
        it('should save the given value to localStorage if it is different from the current value', () => {
          localStorage.setItem('dydu.secondary', 'false');
          Local.secondary.save('true');
          const result = localStorage.getItem('dydu.secondary');
          expect(result).toBe('true');
        });

        it('should not save the given value to localStorage if it is the same as the current value', () => {
          localStorage.setItem('DYDU_secondary', 'true');
          Local.secondary.save('true');
          const result = localStorage.getItem('DYDU_secondary');
          expect(result).toBe('true');
        });
      });
    });

    beforeEach(() => {
      sessionStorage.clear();
    });

    it('should set and get a session storage variable', () => {
      Session.set('contextId', '1234');
      const contextId = Session.get('contextId');
      expect(contextId.toString()).toBe('1234');
    });

    it('should get a fallback value if the session storage variable is not defined', () => {
      const contextId = Session.get('contextId', '1234');
      expect(contextId.toString()).toBe('1234');
    });

    it('should save a fallback value in the session storage', () => {
      Session.get('contextId', '1234', true);
      const contextId = Session.get('contextId');
      expect(contextId.toString()).toBe('1234');
    });

    it('should parse a JSON value from the session storage', () => {
      Session.set('contextId', '{"id":"1234"}');
      const contextId = Session.get('contextId');
      expect(contextId).toEqual({ id: '1234' });
    });

    it('should return a non-JSON value as is from the session storage', () => {
      Session.set('contextId', '1234');
      const contextId = Session.get('contextId');
      expect(contextId.toString()).toBe('1234');
    });

    it('should clear a session storage variable', () => {
      Session.set('contextId', '1234');
      Session.clear('contextId');
      const contextId = Session.get('contextId');
      expect(contextId).toBeNull();
    });

    it('should clear all session storage variables', () => {
      Session.set('contextId', '1234');
      Session.clear();
      const contextId = Session.get('contextId');
      expect(contextId).toBeNull();
    });
    describe('contextId', () => {
      const botId = 'bot1';
      const directoryId = 'directory1';

      describe('createKey', () => {
        test('should return key with botId and directoryId separated by a dot', () => {
          const key = Local.contextId.createKey(botId, directoryId);
          expect(key).toEqual(`${botId}.${directoryId}`);
        });

        test('should return key with only botId when directoryId is empty', () => {
          const key = Local.contextId.createKey(botId, '');
          expect(key).toEqual(botId);
        });

        test('should return key with only directoryId when botId is empty', () => {
          const key = Local.contextId.createKey('', directoryId);
          expect(key).toEqual('.' + directoryId);
        });

        test('should return key with empty string when both botId and directoryId are empty', () => {
          const key = Local.contextId.createKey('', '');
          expect(key).toEqual('');
        });
      });

      describe('save', () => {
        afterEach(() => {
          localStorage.clear();
          Local.clear();
        });

        it('should throw an error when key is not a non-empty string', () => {
          expect(() => {
            Local.contextId.save(null, {});
          }).toThrow();

          expect(() => {
            Local.contextId.save('', {});
          }).toThrow();

          expect(() => {
            Local.contextId.save(undefined, {});
          }).toThrow();
        });
      });

      describe('isSet', () => {
        afterEach(() => {
          localStorage.clear();
        });

        test('should return false if value is not set in localStorage with given key', () => {
          const key = Local.contextId.createKey(botId, directoryId);
          expect(Local.contextId.isSet(key)).toBe(false);
        });
      });

      describe('load', () => {
        afterEach(() => {
          localStorage.clear();
        });

        // test('should return value stored in localStorage with given key', () => {
        //   const key = Local.contextId.createKey(botId, directoryId);
        //   const value = 'context value';
        //   localStorage.setItem(key, value);
        //   expect(Local.contextId.load(key)).toEqual(value);
        // });

        test('should return null if value is not set in localStorage with given key', () => {
          const key = Local.contextId.createKey(botId, directoryId);
          expect(Local.contextId.load(key)).toBeNull();
        });
      });
    });

    describe('welcomeKnowledge', () => {
      describe('getSessionStorageDefaultLocalStorage', () => {
        it('does not save a new bot interaction if one already exists', () => {
          Local.welcomeKnowledge.save('bot1', { id: 'bot1' });
          const saveMock = jest.fn();
          Local.welcomeKnowledge.saveMapStore = saveMock;
          Local.welcomeKnowledge.save('bot1', { id: 'bot1' });
          expect(saveMock).not.toHaveBeenCalled();
        });
        test('isSet should return false when botId is not set', () => {
          const result = Local.welcomeKnowledge.isSet();
          expect(result).toBe(false);
        });

        test('isSet should return false when botId is not saved', () => {
          const result = Local.welcomeKnowledge.isSet('nonexistent-bot');
          expect(result).toBe(false);
        });

        test('isSet should return true when botId is saved', () => {
          const botId = 'my-bot';
          const wkInteraction = { greeting: 'Hello' };
          Local.welcomeKnowledge.save(botId, wkInteraction);
          const result = Local.welcomeKnowledge.isSet(botId);
          expect(result).toBe(false);
        });

        test('load should return null when botId is not set', () => {
          const result = Local.welcomeKnowledge.load();
          expect(result).toBeNull();
        });

        test('load should return null when botId is not saved', () => {
          const result = Local.welcomeKnowledge.load('nonexistent-bot');
          expect(result).toBeNull();
        });
      });
    });
  });
});

describe('Session', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('should get the value from session storage', () => {
    const value = { name: 'test' };
    sessionStorage.setItem('test', JSON.stringify(value));
    const result = Session.get('test');
    expect(result).toEqual(value);
  });

  test('should get the fallback value if the name is not found', () => {
    const result = Session.get('test', 'fallback');
    expect(result).toEqual('fallback');
  });

  test('should get the fallback value if the name is not found and save it if the save flag is true', () => {
    Session.get('test', 'fallback', true);
    const result = sessionStorage.getItem('test');
    expect(result).toEqual('fallback');
  });

  test('should set a value to session storage', () => {
    Session.set('test', { name: 'test' });
    const result = JSON.parse(sessionStorage.getItem('test'));
    expect(result).toEqual({ name: 'test' });
  });

  test('should set a timestamp if no value is provided', () => {
    const date = new Date().getTime();
    jest.spyOn(Date, 'now').mockImplementation(() => date);
    Session.set('test');
    const result = parseInt(sessionStorage.getItem('test'));
    expect(result).toEqual(Math.floor(date / 1000));
    jest.spyOn(Date, 'now').mockRestore();
  });

  test('should clear a specific item from session storage', () => {
    sessionStorage.setItem('test', 'value');
    Session.clear('test');
    expect(sessionStorage.getItem('test')).toBeNull();
  });

  test('should clear all items from session storage', () => {
    sessionStorage.setItem('test1', 'value1');
    sessionStorage.setItem('test2', 'value2');
    Session.clear();
    expect(sessionStorage.getItem('test1')).toBeNull();
    expect(sessionStorage.getItem('test2')).toBeNull();
  });
});

describe('Cookie', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls cookie.getJSON with the specified name', () => {
    const name = 'test';
    const expectedValue = { foo: 'bar' };
    cookie.getJSON.mockReturnValue(expectedValue);

    const result = Cookie.get(name);

    expect(cookie.getJSON).toHaveBeenCalledWith(name);
    expect(result).toEqual(expectedValue);
  });

  it('calls cookie.set with the specified name, value and options', () => {
    const name = 'test';
    const value = 'test value';
    const options = { expires: 10 };
    const expectedOptions = { expires: 10, ...Cookie.options };

    Cookie.set(name, value, options);

    expect(cookie.set).toHaveBeenCalledWith(name, value, expectedOptions);
  });

  it('uses the current timestamp if value is undefined', () => {
    const name = 'test';
    const expectedValue = Math.floor(Date.now() / 1000);
    const expectedOptions = { expires: Cookie.duration.short, ...Cookie.options };
    Cookie.set(name);

    expect(cookie.set).toHaveBeenCalledWith(name, expectedValue, expectedOptions);
  });

  it('stringifies the value if it is an object', () => {
    const name = 'test';
    const value = { foo: 'bar' };
    const expectedValue = JSON.stringify(value);
    const expectedOptions = { expires: Cookie.duration.short, ...Cookie.options };
    Cookie.set(name, value);

    expect(cookie.set).toHaveBeenCalledWith(name, expectedValue, expectedOptions);
  });
  it('calls cookie.remove with the specified name', () => {
    const name = 'test';

    Cookie.remove(name);

    expect(cookie.remove).toHaveBeenCalledWith(name);
  });
});
