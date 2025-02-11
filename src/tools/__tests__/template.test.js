import { CAROUSEL_TEMPLATE, PRODUCT_TEMPLATE, QUICK_REPLY, knownTemplates, CAROUSEL_ARRAY_TEMPLATE } from '../template';

describe('template', () => {
  describe('CAROUSSEL_TEMPLATE', () => {
    it('should return string template is equal to dydu_carousel_001', () => {
      //THEN
      expect(CAROUSEL_TEMPLATE).toEqual('dydu_carousel_001');
    });
  });

  describe('PRODUCT_TEMPLATE', () => {
    it('should return string template is equal to dydu_product_001', () => {
      //THEN
      expect(PRODUCT_TEMPLATE).toEqual('dydu_product_001');
    });
  });

  describe('QUICK_REPLY', () => {
    it('should return string template is equal to dydu_quick_reply_001', () => {
      //THEN
      expect(QUICK_REPLY).toEqual('dydu_quick_reply_001');
    });
  });

  describe('knownTemplates', () => {
    it('should return an array who contains CAROUSSEL_TEMPLATE, PRODUCT_TEMPLATE and QUICK_REPLY', () => {
      //THEN
      expect(knownTemplates).toEqual([CAROUSEL_TEMPLATE, PRODUCT_TEMPLATE, QUICK_REPLY, CAROUSEL_ARRAY_TEMPLATE]);
    });
  });
});
