import { Dispatch, SetStateAction, createContext, useContext, useMemo, useState } from 'react';
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
  isContextStillAvailable: Promise<boolean>;
}

export interface WelcomeKnowledgeContextProps {
  isEnabled?: boolean;
  welcomeKnowledge: WelcomeKnowledge;
  setWelcomeKnowledge: Dispatch<SetStateAction<WelcomeKnowledge>>;
  fetchWelcomeKnowledge: () => Promise<void>;
  verifyAvailabilityDialogContext: () => Promise<boolean>;
}

export const WelcomeKnowledgeContext = createContext({} as WelcomeKnowledgeContextProps);
export const useWelcomeKnowledge = () => useContext<WelcomeKnowledgeContextProps>(WelcomeKnowledgeContext);

export const WelcomeKnowledgeProvider = ({ children }: WelcomeKnowledgeProviderProps) => {
  const { configuration } = useConfiguration();
  const [welcomeKnowledge, setWelcomeKnowledge] = useState<WelcomeKnowledge>(null);
  const tagWelcome = configuration?.welcome?.knowledgeName;
  const isTagWelcomeDefined = useMemo(() => isDefined(tagWelcome) || !isEmptyString(tagWelcome), [tagWelcome]);
  const isEnabled = configuration?.welcome?.enable;

  const mustFetchWelcome = (): boolean => {
    const currentContextUUID = Local.contextId.load(BOT.id);
    return (
      (!currentContextUUID || !Local.welcomeKnowledge.load(BOT.id, currentContextUUID)) &&
      !Local.livechatType.load() &&
      isTagWelcomeDefined &&
      isEnabled
    );
  };

  const verifyAvailabilityDialogContext = async (): Promise<boolean> => {
    const currentContextUUID = Local.contextId.load(BOT.id);
    return dydu.checkContextIdStillAvailable().then(async (response): Promise<boolean> => {
      if (!response) {
        Local.livechatType.remove();
        Local.space.remove();
        Local.lastInteraction.reset();
        Local.welcomeKnowledge.reset(BOT.id, currentContextUUID);
        Local.contextId.reset(BOT.id);
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    });
  };

  const fetchWelcomeKnowledge = async (): Promise<any> => {
    const currentContextUUID = Local.contextId.load(BOT.id);

    if (mustFetchWelcome()) {
      const talkOption = { hide: true, doNotRegisterInteraction: true };
      const talkResponse: TalkResponseInterface = await dydu.talk(tagWelcome, talkOption);
      const isInteractionResponse = isDefined(talkResponse?.text) && 'text' in talkResponse;

      if (!isInteractionResponse) {
        return Promise.resolve();
      }
      setWelcomeKnowledge(talkResponse);
      Local.welcomeKnowledge.save(BOT.id, talkResponse);
      return Promise.resolve(talkResponse);
    }

    const welcome = Local.welcomeKnowledge.load(BOT.id, currentContextUUID);
    if (welcome) {
      setWelcomeKnowledge(welcome);
      return Promise.resolve(welcome);
    }
    return Promise.resolve();
  };

  const props: WelcomeKnowledgeContextProps = {
    isEnabled,
    welcomeKnowledge,
    setWelcomeKnowledge,
    fetchWelcomeKnowledge,
    verifyAvailabilityDialogContext,
  };

  return <WelcomeKnowledgeContext.Provider value={props}>{children}</WelcomeKnowledgeContext.Provider>;
};
