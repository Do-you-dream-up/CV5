interface Delays {
  delay: number;
  idleDelay: number;
}

interface Priority {
  equalsCount: number;
  rulesCount: number;
  rulesValueLength: number;
}

export default class ComplianceInfo {
  delays: Delays;
  priority: Priority;

  constructor(
    delays: Delays = { delay: -1, idleDelay: -1 },
    priority: Priority = { equalsCount: 0, rulesCount: -1, rulesValueLength: 0 },
  ) {
    this.delays = { delay: delays.delay, idleDelay: delays.idleDelay };
    this.priority = {
      equalsCount: priority.equalsCount || 0,
      rulesCount: priority.rulesCount || -1,
      rulesValueLength: priority.rulesValueLength || 0,
    };
  }

  comparePriorities(other: ComplianceInfo): number {
    if (this.priority.equalsCount !== other.priority.equalsCount) {
      return this.priority.equalsCount - other.priority.equalsCount;
    } else if (this.priority.rulesCount !== other.priority.rulesCount) {
      return this.priority.rulesCount - other.priority.rulesCount;
    }
    return this.priority.rulesValueLength - other.priority.rulesValueLength;
  }

  complyWithoutDelay(): boolean {
    return this.delays.delay === 0 || this.delays.idleDelay === 0;
  }

  copy(other: ComplianceInfo): void {
    this.delays.delay = other.delays.delay;
    this.delays.idleDelay = other.delays.idleDelay;
    this.priority.equalsCount = other.priority.equalsCount;
    this.priority.rulesCount = other.priority.rulesCount;
    this.priority.rulesValueLength = other.priority.rulesValueLength;
  }

  getDelay(): number {
    return this.delays.delay;
  }

  getIdleDelay(): number {
    return this.delays.idleDelay;
  }

  getPriority(): Priority {
    return this.priority;
  }

  hasHigherPriorityThan(other: ComplianceInfo): boolean {
    return this.comparePriorities(other) > 0;
  }

  hasSamePriorityAs(other: ComplianceInfo): boolean {
    return this.comparePriorities(other) === 0;
  }

  isDelayValid(): boolean {
    return this.delays.delay >= 0 || this.delays.idleDelay >= 0;
  }

  mergeDelayIfSmaller(other: ComplianceInfo): boolean {
    if (this.delays.delay === -1 || (other.delays.delay >= 0 && other.delays.delay < this.delays.delay)) {
      this.delays.delay = other.delays.delay;
      return true;
    }
    return false;
  }

  mergeDelaysForAndCondition(other: ComplianceInfo): void {
    // Use the largest delays for 'and' conditions
    if (this.delays.delay !== -1) {
      this.delays.delay = Math.max(this.delays.delay, other.delays.delay);
    }
    if (other.delays.delay === -1) {
      // Condition complies only if idleDelay is respected.
      this.delays.delay = -1;
    }
    this.delays.idleDelay = Math.max(this.delays.idleDelay, other.delays.idleDelay);
  }

  mergeDelaysForOrCondition(other: ComplianceInfo): void {
    // Use the smallest delays for 'or' conditions
    this.mergeDelayIfSmaller(other);
    this.mergeIdleDelayIfSmaller(other);
  }

  mergeIdleDelayIfSmaller(other: ComplianceInfo): boolean {
    if (
      this.delays.idleDelay === -1 ||
      (other.delays.idleDelay >= 0 && other.delays.idleDelay < this.delays.idleDelay)
    ) {
      this.delays.idleDelay = other.delays.idleDelay;
      return true;
    }
    return false;
  }

  setPriority(priority: Priority): void {
    this.priority.equalsCount = priority.equalsCount;
    this.priority.rulesCount = priority.rulesCount;
    this.priority.rulesValueLength += priority.rulesValueLength;
  }

  updatePriority(isEqualsOperator: boolean, comparedValue: string | undefined | null): void {
    if (isEqualsOperator) {
      this.priority.equalsCount++;
    } else if (comparedValue) {
      this.priority.rulesValueLength += comparedValue.length;
    }
    this.priority.rulesCount++;
  }
}
