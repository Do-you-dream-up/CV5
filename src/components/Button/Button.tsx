import { ReactNode, Ref, createElement, forwardRef, useContext } from 'react';

import { UserActionContext } from '../../contexts/UserActionContext';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';

export interface ButtonProps {
  children?: ReactNode;
  color?: 'error' | 'primary' | 'success' | 'warning';
  component?: any;
  grow?: boolean;
  disabled?: boolean;
  id?: string;
  href?: string;
  icon?: string | (() => void);
  onClick?: () => void;
  reference?: Ref<any>;
  secondary?: boolean;
  spin?: boolean;
  target?: string;
  title?: string;
  type?: string;
  variant?: 'contained' | 'icon' | 'text';
}

export default forwardRef((props: ButtonProps, ref) => <Button {...props} reference={ref} />);

/**
 * Re-usable button component.
 *
 * An icon button typically accepts an image as its child while the default
 * variant is best used with text.
 */
const Button = ({
  children,
  color,
  component = 'button',
  grow,
  disabled,
  id,
  href,
  icon: getIcon,
  onClick,
  reference,
  secondary,
  spin,
  target = '_blank',
  title,
  type,
  variant = 'contained',
  ...rest
}: ButtonProps) => {
  const { configuration } = useConfiguration();
  const { tabbing } = useContext(UserActionContext) || false;
  const classes: any = useStyles({ color, configuration });
  const icon = typeof getIcon === 'function' ? getIcon() : getIcon;

  const button = (
    <div className={classes.children}>
      {icon ? <img alt={icon} src={icon} className={c({ [classes.spin]: spin })} /> : null}
      <span children={children} />
    </div>
  );

  return createElement(
    href ? 'a' : component,
    {
      title,
      ...rest,
      ...(href ? { href, target } : { onClick, type }),
      className: c(
        'dydu-button',
        `dydu-button-${variant}`,
        classes.base,
        { [classes.secondary]: secondary },
        classes[variant],
        { [classes.hideOutline]: !tabbing },
        { [classes.grow]: grow },
      ),
      ref: reference,
      disabled,
      id,
    },
    button,
  );
};
