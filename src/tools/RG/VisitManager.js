import { Local } from '../storage';
import dydu from '../dydu';
import { numberOfDayInMs } from '../helpers';

export default class VisitManager {
  static async refreshRegisterVisit() {
    const visitKey = Local.visit.getKey();
    const visitFound = Local.visit.isSet(visitKey);
    if (!visitFound) return dydu.registerVisit();

    const dateTimeMsLastVisit = Local.visit.load(visitKey);
    const addOneDayMs = (timeMs) => timeMs + numberOfDayInMs(1);
    const hasCookieVisitExpired = addOneDayMs(dateTimeMsLastVisit) <= Date.now();
    if (hasCookieVisitExpired) return dydu.registerVisit();
  }
}
