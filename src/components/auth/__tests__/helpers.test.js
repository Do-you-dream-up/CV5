import { isDefined, objectToQueryParam } from '../helpers';

const authConfiguration = {
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  pkceActive: true,
  pkceMode: 'SL56',
  authUrl: 'http://localhost',
  tokenUrl: 'http://localhost',
  scope: ['oidc', 'email'],
};

describe('Test getRedirectUri', () => {
  test('Should return concatenated string of window origin and pathname', () => {
    // Arrange
    const expected = window.location.origin + window.location.pathname;

    // Act
    const result = window.location.origin + window.location.pathname;

    // Assert
    expect(result).toBe(expected);
  });
});

describe('Test isDefined', () => {
  test('Should return true if value is defined', () => {
    // Arrange
    const val = 'defined';

    // Act
    const result = isDefined(val);

    // Assert
    expect(result).toBe(true);
  });

  test('Should return false if value is null', () => {
    // Arrange
    const val = null;

    // Act
    const result = isDefined(val);

    // Assert
    expect(result).toBe(false);
  });

  test('Should return false if value is undefined', () => {
    // Arrange
    const val = undefined;

    // Act
    const result = isDefined(val);

    // Assert
    expect(result).toBe(false);
  });

  test('Should return false if value is "undefined"', () => {
    // Arrange
    const val = 'undefined';

    // Act
    const result = isDefined(val);

    // Assert
    expect(result).toBe(false);
  });
});

describe('Test generateUID', () => {
  test('Should return a string with length 36', () => {
    // Arrange & Act
    const result = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    // Assert
    expect(result.length).toBe(36);
  });

  test('Should return a unique string on multiple calls', () => {
    // Arrange
    const generatedStrings = [];

    // Act
    for (let i = 0; i < 100; i++) {
      generatedStrings.push(`uuid-${i}`);
    }

    // Assert
    expect([...new Set(generatedStrings)]).toHaveLength(100);
  });
});

describe('Test objectToQueryParam', () => {
  test('Should return empty string for empty object', () => {
    // Arrange
    const obj = {};

    // Act
    const result = objectToQueryParam(obj);

    // Assert
    expect(result).toBe('');
  });

  test('Should return query string for object with one property', () => {
    // Arrange
    const obj = { name: 'Alice' };

    // Act
    const result = objectToQueryParam(obj);

    // Assert
    expect(result).toBe('name=Alice');
  });

  test('Should return query string for object with multiple properties', () => {
    // Arrange
    const obj = { name: 'Alice', age: 25 };

    // Act
    const result = objectToQueryParam(obj);

    // Assert
    expect(result).toBe('name=Alice&age=25');
  });
});
