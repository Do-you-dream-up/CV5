import { AuthProvider, useAuth } from '../AuthContext';

import jwtDecode from 'jwt-decode';
import { render } from '../../../tools/test-utils';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('jwt-decode');

const configuration = {
  clientId: 'test-client-id',
  tokenPath: 'test-token-path',
  redirectUri: 'test-redirect-uri',
  authUrl: 'test-auth-url',
  tokenUrl: 'test-token-url',
  scope: ['scope1', 'scope2'],
};
describe('AuthProvider', () => {
  test('renders children', () => {
    const { container } = render(
      <AuthProvider configuration={configuration}>
        <div>Test</div>
      </AuthProvider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('provides auth context', () => {
    const wrapper = ({ children }) => <AuthProvider configuration={configuration}>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toMatchObject({
      userInfo: null,
      isLoggedIn: false,
      login: expect.any(Function),
      token: false,
      ...configuration,
    });
  });

  it('returns the authentication context', () => {
    const configuration = {
      clientId: 'test-client-id',
      tokenPath: '/test/token',
      redirectUri: 'https://example.com/callback',
      authUrl: 'https://example.com/auth',
      tokenUrl: 'https://example.com/token',
      scope: ['openid', 'profile', 'email'],
    };

    const wrapper = ({ children }) => <AuthProvider configuration={configuration}>{children}</AuthProvider>;

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoggedIn).toBeFalsy();
    expect(result.current.userInfo).toBeNull();
    expect(result.current.token).toBeFalsy();
    expect(result.current.login).toBeInstanceOf(Function);
    expect(result.current.clientId).toEqual('test-client-id');
    expect(result.current.tokenPath).toEqual('/test/token');
    expect(result.current.redirectUri).toEqual('https://example.com/callback');
    expect(result.current.authUrl).toEqual('https://example.com/auth');
    expect(result.current.tokenUrl).toEqual('https://example.com/token');
    expect(result.current.scope).toEqual(['openid', 'profile', 'email']);
  });
});
