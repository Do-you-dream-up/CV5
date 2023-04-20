import { addRule, getExternalInfos, processRules } from '../pushrules/pushService';
import { isDefined, isEmptyArray } from '../helpers';
import { useCallback, useMemo, useState } from 'react';

import dydu from '../dydu';

const usePushrules = () => {
  const [result, setResult] = useState<[] | null>(null);

  const canRequest = useMemo(() => {
    return !isDefined(result);
  }, [result]);

  const fetch = useCallback(() => {
    return (
      canRequest &&
      new Promise((resolve) => {
        return dydu.pushrules().then((data) => {
          const isEmptyPayload = data && Object.keys(data).length <= 0;
          if (isEmptyPayload) return resolve(null);
          try {
            const rules = JSON.parse(data);
            if (isEmptyArray(rules)) return resolve([]);

            rules.map(addRule);
            processRules(getExternalInfos(new Date().getTime()));
            setResult(rules);
          } catch (e) {
            setResult([]);
          }
        });
      })
    );
    // eslint-disable-next-line
  }, [canRequest, result]);

  return {
    result,
    fetch,
  };
};

export default usePushrules;
