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

  const tagWelcomeNotSet = useMemo(() => !isDefined(tagWelcome) || isEmptyString(tagWelcome), [tagWelcome]);

  const canRequest = useMemo(() => {
    return isDefined(result) || isLivechatOn || !tagWelcomeNotSet;
  }, [isLivechatOn, result, tagWelcomeNotSet]);

  const fetch = useCallback(() => {
    const cannotRequest = !canRequest;
    if (cannotRequest) return Promise.resolve();

    return new Promise((resolve) => {
      dydu.talk(tagWelcome, { doNotSave: true, hide: true }).then((response) => {
        const isInteractionObject = (r) => {
          return isDefined(r?.text) && 'text' in r;
        };
        if (isInteractionObject(response)) {
          setResult(response);
        }
        resolve();
      });
    });
    // eslint-disable-next-line
  }, [canRequest, isLivechatOn, result]);

  return {
    result,
    fetch,
  };
}
