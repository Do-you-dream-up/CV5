import { ReactElement, createContext, useCallback, useState } from 'react';

import { Local } from '../tools/storage';
import { useEvent } from './EventsContext';

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
  const { dispatchEvent } = useEvent();

  const onAccept = useCallback(() => {
    setGdprPassed(true);
    dispatchEvent && dispatchEvent('gdpr', 'acceptGdpr');
    Local.set(Local.names.gdpr, undefined);
  }, [event]);

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
