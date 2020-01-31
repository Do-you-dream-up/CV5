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
export function Button({ children, color, component, icon, reference, variant, ...rest }) {

  const classes = useStyles({color});

  const button = (
    <div children={children} className={classes.children}>
      {icon && <img alt={icon} src={icon} />}
      <span children={children} />
    </div>
  );

  return React.createElement(component, {
    ...rest,
    className: c('dydu-button', `dydu-button-${variant}`, classes.base, classes[variant]),
    ref: reference,
  }, button);
}


Button.defaultProps = {
  component: 'button',
  variant: 'contained',
};


Button.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['error', 'primary', 'success', 'warning']),
  component: PropTypes.node,
  icon: PropTypes.string,
  reference: PropTypes.exact({current: PropTypes.object}),
  variant: PropTypes.oneOf(['contained', 'icon', 'text']),
};


// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => <Button {...props} reference={ref} />);
