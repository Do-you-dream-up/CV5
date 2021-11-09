import dydu from '../dydu';
import ComplianceInfo from './complianceInfo';
import { ExternalInfoProcessor } from './externalInfoProcessor';
import { isValidStringOperator, rulesDefintions } from './rulesDefintion';

const INTERACTION_EVENTS = ['mousemove', 'click', 'keyup'];
const currentTimer = {};
const externalInfoProcessors = [...ExternalInfoProcessor];
const externalInfos = {};
const rules = [];
const rulesDefinition = [...rulesDefintions];
let canPush = true;

//infoProcessor must be a function that takes externalInfos object as a parameter.
// eslint-disable-next-line no-unused-vars
function addExternalInfoProcessor(infoProcessor) {
  if (infoProcessor) {
    externalInfoProcessors.push(infoProcessor);
  }
}

//Rule definitions
// eslint-disable-next-line no-unused-vars
function addRuleDefinition(ruleDefinition) {
  if (ruleDefinition) {
    rulesDefinition.push(ruleDefinition);
  }
}

//Rules from knowledge base
export function addRule(rule) {
  if (rule) {
    rules.push(rule);
  }
}

export function getExternalInfos(now) {
  while (externalInfoProcessors.length > 0) {
    let infoProcessor = externalInfoProcessors.pop();
    infoProcessor(externalInfos, now);
  }
  return externalInfos;
}

function processGoalPage(rule, externInfos) {
  const id = rule.bgpId;
  const urlToCheck = rule.conditions[0].param_1;
  if (dydu.getContextId() && dydu.getContextId() !== '' && urlCompliant(urlToCheck, externInfos.windowLocation)) {
    window.reword('_goalpage_:' + id, { hide: true });
  }
}

export function processRules(externInfos) {
  let bestDelayId;
  let bestIdleDelayId;
  let bestCompliance = new ComplianceInfo();
  for (let cpt = 0; cpt < rules.length; cpt++) {
    let rule = rules[cpt];
    let id = rule.kId;
    if (id === undefined) {
      processGoalPage(rule, externInfos);
    } else {
      let conditionsContainer = {
        children: rule.conditions,
        type: 'Container',
      };
      let ruleCompliance = computeRuleCompliance(conditionsContainer, id, externInfos);
      if (ruleCompliance.hasHigherPriorityThan(bestCompliance)) {
        if (ruleCompliance.isDelayValid()) {
          bestDelayId = id;
          bestIdleDelayId = id;
          bestCompliance.copy(ruleCompliance);
        }
      } else if (ruleCompliance.hasSamePriorityAs(bestCompliance)) {
        if (bestCompliance.mergeDelayIfSmaller(ruleCompliance)) {
          bestDelayId = id;
        }
        if (bestCompliance.mergeIdleDelayIfSmaller(ruleCompliance)) {
          bestIdleDelayId = id;
        }
      }
    }
  }
  //Push best compliant knowledges
  handlePush(bestCompliance.getDelay(), bestDelayId, bestCompliance.getIdleDelay(), bestIdleDelayId);
}

function handlePush(delay, delayRuleId, idleDelay, idleDelayRuleId) {
  if (delay !== -1 || idleDelay !== -1) {
    if (delay === 0) {
      pushKnowledge(delayRuleId);
    } else if (idleDelay === 0) {
      pushKnowledge(idleDelayRuleId);
    } else {
      if (delay !== -1) {
        setTimeout(() => {
          pushKnowledge(delayRuleId);
        }, delay * 1000);
      }
      if (idleDelay !== -1 && !currentTimer.counter) {
        for (let i = 0; i < INTERACTION_EVENTS.length; i++) {
          if (document.attachEvent) {
            document.attachEvent('on' + INTERACTION_EVENTS[i], interaction(idleDelayRuleId));
          } else {
            document.addEventListener(INTERACTION_EVENTS[i], interaction(idleDelayRuleId));
          }
        }
        currentTimer.counter = setTimeout(() => {
          pushKnowledge(idleDelayRuleId);
        }, idleDelay * 1000);
        currentTimer.duration = idleDelay * 1000;
      }
    }
  }
}

function interaction(ruleId) {
  if (currentTimer.counter) {
    clearTimeout(currentTimer.counter);
    currentTimer.counter = setTimeout(() => {
      pushKnowledge(ruleId);
    }, currentTimer.duration);
  }
}

function computeRuleCompliance(condition, ruleId, externInfos) {
  let bestChildCompliance = computeChildrenCompliance(condition, ruleId, externInfos);
  return computeConditionCompliance(condition, ruleId, externInfos, bestChildCompliance);
}

function computeChildrenCompliance(condition, ruleId, externInfos) {
  let bestCompliance = new ComplianceInfo();
  if (condition.children) {
    for (let c = 0; c < condition.children.length; c++) {
      condition.children[c].parent = condition;
      let childCompliance = computeRuleCompliance(condition.children[c], ruleId, externInfos);
      if (childCompliance.hasHigherPriorityThan(bestCompliance)) {
        if (childCompliance.isDelayValid()) {
          // Use childDelays
          bestCompliance.copy(childCompliance);
        }
      } else if (childCompliance.hasSamePriorityAs(bestCompliance)) {
        bestCompliance.mergeDelaysForOrCondition(childCompliance);
        if (bestCompliance.complyWithoutDelay()) {
          //Children rules are compliant.
          break;
        }
      }
    }
  } else {
    bestCompliance = new ComplianceInfo({ delay: 0, idleDelay: -1 });
  }
  return bestCompliance;
}

function computeConditionCompliance(condition, ruleId, externInfos, childCompliance) {
  let conditionCompliance = new ComplianceInfo();
  // Ignore PastPage type
  if (condition.type === 'PastPage' && !(condition.parent.type === 'Container' && !condition.children)) {
    conditionCompliance.mergeDelaysForOrCondition(childCompliance);
  } else if (childCompliance.isDelayValid()) {
    conditionCompliance.copy(processConditionCompliance(condition, ruleId, externInfos));
    if (conditionCompliance.isDelayValid()) {
      conditionCompliance.mergeDelaysForAndCondition(childCompliance);
      conditionCompliance.setPriority(childCompliance.getPriority());
    }
  }
  if (conditionCompliance.isDelayValid()) {
    let comparedValue = null;
    if (isValidStringOperator(condition.operator)) {
      comparedValue = condition.value;
    }
    conditionCompliance.updatePriority(
      condition.operator === 'Equals' || condition.operator === 'NotEquals',
      comparedValue,
    );
  }
  return conditionCompliance;
}

export function processConditionCompliance(condition, ruleId, externInfos) {
  let result = new ComplianceInfo();
  for (let i = 0; i < rulesDefinition.length; i++) {
    let ruleDefinition = rulesDefinition[i];
    if (condition.type === ruleDefinition.name) {
      result = new ComplianceInfo(ruleDefinition.processDelays(condition, ruleId, externInfos));
      break;
    }
  }
  return result;
}

function pushKnowledge(ruleId) {
  if (canPush) {
    window.reword('_pushcondition_:' + ruleId, { hide: true });
    canPush = false;
  }
}

function urlCompliant(pattern, url) {
  try {
    if (pattern.substring(pattern.length - 1) === '%') {
      return url.substring(0, pattern.length - 1) === pattern.substring(0, pattern.length - 1);
    }
    return pattern === url;
  } catch (e) {
    return false;
  }
}
