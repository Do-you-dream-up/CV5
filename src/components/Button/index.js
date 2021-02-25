import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { UserActionContext } from '../../contexts/UserActionContext';
import useStyles from './styles';


// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => <ButtonBase {...props} reference={ref} />);


/**
 * Re-usable button component.
 *
 * An icon button typically accepts an image as its child while the default
 * variant is best used with text.
 */
export function ButtonBase({
  children,
  color,
  component,
  grow,
  href,
  icon: getIcon,
  onClick,
  reference,
  secondary,
  spin,
  target,
  title,
  type,
  variant,
  ...rest
}) {

  const { configuration } = useContext(ConfigurationContext);
  const { tabbing } = useContext(UserActionContext) || false;
  const classes = useStyles({color, configuration});
  const icon = typeof(getIcon) === 'function' ? getIcon() : getIcon;

  const button = (
    <div children={children} className={classes.children}>
      {icon && <img alt={icon} src={icon} className={c({[classes.spin]: spin})} />}
      <span children={children} />
    </div>
  );

  return React.createElement(href ? 'a' : component, {
    ...rest,
    ...(href ? {href, target, title} : {onClick, type}),
    className: c('dydu-button',
                 `dydu-button-${variant}`,
                 classes.base,
                 {[classes.secondary] : secondary},
                 classes[variant],
                 {[classes.hideOutline]: !tabbing},
                 {[classes.grow]: grow},
                ),
    ref: reference,
    tabIndex: '0',
  }, button);
}


ButtonBase.defaultProps = {
  component: 'button',
  target: '_blank',
  variant: 'contained',
};


ButtonBase.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['error', 'primary', 'success', 'warning']),
  component: PropTypes.node,
  grow: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  onClick: PropTypes.func,
  reference: PropTypes.exact({current: PropTypes.object}),
  secondary: PropTypes.bool,
  spin: PropTypes.bool,
  target: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['contained', 'icon', 'text']),
};
