import ComplianceInfo from '../complianceInfo';
import assert from 'assert';

describe('ComplianceInfo', () => {
  describe('constructor', () => {
    test('should initialize delays and priority with default values if no arguments are provided', () => {
      const complianceInfo = new ComplianceInfo();
      expect(complianceInfo.delays).toEqual({ delay: -1, idleDelay: -1 });
      expect(complianceInfo.priority).toEqual({ equalsCount: 0, rulesCount: -1, rulesValueLength: 0 });
    });

    test('should initialize delays and priority with provided values', () => {
      const delays = { delay: 1000, idleDelay: 500 };
      const priority = { equalsCount: 2, rulesCount: 5, rulesValueLength: 10 };
      const complianceInfo = new ComplianceInfo(delays, priority);
      expect(complianceInfo.delays).toEqual(delays);
      expect(complianceInfo.priority).toEqual(priority);
    });
  });

  describe('copy', () => {
    it('should copy the values from another ComplianceInfo object', () => {
      // Create two ComplianceInfo objects with different values
      const info1 = new ComplianceInfo(
        { delay: 100, idleDelay: 50 },
        { equalsCount: 2, rulesCount: 3, rulesValueLength: 10 },
      );
      const info2 = new ComplianceInfo(
        { delay: 200, idleDelay: 100 },
        { equalsCount: 5, rulesCount: 7, rulesValueLength: 20 },
      );

      // Copy the values from info2 to info1
      info1.copy(info2);

      // Check that the values in info1 match the values in info2
      assert.deepStrictEqual(info1.delays, { delay: 200, idleDelay: 100 });
      assert.deepStrictEqual(info1.priority, { equalsCount: 5, rulesCount: 7, rulesValueLength: 20 });
    });
  });

  describe('getDelay', () => {
    it('should return -1 if delay is not set', () => {
      const complianceInfo = new ComplianceInfo();
      expect(complianceInfo.getDelay()).toBe(-1);
    });

    it('should return the set delay value', () => {
      const complianceInfo = new ComplianceInfo({ delay: 100 });
      expect(complianceInfo.getDelay()).toBe(100);
    });
  });

  describe('getIdleDelay', () => {
    it('should return -1 if idleDelay is not defined', () => {
      const complianceInfo = new ComplianceInfo({ delay: 10 });
      expect(complianceInfo.getIdleDelay()).toEqual(undefined);
    });

    it('should return the value of idleDelay if it is defined', () => {
      const complianceInfo = new ComplianceInfo({ delay: 10, idleDelay: 20 });
      expect(complianceInfo.getIdleDelay()).toEqual(20);
    });
  });

  describe('comparePriorities', () => {
    it('should return negative number when compared to a higher priority ComplianceInfo object', () => {
      const ci1 = new ComplianceInfo({ delay: 100 }, { equalsCount: 5, rulesCount: 5, rulesValueLength: 10 });
      const ci2 = new ComplianceInfo({ delay: 100 }, { equalsCount: 6, rulesCount: 5, rulesValueLength: 10 });
      expect(ci1.comparePriorities(ci2)).toBeLessThan(0);
    });

    it('should return positive number when compared to a lower priority ComplianceInfo object', () => {
      const ci1 = new ComplianceInfo({ delay: 100 }, { equalsCount: 5, rulesCount: 5, rulesValueLength: 10 });
      const ci2 = new ComplianceInfo({ delay: 100 }, { equalsCount: 4, rulesCount: 5, rulesValueLength: 10 });
      expect(ci1.comparePriorities(ci2)).toBeGreaterThan(0);
    });

    it('should return 0 when compared to an identical ComplianceInfo object', () => {
      const ci1 = new ComplianceInfo({ delay: 100 }, { equalsCount: 5, rulesCount: 5, rulesValueLength: 10 });
      const ci2 = new ComplianceInfo({ delay: 100 }, { equalsCount: 5, rulesCount: 5, rulesValueLength: 10 });
      expect(ci1.comparePriorities(ci2)).toBe(0);
    });
  });

  describe('complyWithoutDelay', () => {
    it('should return true if delay is 0', () => {
      const complianceInfo = new ComplianceInfo({ delay: 0 }, { equalsCount: 0 });
      expect(complianceInfo.complyWithoutDelay()).toBe(true);
    });

    it('should return true if idleDelay is 0', () => {
      const complianceInfo = new ComplianceInfo({ idleDelay: 0 }, { equalsCount: 0 });
      expect(complianceInfo.complyWithoutDelay()).toBe(true);
    });

    it('should return true if both delay and idleDelay are 0', () => {
      const complianceInfo = new ComplianceInfo({ delay: 0, idleDelay: 0 }, { equalsCount: 0 });
      expect(complianceInfo.complyWithoutDelay()).toBe(true);
    });

    it('should return false if delay and idleDelay are both greater than 0', () => {
      const complianceInfo = new ComplianceInfo({ delay: 10, idleDelay: 20 }, { equalsCount: 0 });
      expect(complianceInfo.complyWithoutDelay()).toBe(false);
    });

    it('should return false if delay and idleDelay are both less than 0', () => {
      const complianceInfo = new ComplianceInfo({ delay: -1, idleDelay: -1 }, { equalsCount: 0 });
      expect(complianceInfo.complyWithoutDelay()).toBe(false);
    });

    it('should return false if delay is less than 0 and idleDelay is greater than or equal to 0', () => {
      const complianceInfo = new ComplianceInfo({ delay: -1, idleDelay: 10 }, { equalsCount: 0 });
      expect(complianceInfo.complyWithoutDelay()).toBe(false);
    });

    it('should return false if idleDelay is less than 0 and delay is greater than or equal to 0', () => {
      const complianceInfo = new ComplianceInfo({ delay: 10, idleDelay: -1 }, { equalsCount: 0 });
      expect(complianceInfo.complyWithoutDelay()).toBe(false);
    });
  });
  describe('getPriority', () => {
    it('returns the priority object', () => {
      const complianceInfo = new ComplianceInfo();
      const priority = complianceInfo.getPriority();
      expect(priority).toEqual({
        equalsCount: 0,
        rulesCount: -1,
        rulesValueLength: 0,
      });
    });
  });

  describe('hasHigherPriorityThan', () => {
    it('returns true if the first compliance info has a higher priority than the second', () => {
      const complianceInfo1 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      const complianceInfo2 = new ComplianceInfo({ delay: 2000 }, { equalsCount: 0 });
      expect(complianceInfo1.hasHigherPriorityThan(complianceInfo2)).toBe(true);
    });

    it('returns false if the first compliance info has a lower priority than the second', () => {
      const complianceInfo1 = new ComplianceInfo({ delay: 2000 }, { equalsCount: 0 });
      const complianceInfo2 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      expect(complianceInfo1.hasHigherPriorityThan(complianceInfo2)).toBe(false);
    });

    it('returns false if the two compliance infos have the same priority', () => {
      const complianceInfo1 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      const complianceInfo2 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      expect(complianceInfo1.hasHigherPriorityThan(complianceInfo2)).toBe(false);
    });
  });

  describe('hasSamePriorityAs', () => {
    it('returns true if the two compliance infos have the same priority', () => {
      const complianceInfo1 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      const complianceInfo2 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      expect(complianceInfo1.hasSamePriorityAs(complianceInfo2)).toBe(true);
    });

    it('returns false if the two compliance infos have different priorities', () => {
      const complianceInfo1 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      const complianceInfo2 = new ComplianceInfo({ delay: 2000 }, { equalsCount: 0 });
      expect(complianceInfo1.hasSamePriorityAs(complianceInfo2)).toBe(false);
    });
  });

  describe('isDelayValid', () => {
    it('returns true if the delay is greater than or equal to zero', () => {
      const complianceInfo1 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
      expect(complianceInfo1.isDelayValid()).toBe(true);

      const complianceInfo2 = new ComplianceInfo({ delay: -1, idleDelay: 5000 }, { equalsCount: 1 });
      expect(complianceInfo2.isDelayValid()).toBe(true);
    });
  });

  describe('mergeDelayIfSmaller', () => {
    const complianceInfo1 = new ComplianceInfo({ delay: 1000 }, { equalsCount: 1 });
    test('should update delay if other delay is smaller', () => {
      complianceInfo1.delays = { delay: 2, idleDelay: -1 };
      const other = { delays: { delay: 1, idleDelay: -1 } };
      const result = complianceInfo1.mergeDelayIfSmaller(other);
      expect(result).toBe(true);
      expect(complianceInfo1.delays).toEqual({ delay: 1, idleDelay: -1 });
    });

    test('should not update delay if other delay is greater than or equal', () => {
      complianceInfo1.delays = { delay: 2, idleDelay: -1 };
      const other = { delays: { delay: 3, idleDelay: -1 } };
      const result = complianceInfo1.mergeDelayIfSmaller(other);
      expect(result).toBe(false);
      expect(complianceInfo1.delays).toEqual({ delay: 2, idleDelay: -1 });
    });
  });

  describe('mergeDelaysForAndCondition', () => {
    it("should use the biggest delays for 'and' conditions", () => {
      const delays1 = { delay: 500, idleDelay: 100 };
      const delays2 = { delay: 1000, idleDelay: 200 };
      const ci1 = new ComplianceInfo(delays1);
      const ci2 = new ComplianceInfo(delays2);
      ci1.mergeDelaysForAndCondition(ci2);
      expect(ci1.delays.delay).toEqual(1000);
      expect(ci1.delays.idleDelay).toEqual(200);
    });

    it('should set delay to -1 if other delay is -1', () => {
      const delays1 = { delay: 500, idleDelay: 100 };
      const delays2 = { delay: -1, idleDelay: 200 };
      const ci1 = new ComplianceInfo(delays1);
      const ci2 = new ComplianceInfo(delays2);
      ci1.mergeDelaysForAndCondition(ci2);
      expect(ci1.delays.delay).toEqual(-1);
      expect(ci1.delays.idleDelay).toEqual(200);
    });
  });

  describe('mergeDelaysForOrCondition', () => {
    it("should use the smallest delays for 'or' conditions", () => {
      const delays1 = { delay: 500, idleDelay: 100 };
      const delays2 = { delay: 1000, idleDelay: 200 };
      const ci1 = new ComplianceInfo(delays1);
      const ci2 = new ComplianceInfo(delays2);
      ci1.mergeDelaysForOrCondition(ci2);
      expect(ci1.delays.delay).toEqual(500);
      expect(ci1.delays.idleDelay).toEqual(100);
    });

    it("should merge the idle delay if it's smaller", () => {
      const delays1 = { delay: 500, idleDelay: 200 };
      const delays2 = { delay: 1000, idleDelay: 100 };
      const ci1 = new ComplianceInfo(delays1);
      const ci2 = new ComplianceInfo(delays2);
      ci1.mergeDelaysForOrCondition(ci2);
      expect(ci1.delays.delay).toEqual(500);
      expect(ci1.delays.idleDelay).toEqual(100);
    });
  });

  describe('mergeIdleDelayIfSmaller', () => {
    it("should set the idle delay to the other value if it's smaller", () => {
      const delays1 = { delay: 500, idleDelay: 200 };
      const delays2 = { delay: 1000, idleDelay: 100 };
      const ci1 = new ComplianceInfo(delays1);
      const ci2 = new ComplianceInfo(delays2);
      const result = ci1.mergeIdleDelayIfSmaller(ci2);
      expect(ci1.delays.idleDelay).toEqual(100);
      expect(result).toBeTruthy();
    });

    it('should not set the idle delay if the other value is -1', () => {
      const delays1 = { delay: 500, idleDelay: 200 };
      const delays2 = { delay: 1000, idleDelay: -1 };
      const ci1 = new ComplianceInfo(delays1);
      const ci2 = new ComplianceInfo(delays2);
      const result = ci1.mergeIdleDelayIfSmaller(ci2);
      expect(ci1.delays.idleDelay).toEqual(200);
      expect(result).toBeFalsy();
    });
  });

  describe('setPriority', () => {
    test('updates priority with the provided values', () => {
      const complianceInfo = new ComplianceInfo();
      const priority = {
        equalsCount: 2,
        rulesCount: 5,
        rulesValueLength: 10,
      };
      complianceInfo.setPriority(priority);
      expect(complianceInfo.priority).toEqual(priority);
    });
  });

  describe('updatePriority', () => {
    test('increments equalsCount if isEqualsOperator is true', () => {
      const complianceInfo = new ComplianceInfo();
      complianceInfo.updatePriority(true);
      expect(complianceInfo.priority.equalsCount).toBe(1);
    });

    test('increments rulesValueLength with the length of comparedValue if isEqualsOperator is false and comparedValue is provided', () => {
      const complianceInfo = new ComplianceInfo();
      complianceInfo.updatePriority(false, 'abc');
      expect(complianceInfo.priority.rulesValueLength).toBe(3);
    });

    test('increments rulesCount regardless of isEqualsOperator and comparedValue', () => {
      const complianceInfo = new ComplianceInfo();
      complianceInfo.updatePriority(true, 'abc');
      expect(complianceInfo.priority.rulesCount).toBe(0);
      complianceInfo.updatePriority(false);
      expect(complianceInfo.priority.rulesCount).toBe(1);
    });
  });
});
