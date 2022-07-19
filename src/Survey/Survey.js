import React, { useCallback, useMemo } from 'react';
import Interface from './Interface';
import { useSurvey } from '../contexts/SurveyContext';
import Input from './Input';

export default function Survey() {
  const { send, configuration, updateField } = useSurvey();

  console.log('survey component MF !');

  const title = useMemo(() => configuration?.title || '', [configuration?.title]);
  const inputs = useMemo(() => configuration?.fields || [], [configuration?.fields]);
  const renderInputList = useCallback(() => {
    console.log('rendering fields list !', inputs);
    return inputs.map((input) => <Input onUpdate={updateField} key={input.id} field={input} />);
  }, [updateField, inputs]);

  return (
    <>
      <h1>{title}</h1>
      {renderInputList()}
      <button onClick={send}></button>
    </>
  );
}

Survey.propTypes = {
  configuration: Interface.configuration,
};
