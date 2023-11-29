import PropTypes from 'prop-types';
import { UserActionContext } from '../../contexts/UserActionContext';
import c from 'classnames';
import { useContext } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Render choices for the user to submit feedback.
 */
export default function FeedbackChoices({ onSelect }) {
  const { t } = useTranslation('translation');
  const choices = t('feedback.choices', { defaultValue: [] });
  const askChoices = t('feedback.question');
  const classes = useStyles();
  const { tabbing } = useContext(UserActionContext) || false;

  const onClick = (index) => () => onSelect(index);

  return (
    !!choices.length && (
      <div className="dydu-feedback-choices">
        <p>{askChoices}</p>
        <ul>
          {choices?.map((choice, index) => (
            <li key={index}>
              <button
                role="button"
                href="choice"
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
};
