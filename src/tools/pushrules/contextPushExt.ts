import bot from '../../../public/override/bot.json';
import qs from 'qs';
import { Local } from '../storage';

interface ContextPushProps {
  getGlobalVisitDuration: (now: number) => number;
  getGlobalVisitCount: () => number;
  setGlobalVisitCount: (count: number) => void;
  getLastVisitTime: (now: number) => number;
  setLastVisitTime: (now: number) => void;
  getLastPageLoadedTime: () => number;
  setLastPageLoadedTime: (now: number) => void;
  getPagesViewedCount: () => number;
  setPagesViewedCount: (value: number) => void;
  resetSessionCount: (now: number) => void;
  getCountry: () => string;
  setCountry: (value: string) => void;
  getCity: () => string;
  setCity: (value: string) => void;
  computeDurationSinceLastVisit: (now: number) => void;
  getDurationSinceLastVisit: () => number;
  setPushData: (space: string, ruleId: string, conditionId: string, value: any) => void;
  getPushData: (space: string, ruleId: string, conditionId: string, defaultValue: string) => string;
  processKeywords: (ref: string) => string[];
}

enum SPACE {
  GLOBAL = 'global',
  SESSION = 'session',
}

const getGlobalVisitDuration = (now: number): number => (now - getLastVisitTime(now)) / 1000;

const getGlobalVisitCount = (): number =>
  parseInt(Local.pushRules.getValueOfRuleCondition(SPACE.GLOBAL, 'visit', 'count', '0'), 10);

const setGlobalVisitCount = (count: number): void =>
  Local.pushRules.setValueOfRuleCondition(SPACE.GLOBAL, 'visit', 'count', count);

const getLastVisitTime = (now: number): number =>
  parseInt(Local.pushRules.getValueOfRuleCondition(SPACE.GLOBAL, 'lastvisit', 'time', `${now}`), 10);

const setLastVisitTime = (now: number): void =>
  Local.pushRules.setValueOfRuleCondition(SPACE.GLOBAL, 'lastvisit', 'time', now);

const getLastPageLoadedTime = (): number =>
  parseInt(Local.pushRules.getValueOfRuleCondition(SPACE.SESSION, 'lastpageloaded', 'time', '-1'), 10);

const setLastPageLoadedTime = (now: number): void =>
  Local.pushRules.setValueOfRuleCondition(SPACE.SESSION, 'lastpageloaded', 'time', now);

const setPagesViewedCount = (value: number): void =>
  Local.pushRules.setValueOfRuleCondition(SPACE.SESSION, 'pagesViewed', 'count', value);

const getCountry = (): string =>
  Local.pushRules.getValueOfRuleCondition(SPACE.SESSION, 'localisation', 'country', 'undefined');

const setCountry = (value: string): void =>
  Local.pushRules.setValueOfRuleCondition(SPACE.SESSION, 'localisation', 'country', value);

const getCity = (): string =>
  Local.pushRules.getValueOfRuleCondition(SPACE.SESSION, 'localisation', 'city', 'undefined');

const setCity = (value: string): void =>
  Local.pushRules.setValueOfRuleCondition(SPACE.SESSION, 'localisation', 'city', value);

const getPagesViewedCount = (): number => {
  const count = parseInt(Local.pushRules.getValueOfRuleCondition(SPACE.SESSION, 'pagesViewed', 'count', '0'), 10) + 1;
  setPagesViewedCount(count);
  return count;
};

const computeDurationSinceLastVisit = (now: number): void => {
  const timeSinceLastVisit = now - getLastVisitTime(now);
  Local.pushRules.setValueOfRuleCondition(SPACE.GLOBAL, 'lastvisit', 'durationsince', timeSinceLastVisit);
};

const getDurationSinceLastVisit = (): number =>
  parseInt(Local.pushRules.getValueOfRuleCondition(SPACE.GLOBAL, 'lastvisit', 'durationsince', '0'), 10) / 1000;

const resetSessionCount = (now: number): void => {
  computeDurationSinceLastVisit(now);
  setLastVisitTime(now);
  setPagesViewedCount(0);
};

const processKeywords = (ref: string): string[] => {
  if (!ref.includes('?')) return [];

  const queryString = ref.substring(ref.indexOf('?') + 1);
  const queryParams = queryString.split('&');

  for (const param of queryParams) {
    const [key, value] = param.split('=');
    if (key === 'q' || key === 'p') {
      return decodeURI(value.replace(/\+/g, ' ')).split(' ');
    }
  }

  return [];
};

const contextPush: ContextPushProps = {
  getGlobalVisitDuration,
  getGlobalVisitCount,
  setGlobalVisitCount,
  getLastVisitTime,
  setLastVisitTime,
  getLastPageLoadedTime,
  setLastPageLoadedTime,
  getPagesViewedCount,
  setPagesViewedCount,
  resetSessionCount,
  getCountry,
  setCountry,
  getCity,
  setCity,
  computeDurationSinceLastVisit,
  getDurationSinceLastVisit,
  setPushData: Local.pushRules.setValueOfRuleCondition,
  getPushData: Local.pushRules.getValueOfRuleCondition,
  processKeywords,
};

export default contextPush;
