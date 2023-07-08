import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';
import { _parse, isArray, isDefined } from '../tools/helpers';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';

type ChatResponseArray = Servlet.ChatResponseValues[];

interface TopKnowledgeContextProps {
  fetch?: () => void;
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

  const fetch = () => {
    const isLivechatOn = Local.isLivechatOn.load();

    return new Promise((resolve) => {
      if (!isLivechatOn && configuration) {
        dydu
          .top(configuration.top?.period, configuration.top?.size)
          .then(extractPayload)
          .then((knowledgeList) => {
            setTopKnowledge(knowledgeList);
            return resolve(true);
          });
      }
    });
  };

  const extractPayload = (response) => {
    let list;
    if (response?.values) {
      list = _parse(atob(response?.values?.knowledgeArticles));
    } else {
      list = _parse(response?.knowledgeArticles);
    }
    if (isDefined(list)) return isArray(list) ? list : [list];
    return [];
  };

  const props: TopKnowledgeContextProps = {
    fetch,
    topKnowledge,
    setTopKnowledge,
    extractPayload,
  };

  return <TopKnowledgeContext.Provider children={children} value={props} />;
}
