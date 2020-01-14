import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import sanitize from '../../tools/sanitize';
import Button from '../Button';
import useStyles from './styles';


/**
 * Protect the children of this component behind an *onboarding* wall.
 * Typically, sensitive content should be only available to the user once they
 * have agreed to the onboarding of the application when relevant.
 *
 * To actually render the onboarding steps instead and not just hide the
 * children, use the property `render` on this component. Ideally the `render`
 * property is utilized on only one instance of this component.
 */
export default function Onboarding({ children, render }) {

  const { configuration } = useContext(ConfigurationContext);
  const { active, hasPrevious, index, onNext, onPrevious } = useContext(OnboardingContext);
  const classes = useStyles({configuration});
  const { t } = useTranslation('onboarding');
  const steps = t('steps');
  const should = render && active && index < steps.length;
  const { content, next = t('next'), previous = t('previous') } = steps[index] || {};

  return should ? (
    <div className={c('dydu-onboarding', classes.root)}>
      <div className={c('dydu-onboarding-body', classes.body)}
           dangerouslySetInnerHTML={{__html: sanitize(content)}} />
      <div className={c('dydu-onboarding-buttons', classes.buttons)}>
        <Button children={previous} disabled={!hasPrevious()} onClick={onPrevious} />
        <Button children={next} onClick={onNext} />
      </div>
    </div>
  ) : !active && children;
}


Onboarding.propTypes = {
  children: PropTypes.node,
  render: PropTypes.bool,
};
