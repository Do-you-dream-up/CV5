import { Cookie, Local } from './storage';

export const getSamlEnableStatus = () => {
  const localConfig = Local.get(Local.names.wizard);
  const samlCookieEnable = Cookie.get(Cookie.names.samlEnable);

  return samlCookieEnable ?? localConfig?.saml?.enable;
};

export const setSamlEnableCookie = (value) => {
  Cookie.set(Cookie.names.samlEnable, value);
};
