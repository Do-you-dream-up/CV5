import { decode, encode } from '../cipher';

import { Base64 } from 'js-base64';

describe('transform', () => {
  it('should apply manipulator on an object', () => {
    const data = { name: 'John', age: 30 };
    const result = decode(data, (value) => (typeof value === 'string' ? value.toUpperCase() : value));
    expect(result).toEqual({ name: 'JOHN', age: 30 });
  });

  it('should apply manipulator on an array', () => {
    const data = ['Hello', 'World'];
    const result = encode(data[0], Base64.encode());
    expect(result).toEqual('SGVsbG8=');
  });

  it('should not apply manipulator on a number', () => {
    const result = encode(123, (str) => str.toUpperCase());
    expect(result).toBe(123);
  });

  it('should apply Base64.decode on a string', () => {
    const result = decode('SGVsbG8gV29ybGQ=', Base64.decode);
    expect(result).toBe('Hello World');
  });

  it('should apply Base64.encode on a string', () => {
    const result = encode('Hello World', Base64.encode);
    expect(result).toBe('SGVsbG8gV29ybGQ=');
  });
});
