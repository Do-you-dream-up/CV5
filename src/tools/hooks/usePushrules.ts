import { clearCurrentTimeout, getExternalInfos, processRules } from '../pushrules/pushService';
import { isDefined, isEmptyArray } from '../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

import dydu from '../dydu';
import { useLocation } from 'react-use';

const usePushrules = () => {
  const [pushrules, setPushrules] = useState<[] | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (pushrules) {
      clearCurrentTimeout();
      processRules(pushrules, getExternalInfos(new Date().getTime()));
    }
  }, [pushrules, location]);

  const canRequest = useMemo(() => {
    return !isDefined(pushrules);
  }, [pushrules]);

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
  };
};

export default usePushrules;
