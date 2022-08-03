import { useCallback, useState } from 'react';
import dydu from '../dydu';
import { isArray } from '../helpers';

export default function useConversationHistory() {
  const [result, setResult] = useState([]);

  const fetch = useCallback(() => {
    return new Promise((resolve) => {
      dydu.history().then(({ interactions = [] }) => {
        if (isArray(interactions)) setResult(interactions);
        return resolve(interactions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      });
    });
  }, []);

  return {
    fetch,
    result,
  };
}
