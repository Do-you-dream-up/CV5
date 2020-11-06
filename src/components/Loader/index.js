import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import Scroll from '../Scroll';
import useStyles from './styles';


/**
 * The Loader suggests to the user that the chatbot is *thinking* by display a
 * loader animated with CSS styling.
 *
 * The loader size determines the number of bullets.
 */
export default function Loader({ className, scroll, size, variant }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const { size: defaultSize } = configuration.loader;
  return React.createElement(
    scroll ? Scroll : 'div',
    {className: c('dydu-loader', classes.root, className)},
    (
      <>
        {[...Array(size || defaultSize)].map((it, index) => (
          <div className={c('dydu-loader-bullet', classes.item, classes[variant])}
               key={index}
               style={{animationDelay: `${index / 10}s`}} />
        ))}
      </>
    ),
  );
}


Loader.defaultProps = {
  component: 'div',
  scroll: true,
  variant: 'bars',
};


Loader.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
  scroll: PropTypes.bool,
  size: PropTypes.number,
  variant: PropTypes.oneOf(['bars', 'bubbles']),
};
