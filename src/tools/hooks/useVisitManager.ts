import { useState } from 'react';

import { Local } from '../storage';
import { numberOfDayInMs } from '../helpers';
import dydu from '../dydu';

export default function useVisitManager() {
  const [result, setResult] = useState(false);

  const fetchVisitorRegistration = async (): Promise<any> => {
    const visitFound = Local.visit.isSet();

    if (!visitFound) {
      setResult(true);
      return registerVisit();
    } else {
      setResult(true);
    }

    const dateTimeMsLastVisit: number = Local.visit.load();
    const addOneDayMs = (timeMs: number) => timeMs + numberOfDayInMs(1);
    const hasCookieVisitExpired = addOneDayMs(dateTimeMsLastVisit) <= Date.now();

    if (hasCookieVisitExpired) {
      setResult(true);
      return registerVisit();
    }
    return Promise.resolve();
  };

  const registerVisit = (): Promise<void> => {
    return dydu
      .welcomeCall()
      .then(() => {
        const keyInfos = dydu.getInfos();
        Local.visit.save(keyInfos);
        return Promise.resolve();
      })
      .catch((e) => {
        console.log('Error in registerVisit', e);
        return Promise.resolve();
      });
  };

  return {
    fetchVisitorRegistration,
    result,
  };
}
