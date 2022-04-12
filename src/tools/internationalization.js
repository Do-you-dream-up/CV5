import i from 'i18next';
import BrowserLanguage from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import { Cookie, Local } from './storage';
const wording = JSON.parse(localStorage.getItem('dydu.wording'));

i.use(initReactI18next)
  .use(Backend)
  .use(BrowserLanguage)
  .init({
    backend: {
      crossDomain: true,
      loadPath: `${process.env.PUBLIC_URL}locales/{{lng}}/{{ns}}.json`,
    },
    cleanCode: true,
    debug: false,
    detection: {
      lookupCookie: Cookie.names.locale,
      lookupLocalStorage: Local.names.locale,
      lookupQuerystring: 'language',
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    load: 'languageOnly',
    lowerCaseLng: true,
    react: { useSuspense: false },
    returnObjects: true,
  });

wording &&
  wording.length &&
  wording.map((item) => {
    i.addResourceBundle(item.language, 'translation', item.translation);
  });
