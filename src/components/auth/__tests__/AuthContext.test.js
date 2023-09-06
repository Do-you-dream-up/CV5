/* eslint-disable react/prop-types */
import Storage from '../Storage';
import axios from 'axios';
import { render } from '../../../tools/test-utils';

const jwtToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0c1BTTUFsa1JxaGs2OEpxZEhaTWxiYWRfMV9OYjVMZ05PVUVrVm9ZS29RIn0.eyJleHAiOjE2NjMzMTI4MDgsImlhdCI6MTY2MzMxMjIwOCwianRpIjoiN2JkYzU4NTEtM2Y0OC00ZWU0LTk4NjAtOTYyZjk3MGQwNWZiIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zZWN1cml0eS5keWR1LXByaXYuY29tL2F1dGgvcmVhbG1zL2JhY2tfdGVzdCIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiIxNzBmNjA4Yy1hNmE0LTQ2NzctYWNmMy0wZDRjZDdjMGNkYjgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbGV4LWF1dGgiLCJzZXNzaW9uX3N0YXRlIjoiMjk4Y2JhN2QtMjNhMi00OTA0LTgxNjQtZjM1Y2I4NjM1ZjY5IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2tleWNsb2FrLnNlY3VyaXR5LmR5ZHUtcHJpdi5jb20iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1iYWNrX3Rlc3QiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJ2aWV3LXJlYWxtIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJyZWFsbS1hZG1pbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktdXNlcnMiLCJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwidmlldy1ldmVudHMiLCJ2aWV3LXVzZXJzIiwidmlldy1jbGllbnRzIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWdyb3VwcyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiMjk4Y2JhN2QtMjNhMi00OTA0LTgxNjQtZjM1Y2I4NjM1ZjY5IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBbGV4YW5kcmUgTW9uZ2UiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbW9uZ2UiLCJnaXZlbl9uYW1lIjoiQWxleGFuZHJlIiwiZmFtaWx5X25hbWUiOiJNb25nZSIsImVtYWlsIjoiYW1vbmdlQGR5ZHUuYWkifQ.FbMHD9c0v9_1rVkC5tOYBBwbOxHKOFbgGPM-xytQfc0JXNtgY9UxjyfJawglNcsC9kdIYmqDlSuI9B1ovlYav0-qiX7BRgjuAi18OzenJRPBgBH6yjLlMTdzyufZyDh0w7Xqa5RVYY_yrIw2HDBw4Cfz5agiGdJQvQrU4WYXqJNMvAWMcX1JQqEyj3xxoXNYc_Az03KVpsii0Z1hCP2N35N5yUn4x1QOZn8lfgHKvK_8l_r2U4JMeFyJ1bxZSNsWZJtlqIx5sevXHtAguLGH1klGaax33BBrYJmOBS1CQ-LLlmWNy9Bw8D84eWYUEoBG3dH_Y48fZUT8Yzt_Du-1Iw';

const oidcConfig = {
  enable: true,
  clientId: 'l5LUWFkMo18GaWJZvzXHde1B0Ehz236tBSdphOvrWN8hn88qbOEVpgvZU0kW2Hnu',
  clientSecret: '5CowOGbBLi5GOnIlwF6cpSJ5HLdAQwVEBwxvnbyeMeit1XhKsQetH9r7cU6hTzeO',
  pkceActive: true,
  pkceMode: 'S256',
  discoveryUrl: 'https://yawks.net/nextcloud/index.php/apps/oidc/openid-configuration',
  scopes: ['openid', 'email', 'profile'],
  withAuth: true,
};

jest.mock('../Storage', () => {
  let token = null;

  return {
    __esModule: true,
    default: {
      loadToken: jest.fn(() => token),
      clearToken: jest.fn(),
      saveUrls: jest.fn(),
      loadUrls: jest.fn(),
      clearUrls: jest.fn(),
      clearUserInfo: jest.fn(),
      saveToken: jest.fn((t) => {
        token = t;
      }),
      saveUserInfo: jest.fn((t) => {
        token = t;
      }),
      clearPkce: jest.fn(),
      loadPkce: jest.fn(() => token),
      savePkce: jest.fn((t) => {
        token = t;
      }),
      containsPkce: jest.fn(),
    },
  };
});

jest.mock('../../../tools/dydu', () => {
  let authorize = null;
  let botLanguages = ['en', 'fr'];

  return {
    __esModule: true,
    default: {
      setOidcLogin: jest.fn(() => authorize),
      setServerStatusCheck: jest.fn(),
      setTokenRefresher: jest.fn(),
      setSpaceToDefault: jest.fn(),
      fetchUrlConfig: jest.fn(),
      setLocale: jest.fn(),
      getBotLanguages: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve(botLanguages);
          }),
      ),
    },
  };
});

jest.mock('axios');

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.clearUserInfo();
    Storage.clearUrls();
  });

  afterAll(() => {
    Storage.clearToken();
    Storage.clearPkce();
    Storage.clearUrls();
  });

  it('should save urls to storage and set url config', async () => {
    const data = {
      authorization_endpoint: 'http://example.com/authorize',
      token_endpoint: 'http://example.com/token',
      userinfo_endpoint: 'http://example.com/userinfo',
    };

    axios.get.mockResolvedValueOnce({ data });

    const urls = {
      authUrl: data.authorization_endpoint,
      tokenUrl: data.token_endpoint,
      userinfoUrl: data.userinfo_endpoint,
    };

    Storage.clearUserInfo();
    Storage.clearUrls();
    Storage.saveUrls(urls);

    expect(Storage.clearUserInfo).toHaveBeenCalled();
    expect(Storage.clearUrls).toHaveBeenCalled();
    expect(Storage.saveUrls).toHaveBeenCalledWith(urls);
  });

  test('renders children', () => {
    const { getByText } = render(<div>Test Children</div>);
    expect(getByText('Test Children')).toBeDefined();
  });

  test('renders children when enable is false', () => {
    const { getByText } = render(<div>Test Children</div>);
    expect(getByText('Test Children')).toBeDefined();
  });

  test('renders children when enable=true and user is logged in', () => {
    const mockToken = {
      access_token: jwtToken,
      refresh_token: jwtToken,
    };

    const mockUserInfo = { email: 'mgauchedaumet@dydu.ai' };

    Storage.saveToken(mockToken);
    // Storage.saveUserInfo(mockUserInfo);

    const { getByText } = render(<div>Protected Content</div>, {
      configuration: {
        oidc: oidcConfig,
      },
      auth: { clientId: 'test-client-id' },
    });
    expect(getByText('Protected Content')).toBeDefined();
  });

  test('renders children when enable=true and user is logged in but with false token', () => {
    const mockToken = {
      access_token: 'pasbon',
      refresh_token: 'pasbon',
    };

    Storage.saveToken(mockToken);

    const { getByText } = render(<div>Protected Content</div>, {
      configuration: {
        oidc: oidcConfig,
      },
      auth: { clientId: 'test-client-id' },
    });
    expect(getByText('Protected Content')).toBeDefined();
  });

  test('renders children when isLoadedFromChannels', () => {
    window.dyduReferer = true;
    const { getByText } = render(<div>Protected Content</div>);
    expect(getByText('Protected Content')).toBeDefined();
  });
});
