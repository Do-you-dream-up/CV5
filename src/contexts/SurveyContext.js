/* eslint-disable */
import React, { useMemo, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SurveyContext = React.createContext({});

export const useSurvey = () => useContext(SurveyContext);

export default function SurveyProvider({ children }) {
  const [configuration, setConfiguration] = useState(null);

  const dataContext = useMemo(() => {
    return {
      setSurveyConfiguration: setConfiguration,
      configuration,
    };
  }, []);

  return <SurveyContext.Provider value={dataContext}>{children}</SurveyContext.Provider>;
}

SurveyProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};
