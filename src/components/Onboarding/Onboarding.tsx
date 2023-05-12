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
  render?: boolean;
}

interface Steps {
  title: string;
  body: string;
}

export default function Onboarding({ children, render }: OnboardingProps) {
  const { configuration } = useConfiguration();
  const { active, hasNext, hasPrevious, index, onEnd, onNext, onPrevious, onStep } = useOnboarding();
  const event = useContext?.(EventsContext)?.onEvent?.('onboarding');
  const classes = useStyles({ configuration });
  const { t, ready } = useTranslation('translation');
  const should = ready && render && active;
  const { enable, items } = configuration?.onboarding || {};
  const steps: Steps[] = t('onboarding.steps');
  const stepsFiltered = should && steps?.filter((step, index) => !items?.[index]?.disabled);
  const skip = t('onboarding.skip');
  const previous = t('onboarding.previous');
  const next = t('onboarding.next');

  const configImage = enable && items?.[index] && !items?.[index].image.hidden ? items?.[index].image.src : null;

  const path = configImage?.includes('base64') ? configImage : `${process.env.PUBLIC_URL}assets/${configImage}`;

  useEffect(() => {
    if (active && enable) event?.('onboardingDisplay');
  }, [active, enable, event]);

  if (!enable || !active) return children;
  if (should)
    return (
      <div className={c('dydu-onboarding', classes.root)}>
        <div
          className={c('dydu-onboarding-carousel', classes.carousel)}
          id={`step-${index.toString()}`}
          aria-labelledby={`bullet-${index.toString()}`}
          role="tabpanel"
        >
          <div className={c('dydu-onboarding-image', classes.image)}>
            <img src={path} alt={''} />
          </div>
          <p className={c('dydu-onboarding-title', classes.title)}>{stepsFiltered[index].title}</p>
          <div
            className={c('dydu-onboarding-body', classes.body)}
            dangerouslySetInnerHTML={{ __html: sanitize(stepsFiltered[index].body) }}
          />
          <button type="button" onClick={onEnd} id="skip-onboarding">
            {skip}
          </button>
        </div>
        <div className={c('dydu-onboarding-actions', classes.actions)}>
          {stepsFiltered?.length > 1 && (
            <ol role="tablist" className={c('dydu-carousel-bullets', classes.bullets)}>
              {stepsFiltered &&
                stepsFiltered?.map((_, i) => (
                  <div
                    data-testId={`testid-${i.toString()}`}
                    className={c('dydu-carousel-bullet', {
                      [classes.active]: i === index,
                    })}
                    key={i}
                    onClick={() => onStep(i)}
                    id={`bullet-${i.toString()}`}
                    role="tab"
                    aria-controls={`step-${i.toString()}`}
                  />
                ))}
            </ol>
          )}
          {stepsFiltered.length > 1 ? (
            <div className={c('dydu-onboarding-buttons', classes.buttons)}>
              <Button
                data-testId="previous"
                children={previous}
                disabled={!index}
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
