import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';


i18n.use(initReactI18next).use(Backend).init({
  debug: false,
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
  lng: 'en',
  ns: ['banner'],
  react: {useSuspense: false},
  returnObjects: true,
});


export default i18n;
