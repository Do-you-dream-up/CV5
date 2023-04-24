import { createContext, useCallback, useContext, useState } from 'react';

import dydu from '../tools/dydu';
import { useConfiguration } from './ConfigurationContext';

export interface BotInfoProviderProps {
  children?: any;
}

export interface BotInfoContextProps {
  fetchBotLanguages: any;
  botLanguages: any;
}

export const useBotInfo = () => useContext<BotInfoContextProps>(BotInfoContext);

export const BotInfoContext = createContext({} as BotInfoContextProps);

export const BotInfoProvider = ({ children }: BotInfoProviderProps) => {
  const [botLanguages, setBotLanguages] = useState<any>(null);
  console.log('🚀 ~ file: BotInfoContext.tsx:21 ~ BotInfoProvider ~ botLanguages:', botLanguages);
  const { configuration } = useConfiguration();

  const fetchBotLanguages = useCallback(() => {
    return new Promise(() => {
      dydu
        .getBotLanguages()
        .then((res) => setBotLanguages(res))
        .catch(() => setBotLanguages(configuration?.application?.defaultLanguage));
    });
  }, []);

  const value: BotInfoContextProps = {
    fetchBotLanguages,
    botLanguages,
  };

  return <BotInfoContext.Provider value={value}>{children}</BotInfoContext.Provider>;
};
