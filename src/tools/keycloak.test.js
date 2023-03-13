import Keycloak from 'keycloak-js';
import keycloak from './keycloak';

const { initKeycloak } = keycloak;

jest.mock('keycloak-js', () =>
  jest.fn(() => ({
    init: jest.fn(() => Promise.resolve(true)),
    login: jest.fn(),
  })),
);
describe('initKeycloak', () => {
  let mockConfiguration = {
    clientId: 'testClient',
    realm: 'testRealm',
    url: 'http://testurl.com',
  };
  const mockCallback = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if clientId is undefined', async () => {
    mockConfiguration.clientId = undefined;
    const consoleSpy = jest.spyOn(console, 'error');
    const response = await initKeycloak(mockCallback, mockConfiguration);
    console.log(response);
    expect(consoleSpy).toHaveBeenCalledWith('[Dydu - keycloak] clientId is missing ');
  });

  it('should return error if realm is undefined', async () => {
    mockConfiguration.clientId = 'testclientID';
    mockConfiguration.realm = undefined;
    const consoleSpy = jest.spyOn(console, 'error');
    await initKeycloak(mockCallback, mockConfiguration);
    expect(consoleSpy).toHaveBeenCalledWith('[Dydu - keycloak] Real is missing ');
  });

  it('should return error if url is undefined', async () => {
    mockConfiguration.clientId = 'testclientID';
    mockConfiguration.realm = 'testRealm';
    mockConfiguration.url = undefined;
    const consoleSpy = jest.spyOn(console, 'error');
    await initKeycloak(mockCallback, mockConfiguration);
    expect(consoleSpy).toHaveBeenCalledWith('[Dydu - keycloak] url is missing ');
  });
  it('should initialize Keycloak with the provided configuration', async () => {
    const onAuthenticatedCallback = jest.fn();
    const configuration = {
      clientId: 'testClientId',
      realm: 'testRealm',
      url: 'testUrl',
    };
    initKeycloak(onAuthenticatedCallback, configuration);
    expect(Keycloak).toHaveBeenCalledWith({
      clientId: 'testClientId',
      realm: 'testRealm',
      url: 'testUrl',
    });
  });
  it('should call onAuthenticatedCallback when authenticated', async () => {
    const onAuthenticatedCallback = jest.fn();
    const configuration = {
      clientId: 'testClientId',
      realm: 'testRealm',
      url: 'testUrl',
    };
    await initKeycloak(onAuthenticatedCallback, configuration);
    expect(onAuthenticatedCallback).toHaveBeenCalled();
  });
  it('should call login() when not authenticated', async () => {
    Keycloak.mockImplementationOnce(() => ({
      init: jest.fn(() => Promise.resolve(false)),
      login: jest.fn(),
    }));
    const onAuthenticatedCallback = jest.fn();
    const configuration = {
      clientId: 'testClientId',
      realm: 'testRealm',
      url: 'testUrl',
    };
    const response = await initKeycloak(onAuthenticatedCallback, configuration);
    expect(response).toBe(undefined);
  });
});
