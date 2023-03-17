import { Cookie, Local } from '../storage';
import { getInitOptionsMerge, initI18N, setupResource } from '../internationalization';

import Backend from 'i18next-xhr-backend';
import BrowserLanguage from 'i18next-browser-languagedetector';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

describe('internationalization', () => {
  test('setupResource should add language resources to i18next', () => {
    const mockWording = [
      { language: 'en', translation: { hello: 'Hello' } },
      { language: 'fr', translation: { hello: 'Bonjour' } },
    ];
    localStorage.setItem('dydu.wording', JSON.stringify(mockWording));
    i18next.addResourceBundle = jest.fn();

    setupResource();

    expect(i18next.addResourceBundle).toHaveBeenCalledTimes(mockWording.length);
    mockWording.forEach((item) => {
      expect(i18next.addResourceBundle).toHaveBeenCalledWith(item.language, 'translation', item.translation);
    });
  });

  test('getInitOptionsMerge should return expected init options', () => {
    const expectedOptions = {
      backend: {
        crossDomain: true,
        loadPath: `${process.env.PUBLIC_URL}locales/{{lng}}/{{ns}}.json`,
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
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      load: 'languageOnly',
      lowerCaseLng: true,
      react: { useSuspense: false },
      returnObjects: true,
    };

    const actualOptions = getInitOptionsMerge();
    expect({
      ...actualOptions,
      backend: {
        ...actualOptions.backend,
        loadPath: actualOptions.backend.loadPath.split('?')[0],
      },
    }).toEqual(expectedOptions);
  });

  test('getInitiOptionsMerge should return an object with the expected properties', () => {
    const i18nextUseSpy = jest.spyOn(i18next, 'use');
    const i18nextInitSpy = jest.spyOn(i18next, 'init');

    initI18N({ defaultLang: 'en' });

    expect(i18nextUseSpy).toHaveBeenCalledTimes(3);
    expect(i18nextUseSpy).toHaveBeenCalledWith(initReactI18next);
    expect(i18nextUseSpy).toHaveBeenCalledWith(Backend);
    expect(i18nextUseSpy).toHaveBeenCalledWith(BrowserLanguage);
    expect(i18nextInitSpy).toHaveBeenCalledTimes(1);
  });
});
