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
  isEnabled?: boolean;
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
  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);

  const isEnabled = configuration?.welcome?.enable;

  const canRequest = () => {
    return !isDefined(welcomeKnowledge) && !Local.livechatType.load() && isTagWelcomeDefined && isEnabled;
  };

  useEffect(() => {
    const currentContextUUID = Local.contextId.load(BOT.id);
    const welcome = Local.welcomeKnowledge.load(BOT.id, currentContextUUID);

    if (!welcome) return setWelcomeKnowledge(null);
    setWelcomeKnowledge(welcome);
  }, [BOT.id]);

  const getWelcomeKnowledge = async (tagWelcome: string) => {
    const currentContextUUID = Local.contextId.load(BOT.id);

    try {
      const welcome = Local.welcomeKnowledge.load(BOT.id, currentContextUUID);

      if (welcome) {
        return Promise.resolve(welcome);
      }

      const talkOption = { hide: true, doNotRegisterInteraction: true };
      const talkResponse: TalkResponseInterface = await dydu.talk(tagWelcome, talkOption);
      const isInteractionResponse = isDefined(talkResponse?.text) && 'text' in talkResponse;

      if (!isInteractionResponse) {
        return null;
      }

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
  }, [canRequest, Local.livechatType.load(), welcomeKnowledge, BOT.id, Local.contextId.load(BOT.id)]);

  const props: WelcomeKnowledgeContextProps = {
    isEnabled,
    welcomeKnowledge,
    setWelcomeKnowledge,
    fetchWelcomeKnowledge,
    getWelcomeKnowledge,
  };

  return <WelcomeKnowledgeContext.Provider value={props}>{children}</WelcomeKnowledgeContext.Provider>;
};
