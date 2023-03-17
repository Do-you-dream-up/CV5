import { isStringValueCompliant, isValidStringOperator, rulesDefinitions } from '../rulesDefinition';

describe('rulesDefinitions', () => {
  const externInfos = {
    windowLocation: 'https://example.com',
    referrer: '',
    visitCount: 0,
    visitDuration: 0,
    pagesViewedCount: 0,
    numberOfPreviousChat: 0,
    language: '',
    city: '',
    country: '',
  };

  const ruleId = 1;

  describe('Container', () => {
    const { processDelays } = rulesDefinitions[0];

    it('should return VALID_DELAY', () => {
      const delay = processDelays();
      expect(delay).toEqual({ delay: 0, idleDelay: -1 });
    });
  });

  describe('CurrentPage', () => {
    const { processDelays } = rulesDefinitions[1];

    it('should return VALID_DELAY', () => {
      const condition = {
        operator: 'Equals',
        value: 'https://example.com',
      };
      const delay = processDelays(condition, ruleId, externInfos);
      expect(delay).toEqual({ delay: 0, idleDelay: -1 });
    });

    it('should return INVALID_DELAY', () => {
      const condition = {
        operator: 'Equals',
        value: 'https://example.org',
      };
      const delay = processDelays(condition, ruleId, externInfos);
      expect(delay).toEqual({ delay: -1, idleDelay: -1 });
    });
  });

  describe('PastPage', () => {
    const { processDelays } = rulesDefinitions[2];

    it('should return VALID_DELAY', () => {
      const condition = {
        operator: 'Equals',
        value: 'https://example.com',
      };
      const delay = processDelays(condition, ruleId, externInfos);
      expect(delay).toEqual({ delay: 0, idleDelay: -1 });
    });

    it('should return INVALID_DELAY', () => {
      const condition = {
        operator: 'Equals',
        value: 'https://example.org',
      };
      const delay = processDelays(condition, ruleId, externInfos);
      expect(delay).toEqual({ delay: -1, idleDelay: -1 });
    });
  });

  describe('PageVisitDuration', () => {
    const rule = rulesDefinitions.find((rule) => rule.name === 'PageVisitDuration');

    describe('when operator is valid and delay is a number', () => {
      it('should return VALID_DELAY when operator is LesserThan', () => {
        const condition = { operator: 'LesserThan', value: '10' };
        expect(rule.processDelays(condition)).toEqual({ delay: 0, idleDelay: -1 });
      });

      it('should return a delay object with delay property set to the value when operator is not LesserThan', () => {
        const condition = { operator: 'GreaterThan', value: '20' };
        expect(rule.processDelays(condition)).toEqual({ delay: 20, idleDelay: -1 });
      });
    });

    describe('when operator is invalid or delay is not a number', () => {
      it('should return INVALID_DELAY when operator is invalid', () => {
        const condition = { operator: 'InvalidOperator', value: '10' };
        expect(rule.processDelays(condition)).toEqual({ delay: -1, idleDelay: -1 });
      });

      it('should return INVALID_DELAY when delay is not a number', () => {
        const condition = { operator: 'GreaterThan', value: 'abc' };
        expect(rule.processDelays(condition)).toEqual({ delay: -1, idleDelay: -1 });
      });
    });
  });

  describe('isValidStringOperator', () => {
    test('returns true for valid string operators', () => {
      expect(isValidStringOperator('Equals')).toBe(true);
      expect(isValidStringOperator('Contains')).toBe(true);
      expect(isValidStringOperator('DoesNotStartWith')).toBe(true);
      expect(isValidStringOperator('StartsWith')).toBe(true);
      expect(isValidStringOperator('IsContained')).toBe(true);
      expect(isValidStringOperator('NotEquals')).toBe(true);
    });

    test('returns false for invalid string operators', () => {
      expect(isValidStringOperator('InvalidOperator')).toBe(false);
      expect(isValidStringOperator('')).toBe(false);
      expect(isValidStringOperator(null)).toBe(false);
      expect(isValidStringOperator(undefined)).toBe(false);
      expect(isValidStringOperator(42)).toBe(false);
    });
  });

  describe('isStringValueCompliant', () => {
    test('returns VALID_DELAY for a matching "Equals" condition', () => {
      const condition = { operator: 'Equals', value: 'abc' };
      expect(isStringValueCompliant(condition, 'abc')).toEqual({ delay: 0, idleDelay: -1 });
    });

    test('returns VALID_DELAY for a matching "Contains" condition', () => {
      const condition = { operator: 'Contains', value: 'bc' };
      expect(isStringValueCompliant(condition, 'abc')).toEqual({ delay: 0, idleDelay: -1 });
    });

    test('returns INVALID_DELAY for a non-matching "Contains" condition', () => {
      const condition = { operator: 'Contains', value: 'de' };
      expect(isStringValueCompliant(condition, 'abc')).toEqual({ delay: -1, idleDelay: -1 });
    });

    test('returns VALID_DELAY for a matching "StartsWith" condition', () => {
      const condition = { operator: 'StartsWith', value: 'ab' };
      expect(isStringValueCompliant(condition, 'abc')).toEqual({ delay: 0, idleDelay: -1 });
    });
  });
});
