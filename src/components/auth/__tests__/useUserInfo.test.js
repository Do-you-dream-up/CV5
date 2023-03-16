import jwtDecode from 'jwt-decode';
import { renderHook } from '@testing-library/react-hooks';
import useUserInfo from '../hooks/useUserInfo';

jest.mock('jwt-decode');

describe('useUserInfo', () => {
  const token = {
    access_token: 'some_access_token',
  };

  it('should decode access token and return user info', () => {
    const decodedToken = {
      sub: '1234',
      name: 'John Doe',
    };

    jwtDecode.mockReturnValue(decodedToken);

    const { result } = renderHook(() => useUserInfo());
    const userInfo = result.current.getUserInfoWithToken(token);

    expect(userInfo).toEqual(decodedToken);
  });

  it('should log error if token decoding fails', () => {
    const error = new Error('Invalid token');

    jwtDecode.mockImplementation(() => {
      throw error;
    });

    const { result } = renderHook(() => useUserInfo());
    const userInfo = result.current.getUserInfoWithToken(token);

    expect(userInfo).toBeUndefined();
  });
});
