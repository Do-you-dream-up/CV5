import { ReactElement, createContext, useContext, useState } from 'react';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';

interface ChatStatusContextProps {
  fetchChatStatus: () => Promise<void>;
  inWaitingQueue?: boolean;
}

interface ChatStatusProviderProps {
  children: ReactElement;
}

export const useChatStatus = () => useContext(ChatStatusContext);

export const ChatStatusContext = createContext<ChatStatusContextProps>({} as ChatStatusContextProps);

export function ChatStatusProvider({ children }: ChatStatusProviderProps) {
  const [inWaitingQueue, setInWaitingQueue] = useState(Local.waitingQueue.load());

  const fetchChatStatus = async (): Promise<void> => {
    if (Local.waitingQueue.load() === true) {
      dydu.chatStatus().then((res) => {
        const waitingQueueStatus = res?.waitingQueueStatusResponse;
        if (waitingQueueStatus != undefined) {
          setInWaitingQueue(waitingQueueStatus);
        }
      });
    }
    return Promise.resolve();
  };

  const props: ChatStatusContextProps = {
    inWaitingQueue,
    fetchChatStatus,
  };

  return <ChatStatusContext.Provider children={children} value={props} />;
}
