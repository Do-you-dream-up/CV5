import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';
import { _parse, b64decode, isArray, isDefined } from '../tools/helpers';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';
import { TUNNEL_MODE } from '../tools/constants';
import { Servlet } from '../../types/servlet';

type ChatResponseArray = Servlet.ChatResponseValues[];

interface TopKnowledgeContextProps {
  isEnabled?: boolean;
  fetchTopKnowledge?: () => void;
  topKnowledge?: ChatResponseArray | null;
  setTopKnowledge?: Dispatch<SetStateAction<ChatResponseArray | null>>;
  extractPayload?: (response) => [];
}

interface TopKnowledgeProviderProps {
  children: ReactElement;
}

export const useTopKnowledge = () => useContext(TopKnowledgeContext);

export const TopKnowledgeContext = createContext<TopKnowledgeContextProps>({});

export function TopKnowledgeProvider({ children }: TopKnowledgeProviderProps) {
  const [topKnowledge, setTopKnowledge] = useState<ChatResponseArray | null>(null);
  const { configuration } = useConfiguration();

  const isEnabled = configuration?.topKnowledge?.enable;

  const fetchTopKnowledge = () => {
    const livechatType = Local.livechatType.load();

    return new Promise((resolve) => {
      if (configuration && (!livechatType || livechatType === TUNNEL_MODE.polling) && isEnabled) {
        dydu
          .top(configuration.topKnowledge?.period, configuration.topKnowledge?.size)
          .then(extractPayload)
          .then((knowledgeList) => {
            setTopKnowledge(knowledgeList);
            return resolve(true);
          });
      }
      return resolve(true);
    });
  };

  const extractPayload = (response) => {
    let list;
    if (response?.values) {
      list = _parse(b64decode(response?.values?.knowledgeArticles));
    } else {
      list = _parse(response?.knowledgeArticles);
    }
    if (isDefined(list)) return isArray(list) ? list : [list];
    return [];
  };

  const props: TopKnowledgeContextProps = {
    isEnabled,
    fetchTopKnowledge,
    topKnowledge,
    setTopKnowledge,
    extractPayload,
  };

  return <TopKnowledgeContext.Provider children={children} value={props} />;
}
