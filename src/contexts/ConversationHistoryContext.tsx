import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { TUNNEL_MODE } from '../tools/constants';
import { Servlet } from '../../types/servlet';

type ChatResponseArray = Servlet.ChatResponseValues[];

interface ConversationHistoryContextProps {
  fetch?: () => void;
  history?: ChatResponseArray | null;
  setHistory?: Dispatch<SetStateAction<ChatResponseArray | null>>;
}

interface ConversationHistoryProviderProps {
  children: ReactElement;
}

export const useConversationHistory = () => useContext(ConversationHistoryContext);

export const ConversationHistoryContext = createContext<ConversationHistoryContextProps>({});

export function ConversationHistoryProvider({ children }: ConversationHistoryProviderProps) {
  const [history, setHistory] = useState<ChatResponseArray | null>(null);

  const fetch = async () => {
    const isLivechatOn = Local.isLivechatOn.load();
    const livechatType = Local.livechatType.load();

    if (!isLivechatOn || (isLivechatOn && livechatType === TUNNEL_MODE.polling)) {
      const { interactions } = await dydu.history();
      if (interactions) {
        setHistory(interactions);
      }
      return interactions;
    }
  };

  const props: ConversationHistoryContextProps = {
    fetch,
    history,
    setHistory,
  };

  return <ConversationHistoryContext.Provider children={children} value={props} />;
}
