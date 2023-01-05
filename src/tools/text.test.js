import { uppercaseFirstLetter } from './text';

describe('text', () => {
  describe('uppercaseFirstLetter', () => {
    it('should return string in param with first letter in uppercase', () => {
      //GIVEN
      const string = 'coucou';
      //WHEN
      const result = uppercaseFirstLetter(string);

      //THEN
      expect(result).toEqual('Coucou');
    });

    it('should return null if string in param is NOT type of string', () => {
      //GIVEN
      const string = 58;
      //WHEN
      const result = uppercaseFirstLetter(string);

      //THEN
      expect(result).toEqual(null);
    });
  });
});
