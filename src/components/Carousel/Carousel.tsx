import Actions, { ActionProps } from '../Actions/Actions';
import { Children, useCallback, useContext, useEffect, useState } from 'react';

import { DialogContext } from '../../contexts/DialogContext';
import Icon from '../Icon/Icon';
import { Local } from '../../tools/storage';
import c from 'classnames';
import icons from '../../tools/icon-dydu-constants';
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
  steps: Servlet.ChatResponseValues[];
  templateName: string;
}

const Carousel = ({ children, className, steps, templateName, ...rest }: CarouselProps) => {
  const { t } = useTranslation();
  const { configuration } = useConfiguration();
  const { isMobile } = useViewport();
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState<any>(steps ? steps[0] : 0);

  const carouselConfig = configuration && (templateName ? configuration.templateCarousel : configuration.carousel);

  const length = Children.count(children);

  const isFullScreen = isMobile || Local.get(Local.names.open) === 3;
  const automaticSecondary = isFullScreen
    ? !!configuration?.secondary.automatic?.fullScreen
    : !!configuration?.secondary.automatic?.desktop;
  const classes: any = useStyles({
    index,
    length,
    offset: carouselConfig?.offset,
    offsetBetweenCard: carouselConfig?.offsetBetweenCard,
  });

  const { secondaryActive, toggleSecondary } = useContext(DialogContext);

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
      children: <Icon icon={icons.iconCaretLeft || ''} alt={t('carousel.previous')} title={t('carousel.previous')} />,
      disabled: !hasPrevious(),
      onClick: triggerPrevious,
      variant: 'icon',
      id: 'dydu-arrow-left',
    },
  ];

  const nextAction: ActionProps[] = [
    {
      children: <Icon icon={icons.iconCaretRight || ''} alt={t('carousel.next')} title={t('carousel.next')} />,
      disabled: !hasNext(),
      onClick: triggerNext,
      variant: 'icon',
      id: 'dydu-arrow-right',
    },
  ];

  const onToggle = useCallback(
    (open) => {
      if (secondaryActive) {
        toggleSecondary &&
          toggleSecondary(open, {
            body: step.sidebar.content,
            ...step.sidebar,
          })();
      }
    },
    [secondaryActive, step, toggleSecondary],
  );

  useEffect(() => {
    if (steps && step?.sidebar) {
      setStep(steps[index]);
      onToggle(Local.get(Local.names.secondary) || automaticSecondary);
    }
  }, [index, steps, step, automaticSecondary, onToggle]);

  const renderControls = () =>
    carouselConfig?.controls &&
    length > 1 && (
      <>
        <Actions className="dydu-carousel-controls" actions={previousAction} targetStyleKey="arrowButtonLeft" />
        <Actions className="dydu-carousel-controls" actions={nextAction} targetStyleKey="arrowButtonRight" />
      </>
    );

  const renderBullets = () =>
    carouselConfig?.bullets &&
    length > 0 && (
      <div className={c('dydu-carousel-bullets', classes.bullets)}>
        {children.map((item, idx) => (
          <div
            className={c('dydu-carousel-bullet', {
              [classes.active]: item.key === index,
            })}
            key={item?.key || idx}
            onClick={() => setIndex(item.key)}
          />
        ))}
      </div>
    );
  const renderSteps = () =>
    children?.map((item, i) => (
      <div
        children={item}
        className={c('dydu-carousel-step', classes.step, templateName && classes.stepTemplate)}
        key={i}
      />
    ));

  return (
    <div className={(c('dydu-carousel', classes.root), className)} {...rest}>
      <div className={c('dydu-carousel-steps', classes.steps)} {...handlers}>
        {renderSteps()}
      </div>
      {renderBullets()}
      {renderControls()}
    </div>
  );
};

export default Carousel;
