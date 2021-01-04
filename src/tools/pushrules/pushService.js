import dydu from '../dydu';
import ComplianceInfo from './complianceInfo';
import { ExternalInfoProcessor } from './externalInfoProcessor';
import { INVALID_DELAY, isValidNumericOperator, isValidStringOperator, rulesDefintions } from './rulesDefintion';

const INTERACTION_EVENTS = ['mousemove', 'click', 'keyup'];
const currentTimer = {};
const externalInfoProcessors = [...ExternalInfoProcessor];
const externalInfos = {};
const eventListeners = [];
const pushService = {};
const rules = [];
const rulesDefinition = [...rulesDefintions];

pushService.canPush = true;
pushService.isValidNumericOperator = isValidNumericOperator;
pushService.isValidStringOperator = isValidStringOperator;
pushService.INVALID_DELAY = INVALID_DELAY;

//infoProcessor must be a function that takes externalInfos object as a parameter.
pushService.addExternalInfoProcessor = function(infoProcessor) {
    if (infoProcessor) {
        externalInfoProcessors.push(infoProcessor);
    }
};

//Rule definitions
pushService.addRuleDefinition = function(ruleDefinition) {
    if (ruleDefinition) {
        rulesDefinition.push(ruleDefinition);
    }
};

//Rules from knowledge base
pushService.addRule = function(rule) {
    if (rule) {
        rules.push(rule);
    }
};

pushService.getExternalInfos = function(now) {
    while (externalInfoProcessors.length > 0) {
        let infoProcessor = externalInfoProcessors.pop();
        infoProcessor(externalInfos, now);
    }
    return externalInfos;
};

function processGoalPage(rule, externInfos) {
    const id = rule.bgpId;
    const urlToCheck = rule.conditions[0].param_1;
    if (dydu.getContextId() && dydu.getContextId() !== '' && pushService.urlComplianturlCompliant(urlToCheck, externInfos.windowLocation)) {
        window.reword('_goalpage_:' + id, {hide: true});
    }
}

pushService.processRules = function(externInfos) {
    let bestDelayId;
    let bestIdleDelayId;
    let bestCompliance = new ComplianceInfo();
    for (let cpt = 0; cpt < rules.length; cpt++) {
        let rule = rules[cpt];
        let id = rule.kId;
        if (id === undefined) {
            processGoalPage(rule, externInfos);
        }
        else {
            let conditionsContainer = {'children': rule.conditions, 'type': 'Container'};
            let ruleCompliance = computeRuleCompliance(conditionsContainer, id, externInfos);
            if (ruleCompliance.hasHigherPriorityThan(bestCompliance)) {
                if (ruleCompliance.isDelayValid()) {
                    bestDelayId = id;
                    bestIdleDelayId = id;
                    bestCompliance.copy(ruleCompliance);
                }
            }
            else if (ruleCompliance.hasSamePriorityAs(bestCompliance)) {
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
};

pushService.cleanInactivityListeners = function() {
    for (let j = 0; j < eventListeners.length; j++) {
        for (let i = 0; i < INTERACTION_EVENTS.length; i++) {
            if (document.detachEvent) {
                document.detachEvent('on' + INTERACTION_EVENTS[i], eventListeners[j]);
            }
            else {
                document.removeEventListener(INTERACTION_EVENTS[i], eventListeners[j]);
            }
        }
    }
    eventListeners.length = 0;
    clearTimeout(currentTimer.counter);
    currentTimer.counter = null;
};

function handlePush(delay, delayRuleId, idleDelay, idleDelayRuleId) {
    if (delay !== -1 || idleDelay !== -1) {
        if (delay === 0) {
            pushKnowledge(delayRuleId);
        }
        else if (idleDelay === 0) {
            pushKnowledge(idleDelayRuleId);
        }
        else {
            if (delay !== -1) {
                setTimeout(() => {
                    pushKnowledge(delayRuleId);
                }, delay * 1000);
            }
            if (idleDelay !== -1 && currentTimer.counter) {
                for (let i = 0; i < INTERACTION_EVENTS.length; i++) {
                    if (document.attachEvent) {
                        document.attachEvent('on' + INTERACTION_EVENTS[i], pushService.interaction(idleDelayRuleId));
                    }
                    else {
                        document.addEventListener(INTERACTION_EVENTS[i], pushService.interaction(idleDelayRuleId));
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

pushService.interaction = function(ruleId) {
    if (currentTimer.counter) {
        clearTimeout(currentTimer.counter);
        currentTimer.counter = setTimeout(() => {
            pushKnowledge(ruleId);
        }, currentTimer.duration);
    }
};


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
            }
            else if (childCompliance.hasSamePriorityAs(bestCompliance)) {
                bestCompliance.mergeDelaysForOrCondition(childCompliance);
                if (bestCompliance.complyWithoutDelay()) {
                    //Children rules are compliant.
                    break;
                }
            }
        }
    }
    else {
        bestCompliance = new ComplianceInfo({delay: 0, idleDelay: -1});
    }
    return bestCompliance;
}

function computeConditionCompliance(condition, ruleId, externInfos, childCompliance) {
    let conditionCompliance = new ComplianceInfo();
    // Ignore PastPage type
    if (condition.type === 'PastPage'
        && !(condition.parent.type === 'Container' && condition.children)) {
        conditionCompliance.mergeDelaysForOrCondition(childCompliance);
    }
    else if (childCompliance.isDelayValid()) {
        conditionCompliance.copy(pushService.processConditionCompliance(condition, ruleId, externInfos));
        if (conditionCompliance.isDelayValid()) {
            conditionCompliance.mergeDelaysForAndCondition(childCompliance);
            conditionCompliance.setPriority(childCompliance.getPriority());
        }
    }
    if (conditionCompliance.isDelayValid()) {
        let comparedValue = null;
        if (pushService.isValidStringOperator(condition.operator)) {
            comparedValue = condition.value;
        }
        conditionCompliance.updatePriority(condition.operator === 'Equals' || condition.operator === 'NotEquals', comparedValue);
    }
    return conditionCompliance;
}

pushService.processConditionCompliance = function(condition, ruleId, externInfos) {
    let result = new ComplianceInfo();
    for (let i = 0; i < rulesDefinition.length; i++) {
        let ruleDefinition = rulesDefinition[i];
        if (condition.type === ruleDefinition.name) {
            result = new ComplianceInfo(ruleDefinition.processDelays(condition, ruleId, externInfos));
            break;
        }
    }
    return result;
};

function pushKnowledge(ruleId) {
    if (pushService.canPush) {
        window.reword('_pushcondition_:' + ruleId, {hide: true});
        pushService.canPush = false;
    }
}

pushService.urlCompliant = function(pattern, url) {
    try {
        if (pattern.substring(pattern.length - 1) === '%') {
            return url.substring(0, pattern.length - 1) === pattern.substring(0, pattern.length - 1);
        }
        return pattern === url;
    }
    catch (e) {
        return false;
    }
};

export default pushService;
