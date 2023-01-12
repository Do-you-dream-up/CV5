import { isDefined, isEmptyString } from '../helpers';
import { useMemo, useState } from 'react';

import dydu from '../dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useLivechat } from '../../contexts/LivechatContext';

const useWelcomeKnowledge = () => {
  const { configuration } = useConfiguration();
  const { isLivechatOn } = useLivechat();

  const [result, setResult] = useState(null);

  const tagWelcome = configuration.welcome?.knowledgeName || null;

  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);

  const canRequest = useMemo(() => {
    if (isDefined(result)) {
      return false;
    }
    return isLivechatOn || isTagWelcomeDefined;
  }, [isLivechatOn, result, isTagWelcomeDefined]);

  const fetch = () => {
    if (canRequest) {
      return new Promise((resolve) => {
        dydu.getWelcomeKnowledge(tagWelcome).then((response) => {
          setResult(response);
          return resolve();
        });
      });
    }
  };

  return {
    result,
    fetch,
  };
};

export default useWelcomeKnowledge;
