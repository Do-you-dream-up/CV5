import { fakeLocalStorage } from '../globalFixtures';

describe('fakeLocalStorage', () => {
  beforeEach(() => {
    fakeLocalStorage.clear();
  });

  it('should set and get an item correctly', () => {
    fakeLocalStorage.setItem('foo', 'bar');
    expect(fakeLocalStorage.getItem('foo')).toEqual('bar');
  });

  it('should return null for a non-existing item', () => {
    expect(fakeLocalStorage.getItem('non-existing')).toBeNull();
  });

  it('should remove an item correctly', () => {
    fakeLocalStorage.setItem('foo', 'bar');
    fakeLocalStorage.removeItem('foo');
    expect(fakeLocalStorage.getItem('foo')).toBeNull();
  });

  it('should clear all items correctly', () => {
    fakeLocalStorage.setItem('foo', 'bar');
    fakeLocalStorage.setItem('baz', 'qux');
    fakeLocalStorage.clear();
    expect(fakeLocalStorage.getItem('foo')).toBeNull();
    expect(fakeLocalStorage.getItem('baz')).toBeNull();
  });
});
