import { addRule, clearRules, getExternalInfos, processRules } from '../pushrules/pushService';
import { isDefined, isEmptyArray } from '../helpers';
import { useEffect, useMemo, useState } from 'react';

import dydu from '../dydu';
import { useLocation } from 'react-use';

const usePushrules = () => {
  const [pushrules, setPushrules] = useState<[] | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (pushrules) {
      console.log('/*** UPDATE Pushrules ***/');
      fetch(true);
    }
  }, [location]);

  const canRequest = useMemo(() => {
    return !isDefined(pushrules);
  }, [pushrules]);

  const fetch = (update = false) => {
    if (canRequest || update) {
      clearRules();
      new Promise(() => {
        return dydu.pushrules().then((data) => {
          const isEmptyPayload = data && Object.keys(data).length <= 0;
          if (isEmptyPayload) return setPushrules([]);
          try {
            const rules = JSON.parse(data);
            if (isEmptyArray(rules)) return setPushrules([]);
            setPushrules(rules);
            rules.map((rule) => addRule(rule));
            processRules(getExternalInfos(new Date().getTime()));
          } catch (e) {
            setPushrules([]);
          }
        });
      });
    }
  };

  return {
    pushrules,
    fetch,
  };
};

export default usePushrules;
