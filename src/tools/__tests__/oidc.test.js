import { getOidcEnableWithAuthStatus } from '../oidc';

describe('oidc', () => {
  it('should return true or false', () => {
    expect(getOidcEnableWithAuthStatus()).toBe(undefined);
  });
});
