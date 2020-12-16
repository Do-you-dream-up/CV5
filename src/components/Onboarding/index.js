import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { EventsContext } from '../../contexts/EventsContext';
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
  const { active, hasNext, hasPrevious, index, onEnd, onNext, onPrevious, onStep } = useContext(OnboardingContext) || {};
  const event = useContext(EventsContext).onEvent('onboarding');
  const classes = useStyles({configuration});
  const { t } = useTranslation('translation');
  const should = render && active;
  const { enable } = configuration.onboarding;
  const steps = t('onboarding.steps');
  const skip = t('onboarding.skip');
  const previous = t('onboarding.previous');
  const next = t('onboarding.next');

  useEffect(() => {
    if (active)
      event('onboardingDisplay');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !enable ? children : should ? (
    <div className={c('dydu-onboarding', classes.root)}>
      <div className={c('dydu-onboarding-carousel', classes.carousel)}>
        <div className={classes.image}>
          <img src={`${process.env.PUBLIC_URL}assets/${steps[index].image}`}
               alt={`${process.env.PUBLIC_URL}assets/${steps[index].image}`}/>
        </div>
        <div className={classes.title}>{steps[index].title}</div>
        <div className={classes.body}
             dangerouslySetInnerHTML={{__html: sanitize(steps[index].body)}} />
        <a href='#' onClick={onEnd}>{skip}</a>
      </div>
      <div className={classes.actions}>
        {steps.length > 1 && (
        <div className={c('dydu-carousel-bullets', classes.bullets)}>
            {steps.map((it, i) => (
              <div className={c('dydu-carousel-bullet', {[classes.active]: i === index})}
                   key={i}
                   onClick={() => onStep(i)} />
            ))}
        </div>
        )}
        <div className={classes.buttons}>
          <Button children={previous} disabled={!index} onClick={hasPrevious ? onPrevious : null} />
          <Button children={next} onClick={hasNext ? onNext : onEnd} />
        </div>
      </div>
    </div>
  ) : !active && children;
}


Onboarding.propTypes = {
  children: PropTypes.node,
  render: PropTypes.bool,
};
