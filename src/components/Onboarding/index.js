import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Button from '../Button';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import Configuration from '../../tools/configuration';
import sanitize from '../../tools/sanitize';


const ONBOARDING = Configuration.get('onboarding');


/**
 * Protect the children of this component behind an *onboarding* wall.
 * Typically, sensitive content should be only available to the user once they
 * have agreed to the onboarding of the application when relevant.
 *
 * To actually render the onboarding steps instead and not just hide the
 * children, use the property `render` on this component. Ideally the `render`
 * property is utilized on only one instance of this component.
 */
class Onboarding extends React.PureComponent {

  static contextType = OnboardingContext;

  static propTypes = {
    children: PropTypes.node,
    /** @ignore */
    classes: PropTypes.object.isRequired,
    render: PropTypes.bool,
  };

  render() {
    const { hasPrevious, next, previous, state: onboardingState } = this.context;
    const { children, classes, render } = this.props;
    const { active, step } = onboardingState;
    let content = !active && children;
    if (render && active && step) {
      const previousText = step.previous || ONBOARDING.previous;
      const nextText = step.next || ONBOARDING.next;
      const body = sanitize(step.content || step);
      content = (
        <div className={classNames('dydu-onboarding', classes.root)}>
          <div className="dydu-onboarding-body" dangerouslySetInnerHTML={{__html: body}} />
          <div className={classNames('dydu-onboarding-buttons', classes.buttons)}>
            <Button children={previousText} disabled={!hasPrevious()} onClick={previous} />
            <Button children={nextText} onClick={next} />
          </div>
        </div>
      );
    }
    return content;
  }
}


export default withStyles(styles)(Onboarding);
