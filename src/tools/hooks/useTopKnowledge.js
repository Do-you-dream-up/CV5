import { _parse, isArray, isDefined } from '../helpers';
import { useCallback, useState } from 'react';

import dydu from '../dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';

/* eslint-disable */

export default function useTopKnowledge() {
  const { configuration } = useConfiguration();
  const [result, setResult] = useState([]);

  const fetch = useCallback(() => {
    const { period, size } = configuration.top;
    return new Promise((resolve) => {
      dydu
        .top(period, size)
        .then(extractPayload)
        .then((knowledgeList) => {
          setResult(knowledgeList);
          return resolve();
        });
    });
  }, [configuration.top]);

  return {
    fetch,
    result,
  };
}

export const extractPayload = (response) => {
  const list = _parse(response?.knowledgeArticles);
  if (isDefined(list)) return isArray(list) ? list : [list];
  return [];
};
