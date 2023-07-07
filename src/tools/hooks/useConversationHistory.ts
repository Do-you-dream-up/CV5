import { useCallback, useState } from 'react';

import dydu from '../dydu';

const useConversationHistory = () => {
  const [result, setResult] = useState([]);

  const fetch = useCallback(() => {
    return new Promise((resolve) => {
      dydu.history().then((res) => {
        const interactions = res?.interactions;
        if (interactions) {
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
};

export default useConversationHistory;
