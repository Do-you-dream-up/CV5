import contextPush from './contextPushExt';
import { BOT } from '../bot';
import ComplianceInfo from './complianceInfo';
import { ExternalInfos } from '../../contexts/PushrulesContext';

const INVALID_DELAY = { delay: -1, idleDelay: -1 };
const VALID_DELAY = { delay: 0, idleDelay: -1 };

const OPERATOR = {
  Contains: 'Contains',
  DoesNotStartWith: 'DoesNotStartWith',
  Equals: 'Equals',
  GreaterThan: 'GreaterThan',
  IsContained: 'IsContained',
  LesserThan: 'LesserThan',
  NotEquals: 'NotEquals',
  StartsWith: 'StartsWith',
};

interface Condition {
  type: string;
  operator: string;
  value: string;
  index?: string;
  children?: Condition[];
}

interface Rule {
  name: string;
  processDelays: (
    condition: Condition,
    ruleId: string,
    externInfos: ExternalInfos,
  ) => { delay: number; idleDelay: number };
}

const processConditionCompliance = (condition: any, ruleId: string, externInfos: ExternalInfos) => {
  let result = new ComplianceInfo();

  rulesDefinitions.forEach((ruleDefinition) => {
    if (condition.type === ruleDefinition.name) {
      result = new ComplianceInfo(ruleDefinition.processDelays(condition, ruleId, externInfos));
    }
  });

  return result;
};

export const rulesDefinitions: Rule[] = [
  {
    name: 'Container',
    processDelays: function (): { delay: number; idleDelay: number } {
      return VALID_DELAY;
    },
  },
  {
    name: 'CurrentPage',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isStringValueCompliant(condition, externInfos.windowLocation);
    },
  },

  {
    name: 'PastPage',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isStringValueCompliant(condition, externInfos.windowLocation);
    },
  },
  {
    name: 'PageVisitCount',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      if (isValidNumericOperator(condition.operator)) {
        const compliantConditionIndexes: Condition[] = getPageConditions(condition, ruleId, externInfos, true);
        const pageConditions: Condition[] = getPageConditions(condition, ruleId, externInfos, false);
        let isCompliant = false;

        for (let i = 0; i < pageConditions.length; i++) {
          const conditionId = condition.index + '-' + pageConditions[i].index;
          let pageVisitCount = parseInt(contextPush.getPushData('', BOT.id, ruleId, conditionId, '0'));
          if (pageConditions[i].type === 'CurrentPage') {
            pageVisitCount++;
          }
          if (isNumberCompliant(pageVisitCount, condition.value, condition.operator)) {
            isCompliant = true;
          }
        }

        for (let j = 0; j < compliantConditionIndexes.length; j++) {
          const compliantConditionId = condition.index + '-' + compliantConditionIndexes[j].index;
          const compliantPageVisitCount =
            parseInt(contextPush.getPushData('', BOT.id, ruleId, compliantConditionId, '0')) + 1;
          contextPush.setPushData('', BOT.id, ruleId, compliantConditionId, compliantPageVisitCount);
        }

        if (isCompliant) {
          return VALID_DELAY;
        }
      }
      return INVALID_DELAY;
    },
  },
  {
    name: 'PageVisitDuration',
    processDelays: function (condition: Condition): { delay: number; idleDelay: number } {
      if (isValidNumericOperator(condition.operator)) {
        const delay = parseInt(condition.value);
        if (!isNaN(delay)) {
          if (condition.operator === OPERATOR.LesserThan) {
            return VALID_DELAY;
          } else {
            return { delay: Math.max(0, delay), idleDelay: -1 };
          }
        }
      }
      return INVALID_DELAY;
    },
  },
  {
    name: 'IdleDuration',
    processDelays: function (condition: Condition): { delay: number; idleDelay: number } {
      if (isValidNumericOperator(condition.operator)) {
        const delay = parseInt(condition.value);
        if (!isNaN(delay)) {
          if (condition.operator === OPERATOR.LesserThan) {
            return VALID_DELAY;
          } else {
            return { delay: -1, idleDelay: Math.max(0, delay) };
          }
        }
      }
      return INVALID_DELAY;
    },
  },
  {
    name: 'GlobalVisitCount',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isNumberValueCompliant(condition, externInfos.visitCount);
    },
  },
  {
    name: 'GlobalVisitDuration',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      const delay = parseInt(condition.value);
      if (VALID_DELAY === isNumberValueCompliant(condition, externInfos.visitDuration)) {
        return VALID_DELAY;
      } else if (isValidNumericOperator(condition.operator) && externInfos.visitDuration < delay) {
        return { delay: delay - externInfos.visitDuration, idleDelay: -1 };
      }
      return INVALID_DELAY;
    },
  },
  {
    name: 'PreviousPage',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isStringValueCompliant(condition, externInfos.referrer);
    },
  },
  {
    name: 'PagesViewedCount',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isNumberValueCompliant(condition, externInfos.pagesViewedCount);
    },
  },
  {
    name: 'City',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      if (!externInfos.city) {
        localisationProcessor(externInfos);
      }
      return isStringValueCompliant(condition, externInfos.city);
    },
  },
  {
    name: 'Country',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      if (!externInfos.country) {
        localisationProcessor(externInfos);
      }
      return isStringValueCompliant(condition, externInfos.country);
    },
  },
  {
    name: 'Language',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isStringValueCompliant(condition, externInfos.language);
    },
  },
  {
    name: 'NumberOfPreviousChat',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isNumberValueCompliant(condition, externInfos.numberOfPreviousChat);
    },
  },
  {
    name: 'UsedKeyWords',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      for (let i = 0; i < externInfos.usedKeywords.length; i++) {
        if (VALID_DELAY === isStringValueCompliant(condition, externInfos.usedKeywords[i])) {
          return VALID_DELAY;
        }
      }
      return INVALID_DELAY;
    },
  },
  {
    name: 'DurationSinceLastVisit',
    processDelays: function (
      condition: Condition,
      ruleId: string,
      externInfos: ExternalInfos,
    ): { delay: number; idleDelay: number } {
      return isNumberValueCompliant(condition, externInfos.durationSinceLastVisit);
    },
  },
];

export const isStringValueCompliant = (condition: Condition, valueToCompare: string | undefined) => {
  if (valueToCompare && isValidStringOperator(condition.operator)) {
    const pattern = computeRegex(condition.value, condition.operator);
    if (condition.operator !== OPERATOR.IsContained) {
      return isStringCompliant(valueToCompare, pattern, condition.operator) ? VALID_DELAY : INVALID_DELAY;
    } else {
      return condition.value.toLowerCase().indexOf(valueToCompare.toLowerCase()) >= 0 ? VALID_DELAY : INVALID_DELAY;
    }
  }
  return INVALID_DELAY;
};

export const isValidStringOperator = (operator: string) => {
  return (
    operator === OPERATOR.Equals ||
    operator === OPERATOR.NotEquals ||
    operator === OPERATOR.StartsWith ||
    operator === OPERATOR.DoesNotStartWith ||
    operator === OPERATOR.IsContained ||
    operator === OPERATOR.Contains
  );
};

export const isStringCompliant = (url: string, pattern: string, operator: string) => {
  if (operator === OPERATOR.DoesNotStartWith) {
    return !new RegExp(pattern, 'i').test(url);
  } else {
    return new RegExp(pattern, 'i').test(url);
  }
};

export const computeRegex = (val: string, operator: string) => {
  val = val || '';
  val = val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  if (operator === OPERATOR.StartsWith || operator === OPERATOR.DoesNotStartWith) {
    val = '^' + val;
  } else if (operator === OPERATOR.Equals) {
    val = '^' + val + '$';
  } else if (operator === OPERATOR.NotEquals) {
    val = '^(?!' + val + '$)';
  }
  return val;
};

export const isNumberValueCompliant = (condition: Condition, valueToCompare: number | undefined) => {
  return valueToCompare &&
    isValidNumericOperator(condition.operator) &&
    isNumberCompliant(valueToCompare, condition.value, condition.operator)
    ? VALID_DELAY
    : INVALID_DELAY;
};

export const isValidNumericOperator = (operator: string) => {
  return (
    operator === OPERATOR.Equals ||
    operator === OPERATOR.NotEquals ||
    operator === OPERATOR.GreaterThan ||
    operator === OPERATOR.LesserThan
  );
};

export const isNumberCompliant = (number1: number, number2: string, operator: string) => {
  const n1 = parseInt(number1.toString());
  const n2 = parseInt(number2);
  if (operator === OPERATOR.Equals) {
    return n1 === n2;
  } else if (operator === OPERATOR.GreaterThan) {
    return n1 > n2;
  } else if (operator === OPERATOR.LesserThan) {
    return n1 < n2;
  } else if (operator === OPERATOR.NotEquals) {
    return n1 !== n2;
  }
  return false;
};

export const getPageConditions = (
  condition: Condition,
  ruleId: string,
  externInfos: ExternalInfos,
  compliantIndexesOnly: boolean,
): Condition[] => {
  let compliantConditions: Condition[] = [];
  const conditions: Condition[] = [];
  getChildrenPageConditions(condition, conditions);

  if (compliantIndexesOnly) {
    for (let i = 0; i < conditions.length; i++) {
      const compliance = processConditionCompliance(conditions[i], ruleId, externInfos);
      if (compliance.isDelayValid()) {
        compliantConditions.push(conditions[i]);
      }
    }
  } else {
    compliantConditions = [...conditions];
  }
  return compliantConditions;
};

export const getChildrenPageConditions = (condition: Condition, conditions: Condition[]) => {
  if (condition.children) {
    for (let i = 0; i < condition.children.length; i++) {
      const childCondition = condition.children[i];
      if (childCondition.type === 'CurrentPage' || childCondition.type === 'PastPage') {
        conditions.push(childCondition);
      }
    }
  }
};

export const localisationProcessor = (externalInfos: ExternalInfos) => {
  if (contextPush.getCity() === 'undefined') {
    // Uncomment and implement the logic for city/country fetching
  } else {
    externalInfos.city = contextPush.getCity();
    externalInfos.country = contextPush.getCountry();
  }
};
