import dydu from '../dydu';
import pushService from './pushService';

export default function fetchPushrules() {
    dydu.pushrules().then(data => {
        if (Object.keys(data).length > 0) {
            const rules = JSON.parse('[' + data);
            rules.map(rule => {
                pushService.addRule(rule);
            });
            pushService.processRules(pushService.getExternalInfos(new Date().getTime()));
        }
    });
}
