import { clearCurrentTimeout, getExternalInfos, processRules } from '../pushrules/pushService';
import { isDefined, isEmptyArray } from '../helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

import dydu from '../dydu';
import { useLocation } from 'react-use';

export interface PushRule {
  conditions?: PushRuleConfiguration[];
  kId?: number;
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

interface PushRulesContainer {
  rules?: PushRule[];
  parent?: PushRule;
}
export interface PushRulesResponse {
  pushrules?: PushRule[] | null;
  ruleTypes?: string[] | undefined;
  fetch?: (update?: boolean | undefined) => false | Promise<PushRule[] | null>;
}

const usePushrules = (): PushRulesResponse => {
  const [pushrules, setPushrules] = useState<PushRule[] | null>(null);
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

  return {
    pushrules,
    fetch,
  };
};

export default usePushrules;
