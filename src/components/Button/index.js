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
function Button({ color, component, filled, reference, variant, ...rest }) {
  const classes = useStyles({color});
  const type = variant.toLowerCase();
  return React.createElement(component, {
    ...rest,
    className: c(
      'dydu-button',
      `dydu-button-${type}`,
      classes.base,
      classes[type],
      {[classes.filled]: type === 'default' || filled},
    ),
    ref: reference,
  });
}


Button.defaultProps = {
  component: 'button',
  variant: 'default',
};


Button.propTypes = {
  color: PropTypes.oneOf(['error', 'success', 'warning']),
  component: PropTypes.node,
  filled: PropTypes.bool,
  reference: PropTypes.exact({current: PropTypes.object}),
  variant: PropTypes.oneOf(['default', 'icon']),
};


// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => <Button {...props} reference={ref} />);
