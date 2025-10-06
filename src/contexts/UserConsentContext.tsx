import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Local } from '../tools/storage';
import { useConfiguration } from './ConfigurationContext';
import { VIEW_MODE } from '../tools/constants';
import { useViewMode } from './ViewModeProvider';
import dydu from '../tools/dydu';

interface UserConsentContextProps {
  userConsentEnabled?: boolean;
  userConsentPassed?: boolean;
  displayUserConsentOptions?: boolean;
  displayUserConsent?: boolean;
  notEssentialOptions?: Models.UserConsentItem[];
  essentialOptions?: Models.UserConsentItem[];
  setUserConsentPassed?: Dispatch<SetStateAction<boolean>>;
  setDisplayUserConsentOptions?: Dispatch<SetStateAction<boolean>>;
  setDisplayUserConsent?: Dispatch<SetStateAction<boolean>>;
  onAccept?: (acceptAll: boolean) => void;
  onDecline?: () => void;
  onDisplayUserConsent?: () => void;
  onChooseOptions?: () => void;
  setBotUserConsents?: Dispatch<SetStateAction<any[] | undefined>>;
  botUserConsents?: any[] | undefined;
  userConsentForCurrentLanguage?: any;
  setUserConsentForCurrentLanguage?: Dispatch<SetStateAction<any>>;
}

interface UserConsentProviderProps {
  children: ReactElement;
}

export const useUserConsent = () => useContext(UserConsentContext);
export const UserConsentContext = createContext<UserConsentContextProps>({});

export function UserConsentProvider({ children }: UserConsentProviderProps) {
  const { configuration } = useConfiguration();
  const [userConsentPassed, setUserConsentPassed] = useState<boolean>(Local.userConsentOptions.load());
  const [displayUserConsentOptions, setDisplayUserConsentOptions] = useState<boolean>(false);
  const { setMode } = useViewMode();
  const [botUserConsents, setBotUserConsents] = useState<any[] | undefined>();
  const [userConsentForCurrentLanguage, setUserConsentForCurrentLanguage] = useState<any>();
  const [displayUserConsent, setDisplayUserConsent] = useState<boolean>(false);

  const essentialOptions: Models.UserConsentItem[] = userConsentForCurrentLanguage?.chooseOption?.essential?.items;

  const notEssentialOptions: Models.UserConsentItem[] =
    userConsentForCurrentLanguage?.chooseOption?.notEssential?.items;

  const currentLanguage = Local.locale.load() ? Local.locale.load() : dydu.getLocale();

  useEffect(() => {
    if (botUserConsents && currentLanguage) {
      setUserConsentForCurrentLanguage(botUserConsents?.find((x) => x.language === currentLanguage)?.content);
    }
  }, [botUserConsents, currentLanguage]);

  const onAccept = (acceptAll: boolean) => {
    if (acceptAll) {
      const initialEssential = {};
      essentialOptions?.forEach((item) => {
        initialEssential[item.key] = true;
      });
      notEssentialOptions?.forEach((item) => {
        initialEssential[item.key] = true;
      });
      Local.userConsentOptions.save(initialEssential);
    }
    setDisplayUserConsentOptions(false);
    setDisplayUserConsent(false);
    setUserConsentPassed(true);
  };

  const onChooseOptions = () => {
    setDisplayUserConsentOptions(true);
  };

  const onDisplayUserConsent = () => {
    setDisplayUserConsent(true);
  };

  const onDecline = useCallback(() => {
    Local.userConsentOptions.reset();
    setMode && setMode(VIEW_MODE.minimize);
  }, []);

  return (
    <UserConsentContext.Provider
      children={children}
      value={{
        userConsentEnabled: !!(configuration?.userConsentDisclaimer && configuration?.userConsentDisclaimer?.enable),
        displayUserConsent,
        userConsentPassed,
        displayUserConsentOptions,
        onAccept,
        onDecline,
        onChooseOptions,
        setUserConsentPassed,
        setBotUserConsents,
        botUserConsents,
        userConsentForCurrentLanguage,
        onDisplayUserConsent,
        notEssentialOptions,
        essentialOptions,
        setDisplayUserConsentOptions,
        setDisplayUserConsent,
        setUserConsentForCurrentLanguage,
      }}
    />
  );
}
