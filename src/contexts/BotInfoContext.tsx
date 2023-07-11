import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Local } from '../tools/storage';
import dydu from '../tools/dydu';
import { initI18N } from '../tools/internationalization';
import { useConfiguration } from './ConfigurationContext';

export interface BotInfoProviderProps {
  children?: any;
}

export interface BotInfoContextProps {
  fetchBotLanguages: () => void;
  botLanguages: string[] | null;
  currentLanguage: string;
  setCurrentLanguage: Dispatch<SetStateAction<string>>;
}

export const useBotInfo = () => useContext<BotInfoContextProps>(BotInfoContext);

export const BotInfoContext = createContext({} as BotInfoContextProps);

export const BotInfoProvider = ({ children }: BotInfoProviderProps) => {
  const { configuration } = useConfiguration();
  const [botLanguages, setBotLanguages] = useState<string[] | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    Local.get(Local.names.locale, configuration?.application?.defaultLanguage[0]),
  );

  initI18N();

  useEffect(() => {
    botLanguages && dydu.setBotLanguages(botLanguages);
  }, [botLanguages]);

  useEffect(() => {
    dydu.setLocale(currentLanguage);
    Local.set(Local.names.locale, currentLanguage);
  }, [currentLanguage]);

  const fetchBotLanguages = useCallback(() => {
    return new Promise(() => {
      dydu
        .getBotLanguages()
        .then((res) => setBotLanguages(res.filter((lang) => lang.isAvailable).map((lang) => lang.id)))
        .catch(() => setBotLanguages(configuration?.application?.defaultLanguage || ['fr']));
    });
  }, []);

  const value: BotInfoContextProps = {
    fetchBotLanguages,
    botLanguages,
    currentLanguage,
    setCurrentLanguage,
  };

  return <BotInfoContext.Provider value={value}>{children}</BotInfoContext.Provider>;
};
