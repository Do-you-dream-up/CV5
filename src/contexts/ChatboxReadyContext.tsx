import { createContext, ReactElement, useContext, useMemo, useState } from 'react';
import { isDefined, isOfTypeFunction } from '../tools/helpers';

interface ChatboxReadyContextProps {
  callChatboxReady?: () => void;
  isChatboxReady?: boolean;
}

interface ChatboxReadyProviderProps {
  children?: ReactElement;
}

export const useChatboxReady = () => useContext(ChatboxReadyContext);

const ChatboxReadyContext = createContext<ChatboxReadyContextProps>({});

export default function ChatboxReadyProvider({ children }: ChatboxReadyProviderProps) {
  const [isChatboxReady, setIsChatbxReady] = useState<boolean>(false);

  const callChatboxReady = async () =>
    new Promise((resolve) => {
      const functionChatboxReady = window?.dyduChatboxReady;
      if (isDefined(functionChatboxReady) && isOfTypeFunction(functionChatboxReady())) functionChatboxReady();
      setIsChatbxReady(true);
      resolve(true);
    });

  const context = useMemo(
    () => ({
      callChatboxReady: callChatboxReady,
      isChatboxReady,
    }),
    [callChatboxReady],
  );

  return <ChatboxReadyContext.Provider value={context} children={children} />;
}
