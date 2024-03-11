import { createContext, ReactElement, useContext, useMemo } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';

interface ChatboxReadyContextProps {
  callChatboxReady?: () => void;
}

interface ChatboxReadyProviderProps {
  children?: ReactElement;
}

export const useChatboxReady = () => useContext(ChatboxReadyContext);

const ChatboxReadyContext = createContext<ChatboxReadyContextProps>({});

export default function ChatboxReadyProvider({ children }: ChatboxReadyProviderProps) {
  const callChatboxReady = async () =>
    new Promise((resolve) => {
      const functionChatboxReady = window?.dyduChatboxReady;
      if (isDefined(functionChatboxReady) && isOfTypeFunction(functionChatboxReady())) functionChatboxReady();
      resolve(true);
    });

  const context = useMemo(
    () => ({
      callChatboxReady: callChatboxReady,
    }),
    [callChatboxReady],
  );

  return <ChatboxReadyContext.Provider value={context} children={children} />;
}
