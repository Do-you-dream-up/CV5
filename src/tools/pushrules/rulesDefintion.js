import contextPush from './contextPushExt';
import { processConditionCompliance } from './pushService';

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

export const rulesDefintions = [
  {
    name: 'Container',
    processDelays: function () {
      return VALID_DELAY;
    },
  },
  {
    name: 'CurrentPage',
    processDelays: function (condition, ruleId, externInfos) {
      return isStringValueCompliant(condition, externInfos.windowLocation);
    },
  },

  {
    name: 'PastPage',
    processDelays: function (condition, ruleId, externInfos) {
      return isStringValueCompliant(condition, externInfos.windowLocation);
    },
  },
  {
    name: 'PageVisitCount',
    processDelays: function (condition, ruleId, externInfos) {
      if (isValidNumericOperator(condition.operator)) {
        let compliantConditionIndexes = getPageConditions(condition, ruleId, externInfos, true);
        let pageConditions = getPageConditions(condition, ruleId, externInfos, false);
        let isCompliant = false;
        //Check rule compliance
        for (let i = 0; i < pageConditions.length; i++) {
          let conditionId = condition.index + '-' + pageConditions[i].index;
          let pageVisitCount = parseInt(contextPush.getPushData(ruleId, conditionId, 0));
          if (pageConditions[i].type === 'CurrentPage') {
            pageVisitCount++;
          }
          if (isNumberCompliant(pageVisitCount, condition.value, condition.operator)) {
            isCompliant = true;
          }
        }
        //Increment past pages values
        for (let j = 0; j < compliantConditionIndexes.length; j++) {
          let compliantConditionId = condition.index + '-' + compliantConditionIndexes[j];
          let compliantPageVisitCount = parseInt(contextPush.getPushData(ruleId, compliantConditionId, 0)) + 1;
          contextPush.setPushData(ruleId, compliantConditionId, compliantPageVisitCount);
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
    processDelays: function (condition) {
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
    processDelays: function (condition) {
      if (isValidNumericOperator(condition.operator)) {
        let delay = parseInt(condition.value);
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
    processDelays: function (condition, ruleId, externInfos) {
      return isNumberValueCompliant(condition, externInfos.visitCount);
    },
  },
  {
    name: 'GlobalVisitDuration',
    processDelays: function (condition, ruleId, externInfos) {
      let delay = parseInt(condition.value);
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
    processDelays: function (condition, ruleId, externInfos) {
      return isStringValueCompliant(condition, externInfos.referrer);
    },
  },
  {
    name: 'PagesViewedCount',
    processDelays: function (condition, ruleId, externInfos) {
      return isNumberValueCompliant(condition, externInfos.pagesViewedCount);
    },
  },
  {
    name: 'City',
    processDelays: function (condition, ruleId, externInfos) {
      if (!externInfos.city) {
        localisationProcessor(externInfos);
      }
      return isStringValueCompliant(condition, externInfos.city);
    },
  },
  {
    name: 'Country',
    processDelays: function (condition, ruleId, externInfos) {
      if (!externInfos.country) {
        localisationProcessor(externInfos);
      }
      return isStringValueCompliant(condition, externInfos.country);
    },
  },
  {
    name: 'Language',
    processDelays: function (condition, ruleId, externInfos) {
      return isStringValueCompliant(condition, externInfos.language);
    },
  },
  {
    name: 'NumberOfPreviousChat',
    processDelays: function (condition, ruleId, externInfos) {
      return isNumberValueCompliant(condition, externInfos.numberOfPreviousChat);
    },
  },
  {
    name: 'UsedKeyWords',
    processDelays: function (condition, ruleId, externInfos) {
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
    processDelays: function (condition, ruleId, externInfos) {
      return isNumberValueCompliant(condition, externInfos.durationSinceLastVisit);
    },
  },
];

function isStringValueCompliant(condition, valueToCompare) {
  if (isValidStringOperator(condition.operator)) {
    const pattern = computeRegex(condition.value, condition.operator);
    if (condition.operator !== OPERATOR.IsContained) {
      return isStringCompliant(valueToCompare, pattern, condition.operator) ? VALID_DELAY : INVALID_DELAY;
    } else {
      return condition.value.toLowerCase().indexOf(valueToCompare.toLowerCase()) >= 0 ? VALID_DELAY : INVALID_DELAY;
    }
  }
  return INVALID_DELAY;
}

export function isValidStringOperator(operator) {
  return (
    operator === OPERATOR.Equals ||
    operator === OPERATOR.NotEquals ||
    operator === OPERATOR.StartsWith ||
    operator === OPERATOR.DoesNotStartWith ||
    operator === OPERATOR.IsContained ||
    operator === OPERATOR.Contains
  );
}

function isStringCompliant(url, pattern, operator) {
  if (operator === OPERATOR.DoesNotStartWith) {
    return !new RegExp(pattern, 'i').test(url);
  } else {
    return new RegExp(pattern, 'i').test(url);
  }
}

function computeRegex(val, operator) {
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
}

function isNumberValueCompliant(condition, valueToCompare) {
  return isValidNumericOperator(condition.operator) &&
    isNumberCompliant(valueToCompare, condition.value, condition.operator)
    ? VALID_DELAY
    : INVALID_DELAY;
}

function isValidNumericOperator(operator) {
  return (
    operator === OPERATOR.Equals ||
    operator === OPERATOR.NotEquals ||
    operator === OPERATOR.GreaterThan ||
    operator === OPERATOR.LesserThan
  );
}

function isNumberCompliant(number1, number2, operator) {
  const n1 = parseInt(number1);
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
}

function getPageConditions(condition, ruleId, externInfos, compliantIndexesOnly) {
  const indexes = [];
  const conditions = [];
  getChildrenPageConditions(condition, conditions);
  //Get compliant indexes -> Pages condition in direct children.
  if (compliantIndexesOnly) {
    for (let i = 0; i < conditions.length; i++) {
      const compliance = processConditionCompliance(conditions[i], ruleId, externInfos);
      if (compliance.isDelayValid()) {
        indexes.push(conditions[i].index);
      }
    }
  } else {
    return conditions;
  }
  return indexes;
}

function getChildrenPageConditions(condition, conditions) {
  if (condition.children) {
    for (let i = 0; i < condition.children.length; i++) {
      const childCondition = condition.children[i];
      if (childCondition.type === 'CurrentPage' || childCondition.type === 'PastPage') {
        conditions.push(childCondition);
      }
    }
  }
}

//Process only on demand
function localisationProcessor(externalInfos) {
  // function cityAndCountrySetter(data) {
  //   contextPush.setCity(data.city);
  //   contextPush.setCountry(data.country);
  //   externalInfos.city = contextPush.getCity();
  //   externalInfos.country = contextPush.getCountry();
  // }

  if (contextPush.getCity() === 'undefined') {
    /*$http.jsonp($configurations.get('servletUrl') + '/localisation?format=angular&callback=JSON_CALLBACK')
            .success(cityAndCountrySetter)
            .error(function () {
                $http.jsonp($configurations.get('backupServletUrl') + '/localisation?format=angular&callback=JSON_CALLBACK')
                    .success(cityAndCountrySetter);
            });*/
  } else {
    externalInfos.city = contextPush.getCity();
    externalInfos.country = contextPush.getCountry();
  }
}
