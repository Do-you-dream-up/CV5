import i from 'i18next';
import BrowserLanguage from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { Cookie, Local } from './storage';


i.use(initReactI18next).use(Backend).use(BrowserLanguage).init({
  backend: {loadPath: 'locales/{{lng}}/{{ns}}.json'},
  cleanCode: true,
  debug: false,
  detection: {
    lookupCookie: Cookie.names.locale,
    lookupLocalStorage: Local.names.locale,
    lookupQuerystring: 'language',
    order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  },
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
  load: 'languageOnly',
  lowerCaseLng: true,
  react: {useSuspense: false},
  returnObjects: true,
});
