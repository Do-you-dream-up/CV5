import dydu from '../dydu';
import { Local } from '../storage';
import { numberOfDayInMs } from '../helpers';

export default class VisitManager {
  static async refreshRegisterVisit() {
    const infos = await dydu.getInfos();
    const visitKey = Local.visit.getKey(infos);
    const visitFound = Local.visit.isSet(visitKey);
    if (!visitFound) return dydu.registerVisit();

    const dateTimeMsLastVisit = Local.visit.load(visitKey);
    const addOneDayMs = (timeMs) => timeMs + numberOfDayInMs(1);
    const hasCookieVisitExpired = addOneDayMs(dateTimeMsLastVisit) <= Date.now();
    if (hasCookieVisitExpired) return dydu.registerVisit();
  }
}
