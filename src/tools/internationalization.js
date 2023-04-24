import { Cookie, Local } from './storage';

import Backend from 'i18next-xhr-backend';
import BrowserLanguage from 'i18next-browser-languagedetector';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const setupResource = () => {
  const wording = JSON.parse(localStorage.getItem('dydu.wording'));
  wording &&
    wording.length &&
    wording.map((item) => {
      i18next.addResourceBundle(item.language, 'translation', item.translation);
    });
};

export const getInitOptionsMerge = (options = {}) => {
  return {
    backend: {
      crossDomain: true,
      loadPath: `${process.env.PUBLIC_URL}locales/{{lng}}/{{ns}}.json?t=${Date.now()}`,
      requestOptions: {
        cache: 'no-store',
      },
    },
    cleanCode: true,
    debug: false,
    detection: {
      lookupCookie: Cookie.names.locale,
      lookupLocalStorage: Local.names.locale,
      lookupQuerystring: 'language',
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    },
    fallbackLng: options?.defaultLang || 'fr',
    interpolation: { escapeValue: false },
    load: 'languageOnly',
    lowerCaseLng: true,
    react: { useSuspense: false },
    returnObjects: true,
  };
};

export const initI18N = (options) => {
  const initOptions = getInitOptionsMerge(options);
  i18next.use(initReactI18next).use(Backend).use(BrowserLanguage).init(initOptions);
  setupResource();
};
