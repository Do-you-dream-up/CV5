/* eslint-disable */
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useCallback, useEffect, useState } from 'react';
import { Local } from '../storage';
import dydu from '../dydu';
import { _parse, isArray } from '../helpers';

export default function useTopKnowledge() {
  const { configuration } = useConfiguration();
  const [result, setResult] = useState([]);

  const fetch = useCallback(() => {
    const teaserMode = Local.get(Local.names.open) === 1;
    if (teaserMode) return Promise.resolve();
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

const extractPayload = (response) => {
  try {
    const list = _parse(response?.knowledgeArticles);
    return isArray(list) ? list : [list];
  } catch (e) {
    return [];
  }
};
