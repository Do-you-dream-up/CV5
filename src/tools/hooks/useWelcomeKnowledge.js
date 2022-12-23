import { isDefined, isEmptyString } from '../helpers';
import { useCallback, useMemo, useState } from 'react';

import dydu from '../dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useLivechat } from '../../contexts/LivechatContext';

const fetchWelcomeKnowledge = dydu.getWelcomeKnowledge;
export default function useWelcomeKnowledge() {
  const [result, setResult] = useState(null);

  const { configuration } = useConfiguration();
  const { isLivechatOn } = useLivechat();
  const tagWelcome = configuration.welcome?.knowledgeName || null;

  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);

  const canRequest = useMemo(() => {
    return isDefined(result) || isLivechatOn || isTagWelcomeDefined;
  }, [isLivechatOn, result, isTagWelcomeDefined]);

  const fetch = useCallback(() => {
    if (!canRequest) return Promise.resolve();

    return fetchWelcomeKnowledge(tagWelcome).then((wkResponse) => {
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
