import { Dispatch, SetStateAction, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { isDefined, isEmptyString } from '../tools/helpers';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';

type WelcomeKnowledge = Servlet.ChatResponseValues | null;

export interface WelcomeKnowledgeProviderProps {
  children?: any;
}

export interface WelcomeKnowledgeContextProps {
  welcomeKnowledge: WelcomeKnowledge;
  setWelcomeKnowledge: Dispatch<SetStateAction<WelcomeKnowledge>>;
  fetchWelcomeKnowledge: () => void;
}

export const useWelcomeKnowledge = () => useContext<WelcomeKnowledgeContextProps>(WelcomeKnowledgeContext);

export const WelcomeKnowledgeContext = createContext({} as WelcomeKnowledgeContextProps);

export const WelcomeKnowledgeProvider = ({ children }: WelcomeKnowledgeProviderProps) => {
  const [welcomeKnowledge, setWelcomeKnowledge] = useState<WelcomeKnowledge>(null);

  const { configuration } = useConfiguration();
  const tagWelcome = configuration?.welcome?.knowledgeName || null;

  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);

  const canRequest = useMemo(() => {
    return !isDefined(welcomeKnowledge) && !Local.isLivechatOn.load() && isTagWelcomeDefined;
  }, [Local.isLivechatOn.load(), welcomeKnowledge, isTagWelcomeDefined]);

  const fetchWelcomeKnowledge = useCallback(() => {
    setWelcomeKnowledge(null);
    return !canRequest
      ? Promise.resolve()
      : dydu.getWelcomeKnowledge(tagWelcome)?.then((wkResponse) => {
          setWelcomeKnowledge(wkResponse);
          return wkResponse;
        });
    // eslint-disable-next-line
  }, [canRequest, Local.isLivechatOn.load(), welcomeKnowledge]);

  const props: WelcomeKnowledgeContextProps = {
    welcomeKnowledge,
    setWelcomeKnowledge,
    fetchWelcomeKnowledge,
  };

  return <WelcomeKnowledgeContext.Provider value={props}>{children}</WelcomeKnowledgeContext.Provider>;
};
