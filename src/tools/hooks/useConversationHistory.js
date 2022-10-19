import { useCallback, useState } from 'react';

import dydu from '../dydu';
import { isArray } from '../helpers';

export default function useConversationHistory() {
  const [result, setResult] = useState([]);

  const fetch = useCallback(() => {
    return new Promise((resolve) => {
      dydu.history().then((res) => {
        let result = [];
        if (res) {
          const { interactions = [] } = res;
          if (interactions && isArray(interactions)) setResult(interactions);
          return resolve(interactions);
        }
        return resolve(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      });
    });
  }, []);

  return {
    fetch,
    result,
  };
}
