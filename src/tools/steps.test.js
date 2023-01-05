import flatten from './steps';

describe('flatten', () => {
  it('flattens an object with a nested structure into a single-level array', () => {
    const obj = {
      a: 1,
      b: 2,
      nextStepResponse: {
        c: 3,
        d: 4,
        nextStepResponse: {
          e: 5,
          f: 6,
        },
      },
    };
    const expectedResult = [
      { a: 1, b: 2 },
      { c: 3, d: 4 },
      { e: 5, f: 6 },
    ];

    expect(flatten(obj)).toEqual(expectedResult);
  });

  it('returns an array containing the input object if it has no nested structure', () => {
    const obj = { a: 1, b: 2 };
    expect(flatten(obj)).toEqual([obj]);
  });
});
