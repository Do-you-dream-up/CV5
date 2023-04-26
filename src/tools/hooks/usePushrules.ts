import { clearCurrentTimeout, getExternalInfos, processRules } from '../pushrules/pushService';
import { isDefined, isEmptyArray } from '../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

import dydu from '../dydu';
import { useLocation } from 'react-use';

const usePushrules = () => {
  const [pushrules, setPushrules] = useState<[] | null>(null);
  const location = useLocation();
  const [ruleType, setRuleType] = useState<string[]>();

  useEffect(() => {
    if (pushrules) {
      clearCurrentTimeout();
      const currentPage = 'CurrentPage' as const;
      if (ruleType && ruleType?.includes(currentPage)) {
        setTimeout(() => {
          processRules(pushrules, getExternalInfos(new Date().getTime()));
        }, 1500);
      } else {
        processRules(pushrules, getExternalInfos(new Date().getTime()));
      }
    }
  }, [pushrules, location, ruleType]);

  const canRequest = useMemo(() => {
    return !isDefined(pushrules);
  }, [pushrules]);

  function extractTypeValues(arr) {
    const typeValues: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      const conditions = arr[i]['conditions'];
      for (let j = 0; j < conditions.length; j++) {
        const typeValue: string = conditions[j]['type'];
        if (typeValue) {
          typeValues.push(typeValue);
        }
      }
    }
    return typeValues;
  }

  const fetch = useCallback(
    (update = false) => {
      return (
        (canRequest || update) &&
        new Promise((resolve) => {
          return dydu.pushrules().then((data) => {
            const isEmptyPayload = data && Object.keys(data).length <= 0;
            if (isEmptyPayload) return resolve(null);
            try {
              const rules = JSON.parse(data);
              if (isEmptyArray(rules)) return resolve([]);

              const ruleTypes = extractTypeValues(rules);
              setRuleType(ruleTypes);

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

  return {
    pushrules,
    fetch,
    ruleType,
  };
};

export default usePushrules;
