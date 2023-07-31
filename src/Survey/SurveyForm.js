import './style/survey.css';

import { asset, isDefined, isEmptyArray } from '../tools/helpers';

import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSurvey } from './SurveyProvider';

export default function SurveyForm() {
  const { instances, onSubmit, flushStatesAndClose } = useSurvey();

  const renderFields = useCallback(() => {
    if (!isDefined(instances) || isEmptyArray(instances)) return null;
    return instances.map((instance) => instance.render());
  }, [instances]);

  return !isDefined(instances) ? (
    <>{flushStatesAndClose()}</>
  ) : (
    <form className="survey-form-container">
      {renderFields()}
      <div className="btn-submit-container">
        <ButtonSubmit onSubmit={onSubmit} />
      </div>
    </form>
  );
}

const ButtonSubmit = ({ onSubmit }) => {
  return (
    <button type="button" className={'btn-submit-container'} onClick={onSubmit}>
      <i>Envoyer mes réponses</i> <img src={asset('check-circle.svg')} alt="submit" />
    </button>
  );
};

ButtonSubmit.propTypes = {
  onSubmit: PropTypes.func,
};
