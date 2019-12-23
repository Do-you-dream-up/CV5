import React from 'react';
import PropTypes from 'prop-types';


/**
 * Render handles for the user to submit feedback insatisfaction.
 */
export default function FeedbackChoices ({ onSelect }) {

  const choices = ['Je n\'ai pas compris votre question', 'Ma réponse n\'était pas claire', 'J\'ai bien compris mais la solution proposée ne vous satisfait pas'];

  return (
    <div className="dydu-feedback-insatisfaction">
      <ul>
        {
          choices.map((choice, index) => {
            return (<li key={index}>
              <span className="dydu-link" onClick={() => onSelect(index)}> {choice} </span>
            </li>);
          })
        }
      </ul>
    </div>
  );
}

FeedbackChoices.propTypes = {
  onSelect: PropTypes.func
};