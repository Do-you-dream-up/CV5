import { isDefined, isEmptyString } from '../helpers';
import { useCallback, useMemo, useState } from 'react';

import dydu from '../dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useLivechat } from '../../contexts/LivechatContext';

export default function useWelcomeKnowledge() {
  const [result, setResult] = useState(null);

  const { configuration } = useConfiguration();
  const { isLivechatOn } = useLivechat();
  const tagWelcome = configuration.welcome?.knowledgeName || null;

  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);

  const canRequest = useMemo(() => {
    return !isDefined(result) && !isLivechatOn && isTagWelcomeDefined;
  }, [isLivechatOn, result, isTagWelcomeDefined]);

  const fetch = useCallback(() => {
    console.log('🚀 ~ file: useWelcomeKnowledge.js:23 ~ fetch ~ canRequest:', canRequest);
    return !canRequest
      ? Promise.resolve()
      : dydu.getWelcomeKnowledge(tagWelcome).then((wkResponse) => {
          console.log('🚀 ~ file: useWelcomeKnowledge.js:26 ~ :dydu.getWelcomeKnowledge ~ wkResponse:', wkResponse);
          setResult(wkResponse);
          return wkResponse;
        });
    // eslint-disable-next-line
  }, [canRequest, isLivechatOn, result]);

  return {
    result,
    fetch,
  };
}
