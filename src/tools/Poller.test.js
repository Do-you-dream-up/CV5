import Poller from './Poller';
import { isDefined } from './helpers';

const getDefaultConfig = (value = {}) => {
  return {
    serverRequestAction: jest.fn(),
    conditionStart: jest.fn(),
    conditionStop: jest.fn(),
    timeoutMs: 1000,
    onResponse: jest.fn(),
    onResponseError: jest.fn(),
    postStopAction: jest.fn(),
    ...value,
  };
};

const getDefaultConfigAllNull = () => {
  return {
    serverRequestAction: null,
    conditionStart: null,
    conditionStop: null,
    timeoutMs: null,
    onResponse: null,
    onResponseError: null,
    intervalRef: null,
    postStopAction: null,
  };
};

describe('Poller', () => {
  it('should correctly instantiate a Poller', function () {
    expect(new Poller()).toBeDefined();
  });

  it('should return false when Poller has not been configured', function () {
    // GIVEN
    const instance = new Poller();
    // WHEN
    const runningExpectFalse = instance.isRunning();
    // THEN
    expect(runningExpectFalse).toEqual(false);
  });

  it('should throw an error when call |run()| without having been configured', function () {
    // GIVEN
    const instance = new Poller();
    expect(instance.isRunning()).toEqual(false);

    // WHEN
    // THEN
    expect(instance.run).toThrowError();
  });

  it('should throw an error when configuration object has missing field', function () {
    let config = {};
    const instance = new Poller();
    expect(() => instance.configure(config)).toThrowError();
  });

  it('should throw an error when configuration object has field with null value', function () {
    const config = getDefaultConfigAllNull();
    const instance = new Poller();
    expect(() => instance.configure(config)).toThrowError();
  });

  it('should throw an error when configuration object has one filed with null value but |postStopAction| field', function () {
    // GIVEN
    let config = getDefaultConfig();

    // WHEN
    const instance = new Poller();

    // THEN
    while (alternateObjectFieldWithNull(config))
      if (isDefined(config.postStopAction))
        // postStopAction is not required and will not throw error
        expect(() => instance.configure(config).run()).toThrowError();
  });

  it('|configure| should be fluid', function () {
    const config = getDefaultConfig();
    const instance = new Poller();
    expect(() => instance.configure(config).run()).not.toThrowError();
  });

  it('should not run if |conditionStart| config is not defined', function () {
    // GIVEN
    const config = getDefaultConfig({ conditionStart: null });
    expect(config.conditionStart).toEqual(null);

    // WHEN
    const instance = new Poller();

    // THEN
    expect(() => instance.configure(config).run()).toThrowError();
    expect(instance.isRunning()).toEqual(false);
  });

  it('should stop if |conditionStop| is true', function () {
    // GIVEN
    const config = getDefaultConfig({ conditionStop: () => false, conditionStart: () => true });
    expect(config.conditionStop).toBeDefined();
    expect(config.conditionStop()).toEqual(false);

    let instance = new Poller();
    instance.configure(config).run();
    expect(instance.isRunning()).toEqual(true);

    // WHEN
    const _config = getDefaultConfig({ conditionStop: () => true });
    instance.configure(_config).run();

    // THEN
    setTimeout(() => {
      expect(config.conditionStop()).toHaveBeenCalled();
      expect(instance.isRunning()).toEqual(false);
    }, config.timeoutMs + 100);
  });

  it('should call |serverRequestAction| when |conditionStart| is true and |timeoutMS| is set', function () {
    // GIVEN
    const config = getDefaultConfig({
      conditionStart: () => true,
      timeoutMs: 100,
    });
    expect(config.timeoutMs).toBeDefined();
    expect(config.conditionStart()).toEqual(true);
    expect(config.serverRequestAction).toBeDefined();

    // WHEN
    const instance = new Poller();
    instance.configure(config).run();
    expect(instance.isRunning()).toEqual(true);

    // THEN
    setTimeout(() => {
      expect(config.serverRequestAction).toHaveBeenCalled();
    }, config.timeoutMs + 100);
  });

  it('|isRunning| should be false when |conditionStop| has been called', function () {
    // GIVEN
    const c = getDefaultConfig({ conditionStop: jest.fn().mockImplementation(() => true) });
    expect(c.conditionStop).toBeDefined();
    const i = new Poller();
    i.configure(c);

    // WHEN
    i.run();

    // THEN
    setTimeout(() => {
      expect(c.conditionStop).toHaveBeenCalled();
      expect(i.isRunning()).toEqual(false);
    }, c.timeoutMs + 100);
  });
  it('should call |postStopAction| if it exists when stop', function () {
    // GIVEN
    const config = getDefaultConfig({
      conditionStart: () => true,
      timeoutMs: 100,
      conditionStop: () => true,
    });
    expect(config.postStopAction).toBeDefined();

    // WHEN
    const instance = new Poller();
    instance.configure(config).run();
    expect(instance.isRunning()).toEqual(true);

    // THEN
    setTimeout(() => {
      expect(config.postStopAction).toHaveBeenCalled();
    }, config.timeoutMs + 100);
  });

  it('should call |onResponse| when |serverRequest| Promise has resovled', function () {
    // GIVEN
    const c = getDefaultConfig({ serverRequestAction: Promise.resolve(), conditionStart: () => true });
    expect(c.onResponse).toBeDefined();

    // WHEN
    const i = new Poller();
    i.configure(c);

    // THEN
    i.run();
    expect(i.isRunning()).toEqual(true);
    setTimeout(() => {
      expect(c.onResponse).toHaveBeenCalled();
    }, c.timeoutMs + 100);
  });

  it('should call |onResponseError| when |serverRequest| Promise has reject', function () {
    // GIVEN
    const c = getDefaultConfig({
      serverRequestAction: jest.fn().mockRejectedValue('error'),
      conditionStart: () => true,
    });

    expect(c.onResponseError).toBeDefined();

    // WHEN
    const i = new Poller();
    i.configure(c);

    // THEN
    i.run();
    expect(i.isRunning()).toEqual(true);
    setTimeout(() => expect(c.onResponseError).toHaveBeenCalled(), c.timeoutMs + 100);
  });

  it('should not call |serverRequestAction| multiple time when |isRunning| is already true', function () {
    // GIVEN
    const c = getDefaultConfig({ conditionStart: () => true });
    expect(c.serverRequestAction).toBeDefined();

    const i = new Poller();
    i.configure(c);

    // WHEN
    let t = 3;
    while (t--) {
      i.run();
      expect(i.isRunning()).toEqual(true);
    }

    // THEN
    setTimeout(() => {
      expect(c.serverRequestAction).toHaveBeenCalledTimes(1);
    });
  });
});

let fieldNameList = [];
let listInitialized = false;
const alternateObjectFieldWithNull = (mapObject) => {
  if (!listInitialized) {
    fieldNameList = Object.keys(mapObject); // save field list
    listInitialized = true;
  }

  // no more field to set as null
  if (fieldNameList.length === 0 && listInitialized) return false;

  // reset the object fields values
  Object.keys(mapObject).forEach((field) => (mapObject[field] = jest.fn()));

  // set one field as null
  mapObject[fieldNameList.pop()] = null;

  return true; // a field just been set to null
};
