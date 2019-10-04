import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from './styles';
import Button from '../Button';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { withConfiguration } from '../../tools/configuration';
import sanitize from '../../tools/sanitize';


/**
 * Protect the children of this component behind an *onboarding* wall.
 * Typically, sensitive content should be only available to the user once they
 * have agreed to the onboarding of the application when relevant.
 *
 * To actually render the onboarding steps instead and not just hide the
 * children, use the property `render` on this component. Ideally the `render`
 * property is utilized on only one instance of this component.
 */
function Onboarding({ children, configuration, render }) {

  const { hasPrevious, next, previous, state: onboardingState } = useContext(OnboardingContext);
  const classes = useStyles({configuration});
  const { steps } = configuration.onboarding;
  const should = render && onboardingState.active && onboardingState.index < steps.length;
  const step = steps[onboardingState.index];
  const previousText = step.previous || configuration.onboarding.previous;
  const nextText = step.next || configuration.onboarding.next;
  const body = sanitize(step.content || step);

  return should ? (
    <div className={classNames('dydu-onboarding', classes.root)}>
      <div className="dydu-onboarding-body" dangerouslySetInnerHTML={{__html: body}} />
      <div className={classNames('dydu-onboarding-buttons', classes.buttons)}>
        <Button children={previousText} disabled={!hasPrevious()} onClick={previous} />
        <Button children={nextText} onClick={next} />
      </div>
    </div>
  ) : !onboardingState.active && children;
}


Onboarding.propTypes = {
  children: PropTypes.node,
  configuration: PropTypes.object.isRequired,
  render: PropTypes.bool,
};


export default withConfiguration(Onboarding);
