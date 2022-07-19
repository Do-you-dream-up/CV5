import { addRule, getExternalInfos, processRules } from './pushService';

import dydu from '../dydu';

export default function fetchPushrules() {
  dydu.pushrules().then((data) => {
    if (Object.keys(data).length > 0) {
      window.dydu.ui.toggle(2);
      const rules = JSON.parse(data);
      rules.map((rule) => {
        addRule(rule);
      });
      processRules(getExternalInfos(new Date().getTime()));
    }
  });
}
