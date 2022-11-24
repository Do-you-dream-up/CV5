import jwtDecode from 'jwt-decode';
import { useCallback } from 'react';

export default function useUserInfo() {
  const getUserInfoWithToken = useCallback((token) => {
    try {
      const userInfo = jwtDecode(token?.access_token);
      return userInfo;
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    getUserInfoWithToken,
  };
}
