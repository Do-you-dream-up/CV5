import React, { useMemo, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDialog } from './DialogContext';
import { isDefined } from '../tools/helpers';
import dydu from '../tools/dydu';
import Survey from '../Survey/Survey';

const SurveyContext = React.createContext({});

export const useSurvey = () => useContext(SurveyContext);

const getSurveyConfigurationById = (id) =>
  dydu.getSurvey(id).then((response) => {
    console.log('response ?', response);
    return response;
  });

export default function SurveyProvider({ children }) {
  const { openSecondary, closeSecondary } = useDialog();
  const [configuration, setConfiguration] = useState(null);

  const showSurvey = useCallback((data) => {
    const id = extractId(data);
    getSurveyConfigurationById(id).then(setConfiguration);
  }, []);

  useEffect(() => {
    if (!isDefined(configuration) || !isDefined(openSecondary)) return;
    openSecondary({
      title: configuration?.title,
      bodyRenderer: () => <Survey />,
    });
  }, [configuration, openSecondary]);

  const send = useCallback(
    (surveyResponse) => {
      console.log('surveyResponse', surveyResponse);
      closeSecondary();
    },
    [closeSecondary],
  );

  const updateField = useCallback((id, updates) => {
    console.log('update for field', id, updates);
  }, []);

  const dataContext = useMemo(() => {
    return {
      updateField,
      showSurvey,
      send,
    };
  }, [send, showSurvey, updateField]);

  return <SurveyContext.Provider value={dataContext}>{children}</SurveyContext.Provider>;
}

SurveyProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};

const extractId = (data) => data?.values?.survey?.fromBase64();
