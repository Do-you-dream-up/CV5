import './strings';
import { isDefined, isOfTypeFunction } from '../helpers';

const definedProperties = ['contains', 'toBase64', 'fromBase64', 'equals'];

describe('strings prototype', () => {
  it('should contains declared properties', () => {
    const str = '';
    for (let i = 0; i < definedProperties.length; i++) {
      const name = definedProperties[i];
      expect(isDefined(str[name])).toEqual(true);
      expect(isOfTypeFunction(str[name])).toEqual(true);
    }
  });

  it('comparaison with |equals| is boolean and should works', () => {
    const str = 'test';
    expect(typeof str.equals('test')).toEqual('boolean');
    expect(str.equals('test')).toEqual(str === 'test');
    expect(str.equals('Test')).toEqual(str === 'Test');
    expect(str.equals('TEST')).toEqual(str === 'TEST');
  });

  it('comparaison with |contains| should works', () => {
    const str = 'test';
    expect(typeof str.contains('test')).toEqual('boolean');
    expect(str.contains('st')).toEqual(str.indexOf('st') >= 0);
    expect(str.contains('ST')).toEqual(str.indexOf('ST') >= 0);
  });

  it('base64 encode/decode should works', () => {
    const decoded = 'test';
    const encoded = decoded.toBase64();
    expect(encoded.fromBase64()).toEqual(decoded);
  });
});
