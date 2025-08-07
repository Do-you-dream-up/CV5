import { createContext, Dispatch, ReactElement, SetStateAction, useCallback, useContext, useState } from 'react';

import { Local } from '../tools/storage';
import { useEvent } from './EventsContext';
import { useConfiguration } from './ConfigurationContext';
import { VIEW_MODE } from '../tools/constants';
import { useViewMode } from './ViewModeProvider';
import { useUserConsent } from './UserConsentContext';

interface GdprContextProps {
  gdprEnabled?: boolean;
  gdprPassed?: boolean;
  setGdprPassed?: Dispatch<SetStateAction<boolean>>;
  onAccept?: () => void;
  onDecline?: () => void;
}

interface GdprProviderProps {
  children: ReactElement;
}

export const useGdpr = () => useContext(GdprContext);

export const GdprContext = createContext<GdprContextProps>({});

export function GdprProvider({ children }: GdprProviderProps) {
  const { configuration } = useConfiguration();
  const [gdprPassed, setGdprPassed] = useState<boolean>(Local.gdpr.load());
  const { dispatchEvent } = useEvent();
  const { setMode } = useViewMode();
  const { displayUserConsentOptions } = useUserConsent();

  const onAccept = useCallback(() => {
    setGdprPassed(true);
    dispatchEvent && dispatchEvent('gdpr', 'acceptGdpr');
    Local.gdpr.save(true);
  }, [dispatchEvent]);

  const onDecline = useCallback(() => {
    setMode && setMode(VIEW_MODE.minimize);
  }, []);

  return (
    <GdprContext.Provider
      children={children}
      value={{
        gdprEnabled: !!(
          configuration?.gdprDisclaimer &&
          configuration?.gdprDisclaimer?.enable &&
          !configuration?.userConsentDisclaimer?.enable &&
          !displayUserConsentOptions
        ),
        gdprPassed,
        onAccept,
        onDecline,
        setGdprPassed,
      }}
    />
  );
}
