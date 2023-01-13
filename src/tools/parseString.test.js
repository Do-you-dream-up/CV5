import { parseString } from './parseString';

describe('parseString', () => {
  it('parses a JSON string into an object', () => {
    const jsonString = '{"name":"John","age":30,"city":"New York"}';
    const expectedResult = { name: 'John', age: 30, city: 'New York' };

    expect(parseString(jsonString)).toEqual(expectedResult);
  });

  it('returns the input string if it is not a valid JSON string', () => {
    const invalidJsonString = '{"name":"John","age":30,"city":"New York"';
    expect(parseString(invalidJsonString)).toEqual(invalidJsonString);
  });
});
