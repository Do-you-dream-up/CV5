import dydu from './dydu';

export const getOidcEnableWithAuthStatus = () =>
  dydu.getConfiguration()?.oidc?.enable && dydu.getConfiguration()?.oidc?.withAuth;
