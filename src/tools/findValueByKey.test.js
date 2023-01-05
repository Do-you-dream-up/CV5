import { findValueByKey } from './findValueByKey';

describe('findValueByKey', () => {
  it('should return the value for the specified key in the object', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
    };

    const keyToFind = 'c';
    const expectedResult = [2];

    expect(findValueByKey(obj, keyToFind)).toEqual(expectedResult);
  });
});
