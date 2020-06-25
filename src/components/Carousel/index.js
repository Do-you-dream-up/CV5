import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from  '../Button';
import useStyles from  './styles';


/**
 * Typically used with the `Interaction` component.
 *
 * Format children in a carousel UI with previous and next controls.
 */
export default function Carousel({ children, className, ...rest }) {

  const classes = useStyles();
  const [ index, setIndex ] = useState(0);
  const { t } = useTranslation('carousel');
  const length = React.Children.count(children);

  const hasNext = () => index < length - 1;
  const hasPrevious = () => index > 0;

  const onNext = () => setIndex(previous => Math.min(length - 1, previous + 1));
  const onPrevious = () => setIndex(previous => Math.max(0, previous - 1));

  return (
    <div className={c('dydu-carousel', classes.root), className} {...rest}>
      <div children={children}
           className={c('dydu-carousel-content', classes.content)}
           style={{transform: `translateX(${index * -100}%)`}} />
      {length > 0 && (
        <div className={c('dydu-carousel-controls', classes.controls)}>
          <Button children={t('previous')} disabled={!hasPrevious()} onClick={onPrevious} />
          <Button children={t('next')} disabled={!hasNext()} onClick={onNext} />
        </div>
      )}
    </div>
  );
}


Carousel.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
};
