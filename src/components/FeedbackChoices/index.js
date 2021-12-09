import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Render choices for the user to submit feedback.
 */
export default function FeedbackChoices({ onSelect }) {
  const { t } = useTranslation('translation');
  const choices = t('feedback.choices', { defaultValue: [] });

  const onClick = (index) => () => onSelect(index);

  return (
    !!choices.length && (
      <div className="dydu-feedback-choices">
        <ul>
          {choices.map((choice, index) => (
            <li key={index}>
              <span children={choice} className="dydu-link" onClick={onClick(index)} />
            </li>
          ))}
        </ul>
      </div>
    )
  );
}

FeedbackChoices.propTypes = {
  onSelect: PropTypes.func,
};
