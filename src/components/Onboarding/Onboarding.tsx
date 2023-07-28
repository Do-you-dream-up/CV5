import { useContext, useEffect } from 'react';

import Button from '../Button/Button';
import { EventsContext } from '../../contexts/EventsContext';
import c from 'classnames';
import sanitize from '../../tools/sanitize';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Protect the children of this component behind an *onboarding* wall.
 * Typically, sensitive content should be only available to the user once they
 * have agreed to the onboarding of the application when relevant.
 *
 * To actually render the onboarding steps instead and not just hide the
 * children, use the property `render` on this component. Ideally the `render`
 * property is utilized on only one instance of this component.
 */

interface OnboardingProps {
  children?: any;
}

export default function Onboarding({ children }: OnboardingProps) {
  const { configuration } = useConfiguration();
  const {
    isOnboardingAlreadyDone,
    hasNext,
    hasPrevious,
    stepIndex,
    onEnd,
    onNext,
    onPrevious,
    onStep,
    carouselRef,
    stepsFiltered,
    srcImage,
    isOnboardingNeeded,
  } = useOnboarding();
  const event = useContext?.(EventsContext)?.onEvent?.('onboarding');
  const classes = useStyles({ configuration });
  const { t } = useTranslation('translation');
  const { enable: isOnboardingEnabled } = configuration?.onboarding || {};

  const skip: string = t('onboarding.skip');
  const previous: string = t('onboarding.previous');
  const next: string = t('onboarding.next');

  useEffect(() => {
    if (!isOnboardingAlreadyDone && isOnboardingEnabled) event?.('onboardingDisplay');
  }, [!isOnboardingAlreadyDone, isOnboardingEnabled, event]);

  if (!isOnboardingEnabled || isOnboardingAlreadyDone) return children;
  if (isOnboardingNeeded)
    return (
      <div className={c('dydu-onboarding', classes.root)}>
        <div
          className={c('dydu-onboarding-carousel', classes.carousel)}
          id={`step-${stepIndex?.toString()}`}
          aria-labelledby={`bullet-${stepIndex?.toString()}`}
          role="tabpanel"
          tabIndex={0}
          ref={carouselRef}
        >
          <div className={c('dydu-onboarding-image', classes.image)}>
            <img src={srcImage} alt={''} />
          </div>
          {stepIndex !== undefined && stepsFiltered && stepsFiltered?.[stepIndex]?.title && (
            <p className={c('dydu-onboarding-title', classes.title)}>{stepsFiltered?.[stepIndex]?.title}</p>
          )}

          {stepIndex !== undefined && stepsFiltered && stepsFiltered?.[stepIndex]?.body && (
            <div
              className={c('dydu-onboarding-body', classes.body)}
              dangerouslySetInnerHTML={{ __html: sanitize(stepsFiltered?.[stepIndex]?.body) }}
            />
          )}
          <button type="button" onClick={onEnd} id="skip-onboarding">
            {skip}
          </button>
        </div>
        <div className={c('dydu-onboarding-actions', classes.actions)}>
          {stepsFiltered && stepsFiltered?.length > 1 && (
            <ol role="tablist" className={c('dydu-carousel-bullets', classes.bullets)}>
              {stepsFiltered &&
                stepsFiltered?.map((_, i) => (
                  <div
                    data-testId={`testid-${i.toString()}`}
                    className={c('dydu-carousel-bullet', {
                      [classes.active]: i === stepIndex,
                    })}
                    key={i}
                    onClick={() => onStep?.(i + 1)}
                    id={`bullet-${i.toString()}`}
                    aria-controls={`step-${i.toString()}`}
                  />
                ))}
            </ol>
          )}
          {stepsFiltered && stepsFiltered.length > 1 ? (
            <div className={c('dydu-onboarding-buttons', classes.buttons)}>
              <Button
                data-testId="previous"
                children={previous}
                disabled={!stepIndex}
                secondary={true}
                onClick={hasPrevious ? onPrevious : null}
                id="onboarding-previous"
              />
              <Button children={next} onClick={hasNext ? onNext : onEnd} id="onboarding-next" />
            </div>
          ) : null}
        </div>
      </div>
    );
  return null;
}
