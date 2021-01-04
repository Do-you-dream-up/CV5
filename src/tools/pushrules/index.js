import dydu from '../dydu';
import { addRule, getExternalInfos, processRules } from './pushService';

export default function fetchPushrules() {
    dydu.pushrules().then(data => {
        if (Object.keys(data).length > 0) {
            const rules = JSON.parse('[' + data);
            rules.map(rule => {
                addRule(rule);
            });
            processRules(getExternalInfos(new Date().getTime()));
        }
    });
}
