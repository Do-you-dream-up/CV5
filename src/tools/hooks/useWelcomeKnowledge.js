import { useCallback, useMemo, useState } from 'react';
import { isDefined, isEmptyString } from '../helpers';
import dydu from '../dydu';
import { Local } from '../storage';
import { useLivechat } from '../../contexts/LivechatContext';
import { useConfiguration } from '../../contexts/ConfigurationContext';

export default function useWelcomeKnowledge() {
  const [result, setResult] = useState(null);

  const { configuration } = useConfiguration();
  const teaserMode = Local.get(Local.names.open) === 1;
  const { isLivechatOn } = useLivechat();
  const tagWelcome = configuration.welcome?.knowledgeName || null;
  const tagWelcomeNotSet = useMemo(() => !isDefined(tagWelcome) || isEmptyString(tagWelcome), [tagWelcome]);

  const fetch = useCallback(() => {
    const cannotRequest = isDefined(result) || teaserMode || isLivechatOn || tagWelcomeNotSet;
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
  }, [isLivechatOn, result, teaserMode]);

  return {
    result,
    fetch,
  };
}
