import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


/**
 * Re-usable button component.
 *
 * An icon button typically accepts an image as its child while the default
 * variant is best used with text.
 */
function Button({ component, flat, reference, variant, ...rest }) {
  const classes = useStyles();
  const type = variant.toLowerCase();
  return React.createElement(component, {
    ...rest,
    className: classNames(
      'dydu-button',
      `dydu-button-${type}`,
      classes.base,
      classes[type],
      {[classes.flat]: flat},
    ),
    ref: reference,
  });
}


Button.defaultProps = {
  component: 'button',
  variant: 'default',
};


Button.propTypes = {
  component: PropTypes.node,
  flat: PropTypes.bool,
  reference: PropTypes.exact({current: PropTypes.object}),
  variant: PropTypes.oneOf(['default', 'icon']),
};


// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => <Button {...props} reference={ref} />);
