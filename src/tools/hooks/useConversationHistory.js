import { useCallback, useEffect, useState } from 'react';

import dydu from '../dydu';
import { isArray } from '../helpers';

export default function useConversationHistory() {
  const [result, setResult] = useState([]);

  const fetch = useCallback(() => {
    return new Promise((resolve) => {
      dydu.history().then((res) => {
        const { interactions = [] } = res;

        if (interactions && isArray(interactions)) {
          setResult(interactions);
        }
        return resolve(interactions);
      });
    });
  }, []);

  return {
    fetch,
    result,
  };
}
