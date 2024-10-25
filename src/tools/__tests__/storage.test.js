import { Cookie, Local, Session } from '../storage';

import cookie from 'js-cookie';

jest.mock('js-cookie');
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
