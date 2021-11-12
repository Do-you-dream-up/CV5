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
const images = JSON.parse(localStorage.getItem('dydu.images'));

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
  const {
    active,
    hasNext,
    hasPrevious,
    index,
    onEnd,
    onNext,
    onPrevious,
    onStep,
  } = useContext(OnboardingContext) || {};
  const event = useContext(EventsContext).onEvent('onboarding');
  const classes = useStyles({ configuration });
  const { t } = useTranslation('translation');
  const should = render && active;
  const { enable, image1, image2, image3 } = configuration.onboarding;
  const steps = t('onboarding.steps');
  const skip = t('onboarding.skip');
  const previous = t('onboarding.previous');
  const next = t('onboarding.next');
  // onboarding Images from local storage of Dydubox
  const onboarding1 = images && images.onboarding1;
  const onboarding2 = images && images.onboarding2;
  const onboarding3 = images && images.onboarding3;

  const storageImage =
    index === 0 ? onboarding1 : index === 1 ? onboarding2 : onboarding3;
  const configImage = index === 0 ? image1 : index === 1 ? image2 : image3;
  const path = `${process.env.PUBLIC_URL}assets/${configImage}`;

  useEffect(() => {
    if (active && enable) event('onboardingDisplay');
  }, [active, enable, event]);

  return !enable ? (
    children
  ) : should ? (
    <div className={c('dydu-onboarding', classes.root)}>
      <div className={c('dydu-onboarding-carousel', classes.carousel)}>
        <div className={c('dydu-onboarding-image', classes.image)}>
          <img src={storageImage || path} alt={storageImage || path} />
        </div>
        <div className={c('dydu-onboarding-title', classes.title)}>
          {steps[index].title}
        </div>
        <div
          className={c('dydu-onboarding-body', classes.body)}
          dangerouslySetInnerHTML={{ __html: sanitize(steps[index].body) }}
        />
        <a href="#" onClick={onEnd}>
          {skip}
        </a>
      </div>
      <div className={c('dydu-onboarding-actions', classes.actions)}>
        {steps.length > 1 && (
          <div className={c('dydu-carousel-bullets', classes.bullets)}>
            {steps.map((it, i) => (
              <div
                className={c('dydu-carousel-bullet', {
                  [classes.active]: i === index,
                })}
                key={i}
                onClick={() => onStep(i)}
              />
            ))}
          </div>
        )}
        <div className={c('dydu-onboarding-buttons', classes.buttons)}>
          <Button
            children={previous}
            disabled={!index}
            secondary={true}
            onClick={hasPrevious ? onPrevious : null}
          />
          <Button children={next} onClick={hasNext ? onNext : onEnd} />
        </div>
      </div>
    </div>
  ) : (
    !active && children
  );
}

Onboarding.propTypes = {
  children: PropTypes.node,
  render: PropTypes.bool,
};
