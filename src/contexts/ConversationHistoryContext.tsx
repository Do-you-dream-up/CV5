import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from 'react';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { TUNNEL_MODE } from '../tools/constants';
import { Servlet } from '../../types/servlet';

interface ConversationHistoryContextProps {
  fetch?: () => any;
  history?: Servlet.ChatHistoryInteraction[] | null;
  setHistory?: Dispatch<SetStateAction<Servlet.ChatHistoryResponse | null>>;
}

interface ConversationHistoryProviderProps {
  children: ReactElement;
}

export const useConversationHistory = () => useContext(ConversationHistoryContext);

export const ConversationHistoryContext = createContext<ConversationHistoryContextProps>({});

export function ConversationHistoryProvider({ children }: ConversationHistoryProviderProps) {
  const [history, setHistory] = useState<Servlet.ChatHistoryInteraction[] | null>(null);

  const fetch = () => {
    const livechatType = Local.livechatType.load();

    return new Promise((resolve) => {
      if (!livechatType || livechatType === TUNNEL_MODE.polling) {
        dydu.history().then((res: Servlet.ChatHistoryResponse) => {
          const interactionsFromHistory: Servlet.ChatHistoryInteraction[] | undefined = res?.interactions;
          if (interactionsFromHistory) {
            if (livechatType === TUNNEL_MODE.polling) {
              for (const interactionFromHistory of interactionsFromHistory) {
                if (!interactionFromHistory.pollUpdatedInteractionDate) {
                  interactionFromHistory.pollUpdatedInteractionDate = interactionFromHistory.timestamp;
                }
              }
            }
            setHistory(interactionsFromHistory);
          }
          return resolve(interactionsFromHistory);
        });
      }
    });
  };

  const props: ConversationHistoryContextProps = {
    fetch,
    history,
    setHistory,
  };

  return <ConversationHistoryContext.Provider children={children} value={props} />;
}
