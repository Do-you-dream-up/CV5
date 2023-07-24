import { isValidUrl } from '../helpers';

describe('REGEX URL', () => {
  test('valid http url', () => {
    const validHttpUrl = 'http://google.fr';
    expect(isValidUrl(validHttpUrl)).toBeTruthy();
  });

  test('valid https url', () => {
    const validHttspUrl = 'https://google.fr';
    expect(isValidUrl(validHttspUrl)).toBeTruthy();
    const otherValidHttspUrl = 'https://google.fr';
    expect(isValidUrl(otherValidHttspUrl)).toBeTruthy();
  });

  test('valid url with two dots', () => {
    const validHttspUrlWuthTwoDots = 'https://google.form.fr';
    expect(isValidUrl(validHttspUrlWuthTwoDots)).toBeTruthy();
  });

  test('invalid url with text', () => {
    const invalidHttspUrl = 'bonjour voici une url https://google.fr et voila une autre https://google.form.fr';
    expect(isValidUrl(invalidHttspUrl)).toBeFalsy();
  });
  test('invalid url with specials characters', () => {
    const invalidHttspUrl = 'https://google$$.fr';
    expect(isValidUrl(invalidHttspUrl)).toBeFalsy();
  });
});
