import PropTypes from 'prop-types';
import { UserActionContext } from '../../contexts/UserActionContext';
import c from 'classnames';
import { useContext } from 'react';
import useStyles from './styles';
import { useEvent } from '../../contexts/EventsContext';

/**
 * Render choices for the user to submit feedback.
 */
export default function FeedbackChoices({ onSelect, feedbackWording }) {
  const choices = [feedbackWording.choice0, feedbackWording.choice1, feedbackWording.choice2];
  const askChoices = feedbackWording.choiceIntroduction;
  const classes = useStyles();
  const { tabbing } = useContext(UserActionContext) || false;
  const { dispatchEvent } = useEvent();

  const onClick = (index) => () => {
    onSelect(index);
    dispatchEvent && dispatchEvent('chatbox', 'insatisfactionClicked', index);
  };
  return (
    !!choices.length && (
      <div className="dydu-feedback-choices">
        <p>{askChoices}</p>
        <ul>
          {choices?.map((choice, index) => (
            <li key={index}>
              <button
                children={choice}
                className={c('dydu-link', classes.accessibility, {
                  [classes.hideOutline]: !tabbing,
                })}
                onClick={onClick(index)}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  );
}

FeedbackChoices.propTypes = {
  onSelect: PropTypes.func,
  feedbackWording: PropTypes.any,
};
