import './strings';
import './object';

const initial = {
  name: 'jhon'.toBase64(),
  age: 33,
  childen: ['a', 'b', 'c'],
  contact: {
    phone: '0878909879'.toBase64(),
    address: {
      country: 'Australia'.toBase64(),
      city: 'Sydney'.toBase64(),
    },
  },
};

const expected = {
  name: 'jhon',
  age: 33,
  childen: ['a', 'b', 'c'],
  contact: {
    phone: '0878909879',
    address: {
      country: 'Australia',
      city: 'Sydney',
    },
  },
};
describe('object prototype', () => {
  it('should recursively base64 decode all fields of type string', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(initial.recursiveBase64DecodeString()).toEqual(expected);
  });
  it('should not throw Error when a string to be decode is not encoded', () => {
    // GIVEN
    // WHEN
    // THEN
    const name = 'jhon'; // not base64 encoded
    const _initial = { ...initial, name };
    expect(_initial.recursiveBase64DecodeString()).toEqual(expected);
  });
});
