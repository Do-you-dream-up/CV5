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

  const fetchBotLanguages = (): Promise<any> => {
    return new Promise((resolve) => {
      dydu
        .getBotLanguages()
        .then((botLanguagesFromAtria) => {
          const activatedAndActiveBotLanguages = getActivatedAndActiveBotLanguages(
            configuration,
            botLanguagesFromAtria,
          );
          setBotLanguages(activatedAndActiveBotLanguages);
          dydu.correctLocaleFromBotLanguages(activatedAndActiveBotLanguages);
        })
        .catch(() => {
          setBotLanguages(computeDefaultBotLanguages(configuration));
        })
        .finally(() => resolve(true));
    });
  };

  const value: BotInfoContextProps = {
    fetchBotLanguages,
    botLanguages,
  };

  return <BotInfoContext.Provider value={value}>{children}</BotInfoContext.Provider>;
};

/**
 * Will return all languages present in configuration and currently available in Atria
 * @param configuration the configuration.json content, containing languages that have been allowed for this chatbox
 * @param botLanguagesFromAtria array of all languages currently handled by bot
 */
export function getActivatedAndActiveBotLanguages(configuration: any, botLanguagesFromAtria: any): string[] {
  let result: string[] = [];
  const configurationLanguages = configuration?.application?.languages;
  const defaultLanguage = computeDefaultBotLanguages(configuration);
  if (configurationLanguages && botLanguagesFromAtria) {
    const availableLanguagesCurrentlySet = botLanguagesFromAtria.filter((x) => x.isAvailable === true).map((x) => x.id);
    result = configurationLanguages.filter((x) => availableLanguagesCurrentlySet.indexOf(x) > -1);
  }

  if (result.length === 0) {
    result = defaultLanguage;
  }

  return result.sort();
}

export function computeDefaultBotLanguages(configuration: any): string[] {
  return configuration?.application?.defaultLanguage || 'fr';
}
