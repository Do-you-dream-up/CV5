import { useCallback, useState } from 'react';

import { Local } from '../storage';
import dydu from '../dydu';
import { numberOfDayInMs } from '../helpers';

export default function useVisitManager() {
  const [result, setResult] = useState(false);

  const fetch = useCallback(async () => {
    const infos = await dydu.getInfos();
    const visitKey = Local.visit.getKey(infos);
    const visitFound = Local.visit.isSet(visitKey);

    if (!visitFound) {
      setResult(true);
      return dydu.registerVisit();
    } else {
      setResult(true);
    }

    const dateTimeMsLastVisit = Local.visit.load(visitKey);
    const addOneDayMs = (timeMs) => timeMs + numberOfDayInMs(1);
    const hasCookieVisitExpired = addOneDayMs(dateTimeMsLastVisit) <= Date.now();

    if (hasCookieVisitExpired) {
      setResult(true);
      return dydu.registerVisit();
    }
  }, []);

  return {
    fetch,
    result,
  };
}
