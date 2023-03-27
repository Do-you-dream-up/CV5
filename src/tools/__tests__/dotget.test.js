import dotget from '../dotget';

describe('dotget', () => {
  const data = {
    name: 'John',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
    },
  };

  it('should return the value at the specified path in the object', () => {
    expect(dotget(data, 'name')).toBe('John');
    expect(dotget(data, 'age')).toBe(30);
    expect(dotget(data, 'address.street')).toBe('123 Main St');
    expect(dotget(data, 'address.city')).toBe('Anytown');
    expect(dotget(data, 'address.state')).toBe('CA');
  });

  it('should return undefined for non-existent paths', () => {
    expect(dotget(data, 'foo')).toBeUndefined();
    expect(dotget(data, 'address.zipcode')).toBeUndefined();
  });
});
