import { ReactElement, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { EventsContext } from './EventsContext';
import { Local } from '../tools/storage';

interface GdprContextProps {
  gdprPassed?: boolean | null;
  onAccept?: () => void;
  onDecline?: () => void;
}

interface GdprProviderProps {
  children: ReactElement;
}

export const GdprContext = createContext<GdprContextProps>({});

export function GdprProvider({ children }: GdprProviderProps) {
  const [gdprPassed, setGdprPassed] = useState<boolean | null>(Local.get(Local.names.gdpr, undefined, true));
  const { event, onEvent } = useContext(EventsContext);

  useEffect(() => {
    onEvent && onEvent('gdpr');
  }, [event]);

  const onAccept = useCallback(() => {
    setGdprPassed(true);
    event && event('acceptGdpr');
    Local.set(Local.names.gdpr, undefined);
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
