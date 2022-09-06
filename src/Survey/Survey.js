import React from 'react';
import { useSurvey } from './SurveyProvider';
import Field from './Field';
import { isDefined } from '../tools/helpers';

export default function Survey() {
  const { fields, send: sendSurvey } = useSurvey();
  return !isDefined(fields) ? null : (
    <div style={Style.container}>
      {fields.map((field) => (
        <Field key={field.id} field={field} />
      ))}
      <button style={{ marginTop: '3rem' }} onClick={sendSurvey}>
        valider
      </button>
    </div>
  );
}

const Style = {
  container: {
    border: '1px solid grey',
    width: 'min(90%, 1020px)',
    marginInline: 'auto',
    borderRadius: '.5rem',
  },
};
