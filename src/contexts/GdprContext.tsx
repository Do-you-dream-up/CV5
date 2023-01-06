import { createContext, useCallback, useContext, useState } from 'react';

import { EventsContext } from './EventsContext';
import { Local } from '../tools/storage';

interface GdprContextProps {
  isChatboxLoadedAndReady?: boolean;
  hasAfterLoadBeenCalled?: boolean;
  onAppReady?: () => void;
  onChatboxLoaded?: (chatboxNodeElement: any) => void;
  onNewMessage?: () => void;
  onEvent?: (feature: any) => (event: any, ...rest: any[]) => void;
  event?: string | null;
  getChatboxRef?: () => void;
}

interface GdprContextProps {
  children: ReactElement;
}

export const GdprContext = createContext<GdprContextProps>({});

export function GdprProvider({ children }: GdprContextProps) {
  const [gdprPassed, setGdprPassed] = useState(Local.get(Local.names.gdpr));
  const event = useContext(EventsContext).onEvent('gdpr');
  const onAccept = useCallback(() => {
    setGdprPassed(true);
    event('acceptGdpr');
    Local.set(Local.names.gdpr, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDecline = useCallback(() => {
    window.dydu.ui.toggle(1);
  }, []);

  return (
    <GdprContext.Provider
      children={children}
      value={{
        gdprPassed,
        onAccept,
        onDecline,
      }}
    />
  );
}
