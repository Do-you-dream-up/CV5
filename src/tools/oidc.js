import { Cookie, Local } from './storage';

export const getOidcEnableStatus = () => {
  const localConfig = Local.get(Local.names.wizard);
  const oidcCookieEnable = Cookie.get(Cookie.names.oidcEnable);

  return oidcCookieEnable ?? localConfig?.oidc?.enable;
};

export const getOidcEnableWithAuthStatus = () => {
  const localConfig = Local.get(Local.names.wizard);
  const oidcWithAuthCookieEnable = Cookie.get(Cookie.names.oidcWithAuthEnable);

  return oidcWithAuthCookieEnable ?? localConfig?.oidc?.withAuth;
};

export const setOidcEnableCookie = (value) => {
  Cookie.set(Cookie.names.oidcEnable, value);
};

export const setOidcWithAuthEnableCookie = (value) => {
  Cookie.set(Cookie.names.oidcWithAuthEnable, value);
};
