import surveyStyle from './style/survey.css';

import { isDefined, isEmptyArray } from '../tools/helpers';

import { useCallback, useEffect } from 'react';
import { useSurvey } from './SurveyProvider';
import { useShadow } from '../contexts/ShadowProvider';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button/Button';
import icons from '../tools/icon-constants';

export default function SurveyForm() {
  const { instances, onSubmit, surveyConfig } = useSurvey();
  const { shadowAnchor } = useShadow();
  const { t } = useTranslation('translation');

  const buttonWording = surveyConfig?.submitValue !== undefined ? surveyConfig?.submitValue : t('survey.send');

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
    <form
      className="survey-form-container"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {renderFields()}
      <div className="btn-submit-container">
        <Button type={'submit'} icon={icons?.submit}>
          {buttonWording}
        </Button>
      </div>
    </form>
  );
}
