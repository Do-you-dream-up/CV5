import i18n from '../i18nProvider';

describe('i18n initialization', () => {
  it('should initialize i18n with the correct configuration', () => {
    expect(i18n.options.backend.crossDomain).toBe(true);
    expect(i18n.options.backend.loadPath).toContain('locales/{{lng}}/{{ns}}.json?t=');
    expect(i18n.options.cleanCode).toBe(true);
    expect(i18n.options.debug).toBe(false);
  });

  it('should have the correct order of language detection methods', () => {
    expect(i18n.options.detection.order).toEqual([
      'querystring',
      'localStorage',
      'navigator',
      'htmlTag',
      'path',
      'subdomain',
    ]);
  });

  it('should have crossDomain set to true in the backend configuration', () => {
    expect(i18n.options.backend.crossDomain).toBe(true);
  });

  it('should have requestOptions.cache set to "no-store" in the backend configuration', () => {
    expect(i18n.options.backend.requestOptions.cache).toBe('no-store');
  });

  it('should have the correct lookupCookie and lookupLocalStorage values in the language detection configuration', () => {
    expect(i18n.options.detection.lookupCookie).toBe('dydu.chatbox.locale');
    expect(i18n.options.detection.lookupLocalStorage).toBe('dydu.chatbox.locale');
  });

  it('should have the correct lookupQuerystring value in the language detection configuration', () => {
    expect(i18n.options.detection.lookupQuerystring).toBe('language');
  });
});
