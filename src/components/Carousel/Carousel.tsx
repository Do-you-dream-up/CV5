import { Children, useCallback, useContext, useEffect, useState } from 'react';

import Actions, { ActionProps } from '../Actions/Actions';
import { DialogContext } from '../../contexts/DialogContext';
import { Local } from '../../tools/storage';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useSwipeable } from 'react-swipeable';
import { useTranslation } from 'react-i18next';
import useViewport from '../../tools/hooks/useViewport';

/**
 * Typically used with the `Interaction` component.
 *
 * Format children in a carousel UI with previous and next controls.
 */

interface CarouselProps {
  children: any[];
  className: string;
  steps: [];
  templateName: string;
}

const Carousel = ({ children, className, steps, templateName, ...rest }: CarouselProps) => {
  const { t } = useTranslation();
  const { configuration } = useConfiguration();
  const { isMobile } = useViewport();
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(steps ? steps[0] : 0);

  const { offset, offsetBetweenCard } = templateName ? configuration.templateCarousel : configuration.carousel;

  const hasBullets = templateName ? !!configuration.templateCarousel : !!configuration.carousel;
  const hasControls = templateName ? !!configuration.templateCarousel : !!configuration.carousel;

  const length = Children.count(children);

  const isFullScreen = isMobile || Local.get(Local.names.open) === 3;
  const automaticSecondary = isFullScreen
    ? !!configuration?.secondary.automatic?.fullScreen
    : !!configuration?.secondary.automatic?.desktop;

  const { secondaryActive, toggleSecondary } = useContext(DialogContext);
  const classes: any = useStyles({ index, length, offset, offsetBetweenCard });

  const handlers = useSwipeable({
    onSwipedLeft: () => triggerNext(),
    onSwipedRight: () => triggerPrevious(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const hasNext = () => index < length - 1;
  const hasPrevious = () => index > 0;

  const triggerNext = () => setIndex((previous) => Math.min(length - 1, previous + 1));
  const triggerPrevious = () => setIndex((previous) => Math.max(0, previous - 1));

  const previousAction: ActionProps[] = [
    {
      children: (
        <img
          alt={t('carousel.previous')}
          src={`${process.env.PUBLIC_URL}icons/dydu-chevron-left-black.svg`}
          title={t('carousel.previous')}
        />
      ),
      disabled: !hasPrevious(),
      onClick: triggerPrevious,
      variant: 'icon',
    },
  ];

  const nextAction: ActionProps[] = [
    {
      children: (
        <img
          alt={t('carousel.next')}
          src={`${process.env.PUBLIC_URL}icons/dydu-chevron-right-black.svg`}
          title={t('carousel.next')}
        />
      ),
      disabled: !hasNext(),
      onClick: triggerNext,
      variant: 'icon',
    },
  ];

  const onToggle = useCallback(
    (open) => {
      if (secondaryActive) {
        toggleSecondary(open, {
          body: step.sidebar.content,
          ...step.sidebar,
        })();
      }
    },
    [secondaryActive, step, toggleSecondary],
  );

  useEffect(() => {
    if (steps && step && step.sidebar) {
      setStep(steps[index]);
      onToggle(Local.get(Local.names.secondary) || automaticSecondary);
    }
  }, [index, steps, step, automaticSecondary, onToggle]);

  return (
    <div className={(c('dydu-carousel', classes.root), className)} {...rest}>
      <div className={c('dydu-carousel-steps', classes.steps)} {...handlers}>
        {children.map((it, i) => (
          <div
            children={it}
            className={c('dydu-carousel-step', classes.step, templateName && classes.stepTemplate)}
            key={i}
          />
        ))}
      </div>
      {!!hasBullets && length > 0 && (
        <div className={c('dydu-carousel-bullets', classes.bullets)}>
          {children.map((it, i) => (
            <div
              className={c('dydu-carousel-bullet', {
                [classes.active]: i === index,
              })}
              key={i}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
      {!!hasControls && length > 1 && (
        <>
          <Actions actions={previousAction} targetStyleKey="arrowButtonLeft" />
          <Actions actions={nextAction} targetStyleKey="arrowButtonRight" />
        </>
      )}
    </div>
  );
};

export default Carousel;
