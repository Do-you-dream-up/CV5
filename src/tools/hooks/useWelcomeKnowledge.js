import { isDefined, isEmptyString } from '../helpers';
import { useCallback, useMemo, useState } from 'react';

import dydu from '../dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { Local } from '../storage';

export default function useWelcomeKnowledge() {
  const [result, setResult] = useState(null);

  const { configuration } = useConfiguration();
  const tagWelcome = configuration.welcome?.knowledgeName || null;

  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);

  const canRequest = useMemo(() => {
    return !isDefined(result) && !Local.isLivechatOn.load() && isTagWelcomeDefined;
  }, [Local.isLivechatOn.load(), result, isTagWelcomeDefined]);

  const fetch = useCallback(() => {
    return !canRequest
      ? Promise.resolve()
      : dydu.getWelcomeKnowledge(tagWelcome)?.then((wkResponse) => {
          setResult(wkResponse);
          return wkResponse;
        });
    // eslint-disable-next-line
  }, [canRequest, Local.isLivechatOn.load(), result]);

  return {
    result,
    fetch,
  };
}
