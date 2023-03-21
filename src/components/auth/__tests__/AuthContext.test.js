import { AuthProvider } from '../AuthContext';
import Storage from '../Storage';
import { render } from '../../../tools/test-utils';

jest.mock('../Storage', () => {
  let token = null;

  return {
    __esModule: true,
    default: {
      loadToken: jest.fn(() => token),
      loadPkce: jest.fn(() => token),
      savePkce: jest.fn((t) => {
        token = t;
      }),
      saveToken: jest.fn((t) => {
        token = t;
      }),
      containsPkce: jest.fn(),
    },
  };
});
jest.mock('../../../tools/dydu', () => {
  let authorize = null;

  return {
    __esModule: true,
    default: {
      setOidcLogin: jest.fn(() => authorize),
      setServerStatusCheck: jest.fn(),
      setSpaceToDefault: jest.fn(),
    },
  };
});
describe('AuthProvider', () => {
  test('renders children', () => {
    const { getByText } = render(
      <AuthProvider configuration={{ clientId: 'test-client-id' }}>
        <div>Test Children</div>
      </AuthProvider>,
    );
    expect(getByText('Test Children')).toBeDefined();
  });
});

describe('AuthProtected', () => {
  test('renders children when enable is false', () => {
    const { getByText } = render(<div>Test Children</div>);
    expect(getByText('Test Children')).toBeDefined();
  });

  test('does not render children when enable is true and user is not logged in', () => {
    const { queryByText } = render(<div>Test Children</div>, {
      configuration: {
        oidc: {
          enable: true,
        },
      },
    });
    expect(queryByText('Test Children')).toBeNull();
  });

  test('renders children when enable=true and user is logged in', () => {
    const mockToken = { access_token: 'mock-access-token' };
    Storage.saveToken(mockToken);

    const { getByText } = render(<div>Protected Content</div>, {
      configuration: {
        oidc: {
          enable: true,
        },
      },
      auth: { clientId: 'test-client-id' },
    });
    expect(getByText('Protected Content')).toBeDefined();
  });
});
