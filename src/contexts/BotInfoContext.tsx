import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';

export interface BotInfoProviderProps {
  children?: any;
}

export interface BotInfoContextProps {
  fetchBotLanguages: () => void;
  botLanguages: string[] | null;
}

export const useBotInfo = () => useContext<BotInfoContextProps>(BotInfoContext);

export const BotInfoContext = createContext({} as BotInfoContextProps);

export const BotInfoProvider = ({ children }: BotInfoProviderProps) => {
  const { configuration } = useConfiguration();
  const [botLanguages, setBotLanguages] = useState<string[] | null>(null);

  useEffect(() => {
    botLanguages && dydu.setBotLanguages(botLanguages);
  }, [botLanguages]);

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
  };

  return <BotInfoContext.Provider value={value}>{children}</BotInfoContext.Provider>;
};
