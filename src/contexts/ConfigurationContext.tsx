import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import dydu from '../tools/dydu';

interface ConfigurationProviderProps {
  children: ReactNode;
  configuration: any;
}

interface ConfigurationContextProps {
  configuration?: Models.Configuration;
  reset?: any;
  update?: any;
  theme?: Models.Theme;
}

export const useConfiguration = () => {
  return useContext(ConfigurationContext);
};

export const ConfigurationContext = createContext<ConfigurationContextProps>({});

export const ConfigurationProvider = ({ children, configuration: configurationProp }: ConfigurationProviderProps) => {
  const [configuration, setConfiguration] = useState<Models.Configuration>(configurationProp);

  useEffect(() => {
    try {
      dydu.setConfiguration(configurationProp);
    } catch (e) {
      dydu.setSpaceToDefault();
    }
  }, []);

  const reset = useCallback((_configuration) => {
    return new Promise((resolve) => {
      setConfiguration((configuration) => {
        const merge = { ...configuration, ..._configuration };
        resolve(merge); // does this end this function ?
        return merge;
      });
    });
  }, []);

  const update = useCallback((parent, key, value) => {
    return new Promise((resolve) => {
      setConfiguration((configuration) => {
        const merge = {
          ...configuration,
          [parent]: {
            ...configuration[parent],
            [key]: value,
          },
        };
        dydu.setQualificationMode(merge.qualification?.active);
        resolve(merge);
        return merge;
      });
    });
  }, []);

  const contextValue = useMemo<ConfigurationContextProps>(() => {
    return {
      configuration,
      reset,
      update,
    };
  }, [configuration, reset, update]);

  return <ConfigurationContext.Provider value={contextValue}>{children}</ConfigurationContext.Provider>;
};
