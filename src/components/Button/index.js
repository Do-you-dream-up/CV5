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
export function Button({
  children,
  color,
  component,
  grow,
  href,
  icon,
  onClick,
  reference,
  target,
  type,
  variant,
  ...rest
}) {

  const classes = useStyles({color});

  const button = (
    <div children={children} className={classes.children}>
      {icon && <img alt={icon} src={icon} />}
      <span children={children} />
    </div>
  );

  return React.createElement(href ? 'a' : component, {
    ...rest,
    ...(href ? {href, target} : {onClick, type}),
    className: c('dydu-button',
                 `dydu-button-${variant}`,
                 classes.base,
                 classes[variant],
                 {[classes.grow]: grow},
                ),
    ref: reference,
  }, button);
}


Button.defaultProps = {
  component: 'button',
  target: '_blank',
  variant: 'contained',
};


Button.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['error', 'primary', 'success', 'warning']),
  component: PropTypes.node,
  grow: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  reference: PropTypes.exact({current: PropTypes.object}),
  target: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['contained', 'icon', 'text']),
};


// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => <Button {...props} reference={ref} />);
