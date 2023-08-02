import { Cookie, Local } from '../tools/storage';

import Backend from 'i18next-xhr-backend';
import BrowserLanguage from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(BrowserLanguage)
  .init({
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
      lookupCookie: Cookie?.names?.locale,
      lookupLocalStorage: Local?.names?.locale,
      lookupQuerystring: 'language',
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    },
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    load: 'languageOnly',
    lowerCaseLng: true,
    react: { useSuspense: false },
    returnObjects: true,
  });

export default i18n;
