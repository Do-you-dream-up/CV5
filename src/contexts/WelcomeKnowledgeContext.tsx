import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isDefined, isEmptyString } from '../tools/helpers';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';
import { BOT } from '../tools/bot';

type WelcomeKnowledge = Servlet.ChatResponseValues | null;

export interface WelcomeKnowledgeProviderProps {
  children?: any;
}

export interface TalkResponseInterface {
  contextId: string;
  actionId: number;
  askFeedback: boolean;
  botId: string;
  enableAutoSuggestions: boolean;
  hasProfilePicture: boolean;
  human: boolean;
  keepPopinMinimized: boolean;
  knowledgeId: number;
  language: string;
  serverTime: number;
  startLivechat: boolean;
  text: string;
  typeResponse: string;
}

export interface WelcomeKnowledgeContextProps {
  welcomeKnowledge: WelcomeKnowledge;
  setWelcomeKnowledge: Dispatch<SetStateAction<WelcomeKnowledge>>;
  fetchWelcomeKnowledge: () => void;
  getWelcomeKnowledge: (tagWelcome: string) => Promise<WelcomeKnowledge>;
}

export const WelcomeKnowledgeContext = createContext({} as WelcomeKnowledgeContextProps);
export const useWelcomeKnowledge = () => useContext<WelcomeKnowledgeContextProps>(WelcomeKnowledgeContext);

export const WelcomeKnowledgeProvider = ({ children }: WelcomeKnowledgeProviderProps) => {
  const { configuration } = useConfiguration();
  const [welcomeKnowledge, setWelcomeKnowledge] = useState<WelcomeKnowledge>(null);
  const tagWelcome = configuration?.welcome?.knowledgeName || null;
  const actualContextId = localStorage.getItem('dydu.context');
  const isContextIdInWelcomeIsSameAsDyduContext = Local.welcomeKnowledge.isSetWithActualContextIdFromLocal(
    BOT.id,
    actualContextId,
  );
  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);

  const canRequest = useMemo(() => {
    return !isDefined(welcomeKnowledge) && !Local.isLivechatOn.load() && isTagWelcomeDefined;
  }, [Local.isLivechatOn.load(), welcomeKnowledge, isTagWelcomeDefined]);

  useEffect(() => {
    if (!isContextIdInWelcomeIsSameAsDyduContext) return setWelcomeKnowledge(null);
    setWelcomeKnowledge(Local.welcomeKnowledge.load(BOT.id));
  }, [BOT.id]);

  const getWelcomeKnowledge = async (tagWelcome: string) => {
    try {
      const wkFoundInStorage: boolean = Local.welcomeKnowledge.isSet(BOT.id);
      if (wkFoundInStorage && isContextIdInWelcomeIsSameAsDyduContext)
        return Promise.resolve(Local.welcomeKnowledge.load(BOT.id));
      const talkOption = { hide: true, doNotRegisterInteraction: true };
      const talkResponse: TalkResponseInterface = await dydu.talk(tagWelcome, talkOption);
      const isInteractionResponse = isDefined(talkResponse?.text) && 'text' in talkResponse;
      if (!isInteractionResponse) return null;
      Local.welcomeKnowledge.save(BOT.id, talkResponse);
      return talkResponse;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWelcomeKnowledge = useCallback(() => {
    return !canRequest
      ? Promise.resolve()
      : tagWelcome &&
          getWelcomeKnowledge(tagWelcome)?.then((wkResponse) => {
            wkResponse && setWelcomeKnowledge(wkResponse);
            return wkResponse;
          });
    // eslint-disable-next-line
  }, [canRequest, Local.isLivechatOn.load(), welcomeKnowledge, BOT.id, dydu.contextId]);

  const props: WelcomeKnowledgeContextProps = {
    welcomeKnowledge,
    setWelcomeKnowledge,
    fetchWelcomeKnowledge,
    getWelcomeKnowledge,
  };

  return <WelcomeKnowledgeContext.Provider value={props}>{children}</WelcomeKnowledgeContext.Provider>;
};
