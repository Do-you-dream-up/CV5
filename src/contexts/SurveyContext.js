/* eslint-disable */
import React, { useMemo, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SurveyContext = React.createContext({});

export const useSurvey = () => useContext(SurveyContext);

export default function SurveyContextProvider({ children }) {
  const [configuration, setConfiguration] = useState(null);

  const dataContext = useMemo(() => {
    return {
      setSurveyConfiguration: setConfiguration,
    };
  }, []);

  return <SurveyContext.Provider value={dataContext}>{children}</SurveyContext.Provider>;
}

SurveyContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};
