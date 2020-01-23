import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


/**
 * Re-usable button component.
 *
 * An icon button typically accepts an image as its child while the default
 * variant is best used with text.
 */
export function Button({ color, component, reference, variant, ...rest }) {
  const classes = useStyles({color: color === 'default' ? undefined : color});
  return React.createElement(component, {
    ...rest,
    className: c('dydu-button', `dydu-button-${variant}`, classes.base, classes[variant]),
    ref: reference,
  });
}


Button.defaultProps = {
  color: 'default',
  component: 'button',
  variant: 'contained',
};


Button.propTypes = {
  color: PropTypes.oneOf(['default', 'error', 'success', 'warning']),
  component: PropTypes.node,
  reference: PropTypes.exact({current: PropTypes.object}),
  variant: PropTypes.oneOf(['contained', 'icon', 'icon-contained', 'text']),
};


// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => <Button {...props} reference={ref} />);
