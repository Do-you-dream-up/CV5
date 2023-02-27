import { addRule, getExternalInfos, processRules } from './pushService';

import dydu from '../dydu';
import { isEmptyArray } from '../helpers';

export default function fetchPushrules() {
  return new Promise((resolve) => {
    return dydu.pushrules().then((data) => {
      const isEmptyPayload = data && Object.keys(data).length <= 0;
      if (isEmptyPayload) return resolve(null);
      try {
        const rules = JSON.parse(data);
        if (isEmptyArray(rules)) return resolve();

        rules.map(addRule);
        processRules(getExternalInfos(new Date().getTime()));
        resolve(rules);
      } catch (e) {
        resolve(null);
      }
    });
  });
}
