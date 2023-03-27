/* eslint-disable no-global-assign */
import { hasWizard, isLoadedFromChannels } from '../wizard';

import { expect } from '@jest/globals';

describe('wizard', () => {
  describe('hasWizard', () => {
    delete window.location;

    window.location = {
      search: '?dydupanel',
    };

    it('should return true if url query param contain dydupanel string', () => {
      //GIVEN

      //WHEN
      const result = hasWizard();

      //THEN
      expect(result).toEqual(true);
    });
  });

  describe('isLoadedFromChannels', () => {
    window = {
      dyduReferer: '',
    };
    it('should return false if is undefined', () => {
      //GIVEN

      //WHEN
      const result = isLoadedFromChannels();

      //THEN
      expect(result).toEqual(undefined);
    });
  });
});
