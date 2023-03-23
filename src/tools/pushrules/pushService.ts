import { isValidStringOperator, rulesDefinitions as rulesDefinitionsImport } from './rulesDefinition';

import ComplianceInfo from './complianceInfo';
import { ExternalInfoProcessor } from './externalInfoProcessor';
import { Session } from '../storage';
import { VIEW_MODE } from '../constants';
import configuration from '../../../public/override/configuration.json';
import dydu from '../dydu';
import { isDefined } from '../helpers';

export const INTERACTION_EVENTS = ['mousemove', 'click', 'keyup'];
export const currentTimer: any = {};
export const externalInfoProcessors = [...ExternalInfoProcessor];
export const externalInfos = {};
export const rules: any = [];
export const rulesDefinition = [...(rulesDefinitionsImport || [])];
let canPush = true;

interface Rule {
  conditions?: any;
  kId?: number;
  bgpId?: number;
}
interface ExternInfos {
  windowLocation?: string;
  durationSinceLastVisit?: number;
  pagesViewedCount?: number;
  visitcount?: number;
  visitduration?: number;
}

//Rules from knowledge base
export function addRule(rule: Rule) {
  if (rule) {
    rules.push(rule);
  }
}

export function getExternalInfos(now) {
  while (externalInfoProcessors.length > 0) {
    const infoProcessor: any = externalInfoProcessors.pop();
    infoProcessor(externalInfos, now);
  }
  return externalInfos;
}

export function processGoalPage(rule: Rule, externInfos: ExternInfos) {
  const id = rule.bgpId;
  const urlToCheck = rule.conditions[0].param_1;
  if (dydu.getContextId() && dydu.getContextId() !== '' && urlCompliant(urlToCheck, externInfos.windowLocation)) {
    window.reword('_goalpage_:' + id, { hide: true });
  }
}

export function processRules(externInfos: ExternInfos) {
  let bestDelayId;
  let bestIdleDelayId;
  const bestCompliance = new ComplianceInfo();
  for (let cpt = 0; cpt < rules.length; cpt++) {
    const rule = rules[cpt];
    const id = rule.kId;
    if (id === undefined) {
      processGoalPage(rule, externInfos);
    } else {
      const conditionsContainer = {
        children: rule.conditions,
        type: 'Container',
      };
      const ruleCompliance = computeRuleCompliance(conditionsContainer, id, externInfos);
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

let chatboxNodeElement: HTMLElement | null = null;
export function getChatboxNodeElement() {
  if (!isDefined(chatboxNodeElement)) chatboxNodeElement = document.getElementById(configuration?.root);
  return chatboxNodeElement;
}

export function handlePush(delay, delayRuleId, idleDelay, idleDelayRuleId) {
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
        if ((<any>document).attachEvent) {
          (<any>document).attachEvent('on' + INTERACTION_EVENTS[i], () => interaction(idleDelayRuleId));
        } else {
          const event: [string, () => void] = [INTERACTION_EVENTS[i], () => interaction(idleDelayRuleId)];
          try {
            getChatboxNodeElement()?.addEventListener(...event);
          } catch (e) {
            document.addEventListener(...event);
          }
        }
      }
      currentTimer.counter = setTimeout(() => {
        pushKnowledge(idleDelayRuleId);
      }, idleDelay * 1000);
      currentTimer.duration = idleDelay * 1000;
    }
  }
}

export function interaction(ruleId) {
  if (currentTimer.counter) {
    clearTimeout(currentTimer.counter);
    currentTimer.counter = setTimeout(() => {
      pushKnowledge(ruleId);
    }, currentTimer.duration);
  }
}

export function computeRuleCompliance(condition, ruleId, externInfos) {
  const bestChildCompliance = computeChildrenCompliance(condition, ruleId, externInfos);
  return computeConditionCompliance(condition, ruleId, externInfos, bestChildCompliance);
}

export function computeChildrenCompliance(condition, ruleId, externInfos) {
  let bestCompliance = new ComplianceInfo();
  if (condition.children) {
    for (let c = 0; c < condition.children.length; c++) {
      condition.children[c].parent = condition;
      const childCompliance = computeRuleCompliance(condition.children[c], ruleId, externInfos);
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

export function computeConditionCompliance(condition, ruleId, externInfos, childCompliance) {
  const conditionCompliance = new ComplianceInfo();
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
    const ruleDefinition = rulesDefinition[i];
    if (condition.type === ruleDefinition.name) {
      result = new ComplianceInfo(ruleDefinition.processDelays(condition, ruleId, externInfos));
      break;
    }
  }
  return result;
}

export function pushKnowledge(ruleId) {
  const sessionKey = Session?.names?.pushruleTrigger + '_' + ruleId;
  const shouldDisplay = canPush && !isDefined(Session.get(sessionKey));
  if (shouldDisplay) {
    window.dydu?.ui.toggle(VIEW_MODE.popin);
    window.reword('_pushcondition_:' + ruleId, { hide: true });
    Session.set(sessionKey, ruleId);
    canPush = false;
  }
}

export function urlCompliant(pattern, url) {
  try {
    if (pattern.substring(pattern.length - 1) === '%') {
      return url.substring(0, pattern.length - 1) === pattern.substring(0, pattern.length - 1);
    }
    return pattern === url;
  } catch (e) {
    return false;
  }
}
