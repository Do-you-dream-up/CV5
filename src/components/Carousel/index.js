import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import { DialogContext } from  '../../contexts/DialogContext';
import { Local } from '../../tools/storage';
import Actions from '../Actions';
import useStyles from  './styles';


/**
 * Typically used with the `Interaction` component.
 *
 * Format children in a carousel UI with previous and next controls.
 */
export default function Carousel({ children, className, steps, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const { offset, width } = configuration.carousel;
  const hasBullets = !!configuration.carousel.bullets;
  const hasControls = !!configuration.carousel.controls;
  const classes = useStyles({offset, width});
  const [ index, setIndex ] = useState(0);
  const [ step, setStep ] = useState(steps[index]);
  const { t } = useTranslation('translation');
  const previous = t('carousel.previous');
  const next = t('carousel.next');
  const length = React.Children.count(children);
  const automaticSecondary = !!configuration.secondary.automatic;
  const { secondaryActive, toggleSecondary } = useContext(DialogContext);

  const hasNext = () => index < length - 1;
  const hasPrevious = () => index > 0;

  const onNext = () => setIndex(previous => Math.min(length - 1, previous + 1));
  const onPrevious = () => setIndex(previous => Math.max(0, previous - 1));

  const previousAction = [{
    children: <img alt={previous} src="icons/chevron-left.black.png" title={previous} />,
    disabled: !hasPrevious(),
    onClick: onPrevious,
    variant: 'icon',
  }];

  const nextAction = [{
    children: <img alt={next} src="icons/chevron-right.black.png" title={next} />,
    disabled: !hasNext(),
    onClick: onNext,
    variant: 'icon',
  }];

  const onToggle = useCallback(open => {
    if (secondaryActive) {
      toggleSecondary(open, {body: step.sidebar.content, ...step.sidebar})();
    }
  }, [secondaryActive, step, toggleSecondary]);

  useEffect(() => {
    if (step.sidebar) {
      setStep(steps[index]);
      onToggle(Local.get(Local.names.secondary) || (automaticSecondary));
    }
  }, [index, steps, step, automaticSecondary, onToggle]);

  return (
    <div className={c('dydu-carousel', classes.root), className} {...rest}>
      <div children={children}
           className={c('dydu-carousel-steps', classes.steps)}
           style={{transform: `translateX(${index * width * -1 + offset}%)`}}>
        {children.map((it, i) => (
          <div children={it} className={c('dydu-carousel-step', classes.step)} key={i} />
        ))}
      </div>
      {!!hasBullets && length > 0 && (
        <div className={c('dydu-carousel-bullets', classes.bullets)}>
          {children.map((it, i) => (
            <div className={c('dydu-carousel-bullet', {[classes.active]: i === index})}
                 key={i}
                 onClick={() => setIndex(i)} />
          ))}
        </div>
      )}
      {!!hasControls && length > 0 && (
        <div className={c('dydu-carousel-controls', classes.controls)}>
          <Actions actions={previousAction} />
          <Actions actions={nextAction} />
        </div>
      )}
    </div>
  );
}


Carousel.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  steps: PropTypes.array,
};
