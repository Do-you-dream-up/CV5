import { isDefined, isEmptyArray } from '../tools/helpers';
import {
  createContext,
  MutableRefObject,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import dydu from '../tools/dydu';
import { useLocation } from 'react-use';
import { Local, Session } from '../tools/storage';
import contextPush from '../tools/pushrules/contextPushExt';
import ComplianceInfo from '../tools/pushrules/complianceInfo';
import { useChatboxReady } from './ChatboxReadyContext';
import configuration from '../../public/override/configuration.json';
import { isValidStringOperator, rulesDefinitions } from '../tools/pushrules/rulesDefinition';
import { VIEW_MODE } from '../tools/constants';
import { BOT } from '../tools/bot';

export interface ExternalInfos {
  windowLocation: string;
  language: string;
  referrer: string;
  usedKeywords: string[];
  now: number;
  visitCount: number;
  visitDuration: number;
  pagesViewedCount: number;
  durationSinceLastVisit: number;
  city?: string;
  country?: string;
  numberOfPreviousChat?: number;
}

export interface PushRule {
  conditions?: PushRuleConfiguration[];
  kId?: string;
  bgpId?: number;
}
export interface PushRuleConfiguration {
  type?: string;
  index?: number;
  value?: string;
  operator?: string;
  param_1?: string;
  parent?: PushRulesContainer;
  children?: PushRulesContainer;
  externalId?: string;
}

interface PushRulesTimer {
  counter: any;
  duration?: number;
  ruleId?: string;
}

interface PushRulesContainer {
  rules?: PushRule[];
  parent?: PushRule;
}

interface PushrulesContextProps {
  pushrules?: PushRule[] | null;
  fetch?: () => void;
}

interface PushrulesProviderProps {
  children: ReactElement;
}

const MOVING_ON_WEBSITE_EVENTS = ['mousemove', 'click', 'keyup'];

export const usePushrules = () => useContext(PushrulesContext);

export const PushrulesContext = createContext<PushrulesContextProps>({});

export function PushrulesProvider({ children }: PushrulesProviderProps) {
  const { isChatboxReady } = useChatboxReady();
  const [pushrules, setPushrules] = useState<PushRule[] | null>(null);
  const location = useLocation();
  const [actionsLengthToTriggerUseEffect, setActionsLengthToTriggerUseEffect] = useState<number>(0);

  const actionsToExecute: MutableRefObject<(() => void)[]> = useRef([]);

  const currentTimer: MutableRefObject<PushRulesTimer> = useRef({ counter: null });
  let chatboxNodeElement: HTMLElement | null = null;

  useEffect(() => {
    MOVING_ON_WEBSITE_EVENTS.forEach((event) => {
      document?.addEventListener(event, () => interaction(currentTimer.current.ruleId));
    });

    return () => {
      MOVING_ON_WEBSITE_EVENTS.forEach((event) => {
        document?.removeEventListener(event, () => interaction(currentTimer.current.ruleId));
      });
    };
  }, []);

  useEffect(() => {
    if (!actionsToExecute.current) {
      actionsToExecute.current = [];
      setActionsLengthToTriggerUseEffect(0);
    }

    if (actionsLengthToTriggerUseEffect > 0) {
      if (isChatboxReady) {
        let executedActionsCount = 0;
        while (actionsToExecute.current.length > 0) {
          const action = actionsToExecute.current.shift();
          executedActionsCount++;
          if (action) {
            action();
          }
        }
        setActionsLengthToTriggerUseEffect(actionsLengthToTriggerUseEffect - executedActionsCount);
      }
    }
  }, [isChatboxReady, actionsLengthToTriggerUseEffect]);

  useEffect(() => {
    if (pushrules) {
      const externalInfos: ExternalInfos = initExternalInfos();

      clearCurrentTimeout();
      processRules(pushrules, externalInfos);
    }
  }, [pushrules, location, Local.contextId.load(dydu.getBot().id)]);

  const wrapFunction = (fn: any, params: any[]) => {
    return () => {
      // eslint-disable-next-line prefer-spread
      fn.apply(null, params);
    };
  };

  /**
   * actionsLengthToTriggerUseEffect needs to be renew to trigger useEffect, but actionsLengthToTriggerUseEffect still have length=0 when looping event if setActionQueue has been called
   * @param action
   */
  const addActionsToExecute = (action: () => void) => {
    actionsToExecute.current.push(action);
    setActionsLengthToTriggerUseEffect(actionsToExecute.current.length);
  };

  const canRequest = useMemo(() => {
    return !isDefined(pushrules);
  }, [pushrules]);

  const fetch = useCallback(
    (update = false) => {
      return (
        (canRequest || update) &&
        new Promise<PushRule[] | null>((resolve) => {
          dydu.pushrules().then((data) => {
            const isEmptyPayload = data && Object.keys(data).length <= 0;
            if (isEmptyPayload) return resolve(null);
            try {
              const rules = JSON.parse(data);
              if (isEmptyArray(rules)) return resolve([]);

              setPushrules(rules);
            } catch (e) {
              setPushrules([]);
            }
          });
        })
      );
    },
    [canRequest, pushrules],
  );

  const initExternalInfos = (): ExternalInfos => {
    const now = new Date().getTime();

    let visitCount = contextPush.getGlobalVisitCount();
    const lastPageLoadedTime = contextPush.getLastPageLoadedTime();
    const elapsedTime = now - lastPageLoadedTime;

    // 1 visit = 30mn
    if (elapsedTime > 30 * 60 * 1000) {
      visitCount++;
      contextPush.resetSessionCount(now);
      contextPush.setGlobalVisitCount(visitCount);
    }

    contextPush.setLastPageLoadedTime(now);

    return {
      windowLocation: window.location.href,
      language: navigator.language,
      referrer: document.referrer,
      usedKeywords: contextPush.processKeywords(document.referrer),
      now: now,
      visitCount: visitCount,
      visitDuration: contextPush.getGlobalVisitDuration(now),
      pagesViewedCount: contextPush.getPagesViewedCount(),
      durationSinceLastVisit: contextPush.getDurationSinceLastVisit(),
    };
  };

  const processRules = (rules: PushRule[], externInfos: ExternalInfos) => {
    let bestDelayId: string | undefined;
    let bestIdleDelayId: string | undefined;
    const bestCompliance = new ComplianceInfo();

    for (const rule of rules) {
      const ruleId: string | undefined = rule.kId;

      if (!ruleId) {
        processGoalPage(rule, externInfos);
      } else {
        const conditionsContainer = {
          children: rule?.conditions,
          type: 'Container',
        };
        const ruleCompliance = computeRuleCompliance(conditionsContainer, ruleId, externInfos);

        if (ruleCompliance.hasHigherPriorityThan(bestCompliance)) {
          if (ruleCompliance.isDelayValid()) {
            bestDelayId = ruleId;
            bestIdleDelayId = ruleId;
            bestCompliance.copy(ruleCompliance);
          }
        } else if (ruleCompliance.hasSamePriorityAs(bestCompliance)) {
          if (bestCompliance.mergeDelayIfSmaller(ruleCompliance)) {
            bestDelayId = ruleId;
          }
          if (bestCompliance.mergeIdleDelayIfSmaller(ruleCompliance)) {
            bestIdleDelayId = ruleId;
          }
        }
      }
    }

    // Push best compliant knowledge
    handlePush(bestCompliance.getDelay(), bestDelayId, bestCompliance.getIdleDelay(), bestIdleDelayId);
  };

  const urlCompliant = (pattern: string | undefined, url: string | undefined) => {
    try {
      if (pattern && url && pattern.endsWith('%')) {
        return url.startsWith(pattern.slice(0, -1));
      }
      return pattern === url;
    } catch (e) {
      return false;
    }
  };

  const processGoalPage = (rule: PushRule, externInfos: ExternalInfos) => {
    const goalPageId = rule.bgpId;
    const urlToCheck = rule?.conditions?.[0].param_1;

    if (urlCompliant(urlToCheck, externInfos.windowLocation)) {
      addActionsToExecute(wrapFunction(window.reword, [`_goalpage_:${goalPageId}`, { hide: true }]));
    }
  };

  const processConditionCompliance = (condition: any, ruleId: string, externInfos: ExternalInfos) => {
    let result = new ComplianceInfo();

    rulesDefinitions.forEach((ruleDefinition) => {
      if (condition.type === ruleDefinition.name) {
        result = new ComplianceInfo(ruleDefinition.processDelays(condition, ruleId, externInfos));
      }
    });

    return result;
  };

  const computeConditionCompliance = (
    condition: any,
    ruleId: string,
    externInfos: ExternalInfos,
    childCompliance: ComplianceInfo,
  ) => {
    const conditionCompliance = new ComplianceInfo();

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
  };

  const computeRuleCompliance = (condition: any, ruleId: string, externInfos: ExternalInfos) => {
    const bestChildCompliance = computeChildrenCompliance(condition, ruleId, externInfos);
    return computeConditionCompliance(condition, ruleId, externInfos, bestChildCompliance);
  };

  const computeChildrenCompliance = (condition: any, ruleId: string, externInfos: ExternalInfos) => {
    let bestCompliance = new ComplianceInfo();
    if (condition.children) {
      condition.children.forEach((child: any) => {
        child.parent = condition;
        const childCompliance = computeRuleCompliance(child, ruleId, externInfos);

        if (childCompliance.hasHigherPriorityThan(bestCompliance)) {
          if (childCompliance.isDelayValid()) {
            bestCompliance.copy(childCompliance);
          }
        } else if (childCompliance.hasSamePriorityAs(bestCompliance)) {
          bestCompliance.mergeDelaysForOrCondition(childCompliance);
          if (bestCompliance.complyWithoutDelay()) {
            return;
          }
        }
      });
    } else {
      bestCompliance = new ComplianceInfo({ delay: 0, idleDelay: -1 });
    }
    return bestCompliance;
  };

  const clearCurrentTimeout = () => {
    if (currentTimer.current.counter) {
      clearTimeout(currentTimer.current.counter);
      currentTimer.current.counter = null;
    }
  };

  const getChatboxNodeElement = () => {
    if (!isDefined(chatboxNodeElement)) {
      chatboxNodeElement = document.getElementById(configuration?.root);
    }
    return chatboxNodeElement;
  };

  const pushKnowledge = (ruleId: string | undefined) => {
    if (!ruleId) return;

    const rulesTriggered: string[] = Local.pushRulesTrigger.load(dydu.getBot().id);
    const shouldDisplay = !rulesTriggered.some((value) => value === ruleId);

    currentTimer.current.counter = null;
    if (shouldDisplay) {
      window.dydu?.ui.toggle(VIEW_MODE.popin);
      addActionsToExecute(wrapFunction(window.reword, [`_pushcondition_:${ruleId}`, { hide: true }]));
      Local.pushRulesTrigger.save(dydu.getBot().id, ruleId);
    }
  };

  const handlePush = (
    delay: number,
    delayRuleId: string | undefined,
    idleDelay: number,
    idleDelayRuleId: string | undefined,
  ) => {
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
      if (idleDelay !== -1 && !currentTimer.current.counter) {
        currentTimer.current.counter = setTimeout(() => {
          pushKnowledge(idleDelayRuleId);
        }, idleDelay * 1000);
        currentTimer.current.duration = idleDelay * 1000;
        currentTimer.current.ruleId = idleDelayRuleId;
      }
    }
  };

  const interaction = (ruleId: string | undefined) => {
    if (currentTimer.current.counter) {
      clearTimeout(currentTimer.current.counter);
      currentTimer.current.counter = setTimeout(() => {
        pushKnowledge(ruleId);
      }, currentTimer.current.duration);
      currentTimer.current.ruleId = ruleId;
    }
  };

  const props: PushrulesContextProps = {
    pushrules,
    fetch,
  };

  return <PushrulesContext.Provider value={props}>{children}</PushrulesContext.Provider>;
}
