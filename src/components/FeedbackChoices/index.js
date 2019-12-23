import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';


/**
 * Render choices for the user to submit feedback insatisfaction.
 */
export default function FeedbackChoices({ onSelect }) {

  const { t } = useTranslation('feedback');
  const choices = t('choices');

  return (
    <div className="dydu-feedback-insatisfaction">
      <ul>
        {choices.map((choice, index) => {
            return ( 
              <li key={index}>
                <span children={choice} className="dydu-link" onClick={() => onSelect(index)} />
              </li>
            );
        })}
      </ul>
    </div>
  );
}


FeedbackChoices.propTypes = {
  onSelect: PropTypes.func
};