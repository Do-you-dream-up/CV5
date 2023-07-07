import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { _parse, isArray, isDefined } from '../tools/helpers';
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
    console.log('Configuration=', configuration);
    const { period, size } = configuration.top;
    const isLivechatOn = Local.isLivechatOn.load();

    return new Promise((resolve) => {
      if (!isLivechatOn) {
        dydu
          .top(period, size)
          .then(extractPayload)
          .then((knowledgeList) => {
            setTopKnowledge(knowledgeList);
            return resolve();
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
