import Progress from '../Progress';
import PropTypes from 'prop-types';
import c from 'classnames';
import { createElement } from 'react';
import useStyles from './styles';

/**
 * Wrap children with a paper-like UI.
 *
 * See Material design: https://material.io/.
 */
export default function Paper({ children, className, component, elevation, thinking, title, ...rest }) {
  const classes = useStyles({ elevation });
  return createElement(
    component,
    { className: c('dydu-paper', classes.root, className), ...rest },
    <>
      {thinking && <Progress className={classes.progress} />}
      {title && <h2 children={title} className={c('dydu-paper-header', classes.header)} />}
      {children && <div children={children} className="dydu-paper-body" />}
    </>,
  );
}

Paper.defaultProps = {
  component: 'div',
};

Paper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  elevation: PropTypes.number,
  thinking: PropTypes.bool,
  title: PropTypes.string,
};
