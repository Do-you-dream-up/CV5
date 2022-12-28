import { useCallback, useEffect, useState } from 'react';

import dydu from '../dydu';

export default function useServerStatus() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    dydu.setServerStatusCheck(fetch);
  }, []);

  useEffect(() => {
    result && dydu.setMainServerStatus(result.status);
  }, [result]);

  const fetch = useCallback(() => {
    return new Promise((resolve) => {
      dydu.getServerStatus().then((res) => {
        setResult(res);
        return resolve(res);
      });
    });
  }, []);

  return {
    fetch,
    result,
  };
}
