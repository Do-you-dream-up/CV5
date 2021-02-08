import qs from 'qs';
import bot from '../../../public/override/bot';
import { Cookie } from '../storage';

const BOT = Object.assign({}, bot, (({bot: id }) => ({
    ...id && { id }
  }))(qs.parse(window.location.search, { ignoreQueryPrefix: true })));

const contextPush = {};
contextPush.getGlobalVisitDuration = getGlobalVisitDuration;
contextPush.getGlobalVisitCount = getGlobalVisitCount;
contextPush.setGlobalVisitCount = setGlobalVisitCount;
contextPush.getLastVisitTime = getLastVisitTime;
contextPush.setLastVisitTime = setLastVisitTime;
contextPush.getLastPageLoadedTime = getLastPageLoadedTime;
contextPush.setLastPageLoadedTime = setLastPageLoadedTime;
contextPush.getPagesViewedCount = getPagesViewedCount;
contextPush.setPagesViewedCount = setPagesViewedCount;
contextPush.resetSessionCount = resetSessionCount;
contextPush.getCountry = getCountry;
contextPush.setCountry = setCountry;
contextPush.getCity = getCity;
contextPush.setCity = setCity;
contextPush.computeDurationSinceLastVisit = computeDurationSinceLastVisit;
contextPush.getDurationSinceLastVisit = getDurationSinceLastVisit;
contextPush.setPushData = writeCookie;
contextPush.getPushData = readCookieValue;
contextPush.processKeywords = processKeywords;

function getGlobalVisitDuration(now) {
    return (now - getLastVisitTime(now)) / 1000;
}

function getGlobalVisitCount() {
    return parseInt(readCookieValue('visit', 'count', 0, 'global'));
}

function setGlobalVisitCount(count) {
    //Keep for 60days..
    writeCookie('visit', 'count', count, 'global', 60);
}

function getLastVisitTime(now) {
    return parseInt(readCookieValue('lastvisit', 'time', now, 'global'));
}

function setLastVisitTime(now) {
    writeCookie('lastvisit', 'time', now, 'global', 60);
}

function getLastPageLoadedTime() {
    return parseInt(readCookieValue('lastpageloaded', 'time', -1, 'session'));
}

function setLastPageLoadedTime(now) {
    writeCookie('lastpageloaded', 'time', now, 'session');
}


function setPagesViewedCount(value) {
    writeCookie('pagesViewed', 'count', value, 'session');
}

function getCountry() {
    return readCookieValue('localisation', 'country', 'undefined', 'session');
}

function setCountry(value) {
    writeCookie('localisation', 'country', value, 'session');
}

function getCity() {
    return readCookieValue('localisation', 'city', 'undefined', 'session');
}

function setCity(value) {
    writeCookie('localisation', 'city', value, 'session');
}

function getPagesViewedCount() {
    //Should be used after getGlobalVisitCount
    //Should be used only once par page loaded...
    var count = parseInt(readCookieValue('pagesViewed', 'count', 0, 'session')) + 1;
    setPagesViewedCount(count);
    return count;
}

function computeDurationSinceLastVisit(now) {
    var timeSinceLastVisit = now - getLastVisitTime(now);
    writeCookie('lastvisit', 'durationsince', timeSinceLastVisit, 'global', 60);
}

function getDurationSinceLastVisit() {
    return parseInt(readCookieValue('lastvisit', 'durationsince', 0, 'global')) / 1000;
}

function resetSessionCount(now) {
    computeDurationSinceLastVisit(now);
    setLastVisitTime(now);
    setPagesViewedCount(0);
}

function readCookie(space) {
    var c = Cookie.get('DYDU_PUSH_' + space + BOT.id);
    if (typeof c === 'undefined' || c === null || c === '') {
        c = {};
    }
    return c;
}

function readCookieValue(ruleId, conditionId, defaultValue, space) {
    space = space || '';
    var c = readCookie(space);
    var t = c['r_' + ruleId];
    if (typeof (t) === 'undefined' || t === null) {
        return defaultValue;
    }
    else {
        t = t[conditionId];
        if (typeof t === 'undefined' || t === null) {
            return defaultValue;
        }
        else {
            return t;
        }
    }
}

function writeCookie(ruleId, conditionId, value, space) {
    space = space || '';
    var c = readCookie(space);
    var t = c['r_' + ruleId] || {};
    t[conditionId] = value;
    c['r_' + ruleId] = t;
    Cookie.set('DYDU_PUSH_' + space + BOT.id, c);
}

// Not working with google !
function processKeywords(ref) {
    if (ref.indexOf('?') === -1) {
        return [];
    }
    var qs = ref.substr(ref.indexOf('?') + 1);
    var qsa = qs.split('&');
    for (var i = 0; i < qsa.length; i++) {
        var qsip = qsa[i].split('=');
        if (qsip.length === 1) {
            continue;
        }
        if (qsip[0] === 'q' || qsip[0] === 'p') { // q= for Google, p= for Yahoo
            var wordstring = unescape(qsip[1].replace(/\+/g, ' '));
            return wordstring.split(' ');
        }
    }
    return [];
}


export default contextPush;
