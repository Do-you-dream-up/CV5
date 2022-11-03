import React, { useCallback } from 'react';
import { useSurvey } from './SurveyProvider';
import { isDefined, isEmptyArray } from '../tools/helpers';

export default function SurveyForm() {
  const { instances, showSurvey, onSubmit } = useSurvey();

  const renderFields = useCallback(() => {
    if (!isDefined(instances) || isEmptyArray(instances)) return null;
    return instances.map((instance) => instance.render());
  }, [instances]);

  return !isDefined(instances) ? (
    <button onClick={showSurvey}>click</button>
  ) : (
    <form>
      <h1>Survey Form</h1>
      {renderFields()}
      <button type="button" onClick={onSubmit}>
        Soumettre
      </button>
    </form>
  );
}
