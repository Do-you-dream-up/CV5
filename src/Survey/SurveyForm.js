import surveyStyle from './style/survey.css';

import { asset, isDefined, isEmptyArray } from '../tools/helpers';

import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useSurvey } from './SurveyProvider';
import { useTheme } from 'react-jss';
import { useShadow } from '../contexts/ShadowProvider';

export default function SurveyForm() {
  const { instances, onSubmit, surveyConfig } = useSurvey();
  const { shadowAnchor } = useShadow();

  const buttonWording = surveyConfig?.submitValue !== undefined ? surveyConfig?.submitValue : 'Envoyer mes réponses';

  useEffect(() => {
    if (!shadowAnchor?.querySelector('#dydu-style-survey')) {
      const style = document.createElement('style');
      style.innerHTML = surveyStyle;
      style.id = 'dydu-style-survey';
      shadowAnchor?.appendChild(style);
    }
  }, [surveyStyle]);

  const renderFields = useCallback(() => {
    if (!isDefined(instances) || isEmptyArray(instances)) return null;
    return instances.map((instance) => instance.render());
  }, [instances]);

  return !isDefined(instances) ? (
    <></>
  ) : (
    <form className="survey-form-container">
      {renderFields()}
      <div className="btn-submit-container">
        <ButtonSubmit onSubmit={onSubmit} wording={buttonWording} />
      </div>
    </form>
  );
}

const ButtonSubmit = ({ onSubmit, wording }) => {
  const theme = useTheme();

  return (
    <button
      type="button"
      className={'btn-submit-container'}
      onClick={onSubmit}
      style={{ backgroundColor: theme?.palette?.primary?.main ?? '#41479B' }}
    >
      <i>{wording}</i> <img src={asset('check-circle.svg')} alt="submit" />
    </button>
  );
};

ButtonSubmit.propTypes = {
  onSubmit: PropTypes.func,
  wording: PropTypes.string,
};
