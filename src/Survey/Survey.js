import React, { useMemo } from 'react';
import Interface from './Interface';
import { useSurvey } from '../contexts/SurveyContext';

export default function Survey({ configuration }) {
  const { send } = useSurvey();
  const title = useMemo(() => configuration?.title, [configuration?.title]);

  return (
    <>
      <h1>survey</h1>
      <h2>{title}</h2>
      <button onClick={send}></button>
    </>
  );
}

Survey.propTypes = {
  configuration: Interface.configuration,
};
