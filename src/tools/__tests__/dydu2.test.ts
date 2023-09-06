/* eslint-disable */

/**
 * This class is intended to replace little by little the dydu.test.js
 * Right now, both will coexist.
 */
import '../prototypes/strings';

import { Local } from '../storage';

const dyduRelativeLocation = '../dydu';
let _dydu = jest.requireActual(dyduRelativeLocation).default;

let dydu;

describe('dydu.ts', function () {
  beforeEach(() => {
    dydu = _dydu;
  });

  afterEach(() => {
    dydu = _dydu;
  });

  describe('initLocaleWithConfiguration', () => {
    it('should set the local when default is included in languages', () => {
      //GIVEN
      const configuration = {
        application: { languages: ['fr', 'en', 'it'], defaultLanguage: ['fr'], getDefaultLanguageFromSite: false },
      };
      //WHEN
      dydu.initLocaleWithConfiguration(configuration);
      //THEN
      expect(dydu.locale).toEqual('fr');
    });

    it('should set fr when default is not included in languages', () => {
      //GIVEN
      const configuration = {
        application: { languages: ['gb', 'en', 'it'], defaultLanguage: ['ro'], getDefaultLanguageFromSite: false },
      };
      //WHEN
      dydu.initLocaleWithConfiguration(configuration);
      //THEN
      expect(dydu.locale).toEqual('fr');
    });

    it('should set browser language if required and browser language authorized', () => {
      //GIVEN
      const configuration = {
        application: { languages: ['ro', 'en', 'it'], defaultLanguage: ['fr'], getDefaultLanguageFromSite: true },
      };
      Local.set(Local.names.locale, 'ro'); // simulate an 'ro' browser language, set by i18nProvider
      //WHEN
      dydu.initLocaleWithConfiguration(configuration);
      //THEN
      expect(dydu.locale).toEqual('ro');
    });

    it('should set default language if browser language is required but not authorized', () => {
      //GIVEN
      const configuration = {
        application: { languages: ['gb', 'en', 'it'], defaultLanguage: ['fr'], getDefaultLanguageFromSite: true },
      };
      Local.set(Local.names.locale, 'ro'); // simulate an 'ro' browser language, set by i18nProvider
      //WHEN
      dydu.initLocaleWithConfiguration(configuration);
      //THEN
      expect(dydu.locale).toEqual('fr');
    });
  });

  describe('correctLocaleFromBotLanguages', () => {
    it('should set locale to fr if locale not in activatedAndActiveBotLanguages', () => {
      //GIVEN
      dydu.locale = 'ro';
      Local.set(Local.names.locale, 'ro');
      const activatedAndActiveBotLanguages = ['fr', 'en'];
      //WHEN
      dydu.correctLocaleFromBotLanguages(activatedAndActiveBotLanguages);
      //THEN
      expect(dydu.locale).toEqual('fr');
      expect(Local.get(Local.names.locale)).toEqual('fr');
    });

    it('should not change locale if already belonging to activatedAndActiveBotLanguages', () => {
      //GIVEN
      dydu.locale = 'en';
      Local.set(Local.names.locale, 'en');
      const activatedAndActiveBotLanguages = ['fr', 'en'];
      //WHEN
      dydu.correctLocaleFromBotLanguages(activatedAndActiveBotLanguages);
      //THEN
      expect(dydu.locale).toEqual('en');
      expect(Local.get(Local.names.locale)).toEqual('en');
    });
  });
});
