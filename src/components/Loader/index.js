import PropTypes from 'prop-types';
import Scroll from '../Scroll/Scroll';
import c from 'classnames';
import { createElement } from 'react';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';

/**
 * The Loader suggests to the user that the chatbot is *thinking* by display a
 * loader animated with CSS styling.
 *
 * The loader size determines the number of bullets.
 */
export default function Loader({ className, scroll, size, variant }) {
  const { configuration } = useConfiguration();
  const classes = useStyles({ configuration });
  const { size: defaultSize } = configuration.loader;
  return createElement(
    scroll ? Scroll : 'div',
    { scrollToBottom: true, className: c('dydu-loader', classes.root, className) },
    <>
      {[...Array(size || defaultSize)].map((it, index) => (
        <div
          className={c('dydu-loader-bullet', classes.item, classes[variant])}
          key={index}
          style={{ animationDelay: `${index / 10}s` }}
        />
      ))}
    </>,
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
