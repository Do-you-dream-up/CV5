import { Dispatch, ReactElement, SetStateAction, createContext, useCallback, useState } from 'react';

import { Local } from '../tools/storage';
import { useEvent } from './EventsContext';

interface CookiesContextProps {
  cookiesPassed?: boolean | null;
  setCookiesPassed?: Dispatch<SetStateAction<boolean | null>>;
  onAccept?: () => void;
  onDecline?: () => void;
}

interface CookiesProviderProps {
  children: ReactElement;
}

export const CookiesContext = createContext<CookiesContextProps>({});

export function CookiesProvider({ children }: CookiesProviderProps) {
  const [cookiesPassed, setCookiesPassed] = useState<boolean | null>(Local.cookies.load());
  const { dispatchEvent } = useEvent();

  const onAccept = useCallback(() => {
    setCookiesPassed(true);
    dispatchEvent && dispatchEvent('cookies', 'acceptCookies');
    Local.cookies.save(true);
  }, [dispatchEvent]);

  return (
    <CookiesContext.Provider
      children={children}
      value={{
        cookiesPassed,
        onAccept,
        setCookiesPassed,
      }}
    />
  );
}
