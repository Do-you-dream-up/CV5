import { Children, useCallback, useContext, useEffect, useState } from 'react';

import Actions from '../Actions';
import { DialogContext } from '../../contexts/DialogContext';
import { Local } from '../../tools/storage';
import PropTypes from 'prop-types';
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
export default function Carousel({ children, className, steps, templatename, ...rest }) {
  const { configuration } = useConfiguration();
  const { isMobile } = useViewport();
  const { offset, offsetBetweenCard } = templatename ? configuration.templateCarousel : configuration.carousel;
  const hasBullets = templatename ? !!configuration.templateCarousel : !!configuration.carousel;
  const hasControls = templatename ? !!configuration.templateCarousel : !!configuration.carousel;
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(steps ? steps[0] : 0);
  const { t } = useTranslation('translation');
  const previous = t('carousel.previous');
  const next = t('carousel.next');
  const length = Children.count(children);
  const isFullScreen = isMobile || Local.get(Local.names.open) === 3;
  const { desktop: secondaryDesktop, fullScreen: secondaryFullScreen } = configuration.secondary.automatic;
  const automaticSecondary = isFullScreen ? !!secondaryFullScreen : !!secondaryDesktop;
  const { secondaryActive, toggleSecondary } = useContext(DialogContext);
  const classes = useStyles({ index, length, offset, offsetBetweenCard });

  const handlers = useSwipeable({
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrevious(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const hasNext = () => index < length - 1;
  const hasPrevious = () => index > 0;

  const onNext = () => setIndex((previous) => Math.min(length - 1, previous + 1));
  const onPrevious = () => setIndex((previous) => Math.max(0, previous - 1));

  const previousAction = [
    {
      children: (
        <img alt={previous} src={`${process.env.PUBLIC_URL}icons/dydu-chevron-left-black.svg`} title={previous} />
      ),
      disabled: !hasPrevious(),
      onClick: onPrevious,
      variant: 'icon',
    },
  ];

  const nextAction = [
    {
      children: <img alt={next} src={`${process.env.PUBLIC_URL}icons/dydu-chevron-right-black.svg`} title={next} />,
      disabled: !hasNext(),
      onClick: onNext,
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
      <div children={children} className={c('dydu-carousel-steps', classes.steps)} {...handlers}>
        {children.map((it, i) => (
          <div
            children={it}
            className={c('dydu-carousel-step', classes.step, templatename && classes.stepTemplate)}
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
}

Carousel.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  steps: PropTypes.array,
  templatename: PropTypes.string,
};
