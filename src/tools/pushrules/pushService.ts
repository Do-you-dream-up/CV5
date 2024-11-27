import { isValidStringOperator, rulesDefinitions as rulesDefinitionsImport } from './rulesDefinition';

import ComplianceInfo from './complianceInfo';
import { ExternalInfoProcessor } from './externalInfoProcessor';
import { Local } from '../storage';
import { VIEW_MODE } from '../constants';
import configuration from '../../../public/override/configuration.json';
import dydu from '../dydu';
import { isDefined } from '../helpers';
import { PushRule } from '../hooks/usePushrules';

export const INTERACTION_EVENTS = ['mousemove', 'click', 'keyup'];
export const currentTimer: any = {};
export const externalInfoProcessors = [...ExternalInfoProcessor];
export const externalInfos = {};
export const rulesDefinition = [...(rulesDefinitionsImport || [])];

interface ExternInfos {
  windowLocation?: string;
  durationSinceLastVisit?: number;
  pagesViewedCount?: number;
  visitcount?: number;
  visitduration?: number;
}

export const clearCurrentTimeout = () => {
  if (currentTimer.counter) {
    clearTimeout(currentTimer.counter);
    currentTimer.counter = null;
  }
};

export function getExternalInfos(now) {
  const tmpExternalInfoProcessors = [...externalInfoProcessors];
  while (tmpExternalInfoProcessors.length > 0) {
    const infoProcessor: any = tmpExternalInfoProcessors.pop();
    infoProcessor(externalInfos, now);
  }
  return externalInfos;
}

export function processGoalPage(rule: PushRule, externInfos: ExternInfos) {
  const id = rule.bgpId;
  const urlToCheck = rule?.conditions?.[0].param_1;
  if (dydu.getContextId() && dydu.getContextId() !== '' && urlCompliant(urlToCheck, externInfos.windowLocation)) {
    window.reword('_goalpage_:' + id, { hide: true });
  }
}

export function processRules(rules: PushRule[], externInfos: ExternInfos) {
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
        children: rule?.conditions,
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
  const localKey = Local?.names?.pushruleTrigger + '_' + ruleId;
  const shouldDisplay = !isDefined(localStorage.getItem(localKey));
  currentTimer.counter = null;
  if (shouldDisplay) {
    window.dydu?.ui.toggle(VIEW_MODE.popin);
    window.reword('_pushcondition_:' + ruleId, { hide: true });
    localStorage.setItem(localKey, ruleId);
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
