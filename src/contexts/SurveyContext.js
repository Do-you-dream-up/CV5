/* eslint-disable */
import React, { useMemo, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDialog } from './DialogContext';
import { isDefined, isEmptyString } from '../tools/helpers';
import Form from '@rjsf/core';
import { LOREM_HTML } from '../tools/lorem';

const SurveyContext = React.createContext({});

export const useSurvey = () => useContext(SurveyContext);

const extractId = (data) => data?.values?.survey?.fromBase64();

export default function SurveyProvider({ children }) {
  const { toggleSecondary } = useDialog();
  const [id, setId] = useState(null);

  const getSurveyConfigurationById = useCallback((id) => dydu.getSurvey(id), []);

  const configuration = useMemo(() => {
    if (isDefined(id) && !isEmptyString(id)) return getSurveyConfigurationById(id);
    return null;
  }, [id]);

  const showSurvey = useCallback((data) => setId(extractId(data)), []);

  useEffect(() => {
    if (!isDefined(configuration)) return;

    const { title, fields } = configuration;
    const secondaryProps = { title: configuration?.title, body: <Form schema={fields[0]} /> };
    console.log('survey config', configuration);
    window.dydu.ui.secondary(true, secondaryProps);
    toggleSecondary(true, secondaryProps)();
  }, [configuration?.title]);

  const dataContext = useMemo(() => {
    return {
      showSurvey,
    };
  }, []);

  return <SurveyContext.Provider value={dataContext}>{children}</SurveyContext.Provider>;
}

SurveyProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};
