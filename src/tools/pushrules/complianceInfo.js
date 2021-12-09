export default function ComplianceInfo(delays, priority) {
  delays = delays || { delay: -1, idleDelay: -1 };
  priority = priority || {
    equalsCount: 0,
    rulesCount: -1,
    rulesValueLength: 0,
  };
  this.delays = { delay: delays.delay, idleDelay: delays.idleDelay };
  this.priority = {
    equalsCount: priority.equalsCount || 0,
    rulesCount: priority.rulesCount || -1,
    rulesValueLength: priority.rulesValueLength || 0, // length for string values not using Equals operator.
  };

  this.comparePriorities = function (other) {
    //return negative number if this is less prioritary, 0 if same, positive if more prioritary
    if (this.priority.equalsCount !== other.priority.equalsCount) {
      return this.priority.equalsCount - other.priority.equalsCount;
    } else if (this.priority.rulesCount !== other.priority.rulesCount) {
      return this.priority.rulesCount - other.priority.rulesCount;
    }
    return this.priority.rulesValueLength - other.priority.rulesValueLength;
  };

  this.complyWithoutDelay = function () {
    return this.delays.delay === 0 || this.delays.idleDelay === 0;
  };

  this.copy = function (other) {
    this.delays.delay = other.delays.delay;
    this.delays.idleDelay = other.delays.idleDelay;
    this.priority.equalsCount = other.priority.equalsCount;
    this.priority.rulesCount = other.priority.rulesCount;
    this.priority.rulesValueLength = other.priority.rulesValueLength;
  };

  this.getDelay = function () {
    return this.delays.delay;
  };

  this.getIdleDelay = function () {
    return this.delays.idleDelay;
  };

  this.getPriority = function () {
    return this.priority;
  };

  this.hasHigherPriorityThan = function (other) {
    return this.comparePriorities(other) > 0;
  };

  this.hasSamePriorityAs = function (other) {
    return this.comparePriorities(other) === 0;
  };

  this.isDelayValid = function () {
    return this.delays.delay >= 0 || this.delays.idleDelay >= 0;
  };

  this.mergeDelayIfSmaller = function (other) {
    if (this.delays.delay === -1 || (other.delays.delay >= 0 && other.delays.delay < this.delays.delay)) {
      this.delays.delay = other.delays.delay;
      return true;
    }
    return false;
  };

  this.mergeDelaysForAndCondition = function (other) {
    //Use the biggest delays, for 'and' conditions
    if (this.delays.delay !== -1) {
      this.delays.delay = Math.max(this.delays.delay, other.delays.delay);
    }
    if (other.delays.delay === -1) {
      //Condition complies only if idleDelay is respected.
      this.delays.delay = -1;
    }
    this.delays.idleDelay = Math.max(this.delays.idleDelay, other.delays.idleDelay);
  };

  this.mergeDelaysForOrCondition = function (other) {
    //Use the smallest delays, for 'or' conditions
    this.mergeDelayIfSmaller(other);
    this.mergeIdleDelayIfSmaller(other);
  };

  this.mergeIdleDelayIfSmaller = function (other) {
    if (
      this.delays.idleDelay === -1 ||
      (other.delays.idleDelay >= 0 && other.delays.idleDelay < this.delays.idleDelay)
    ) {
      this.delays.idleDelay = other.delays.idleDelay;
      return true;
    }
    return false;
  };

  this.setPriority = function (priority) {
    this.priority.equalsCount = priority.equalsCount;
    this.priority.rulesCount = priority.rulesCount;
    this.priority.rulesValueLength += priority.rulesValueLength;
  };

  this.updatePriority = function (isEqualsOperator, comparedValue) {
    if (isEqualsOperator) {
      this.priority.equalsCount++;
    } else if (comparedValue) {
      this.priority.rulesValueLength += comparedValue.length;
    }
    this.priority.rulesCount++;
  };
}
