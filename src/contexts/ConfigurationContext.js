import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import dydu from '../tools/dydu';

export const useConfiguration = () => {
  return useContext(ConfigurationContext);
};

export const ConfigurationContext = React.createContext();

export const ConfigurationProvider = ({ children, configuration: configurationProp }) => {
  const [configuration, setConfiguration] = useState(configurationProp);

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

  const contextValue = useMemo(() => {
    return {
      configuration,
      reset,
      update,
    };
  }, [configuration, reset, update]);

  return <ConfigurationContext.Provider value={contextValue}>{children}</ConfigurationContext.Provider>;
};

ConfigurationProvider.propTypes = {
  children: PropTypes.element,
  configuration: PropTypes.object.isRequired,
};
