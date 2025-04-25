import { ReactNode, Ref, createElement, forwardRef } from 'react';

import Icon from '../Icon/Icon';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTheme } from 'react-jss';
import { useUserAction } from '../../contexts/UserActionContext';
import { MoreIconWhite } from '../CustomIcons/CustomIcons';

export interface ButtonProps {
  children?: ReactNode;
  color?: 'error' | 'primary' | 'success' | 'warning';
  component?: any;
  grow?: boolean;
  disabled?: boolean;
  id?: string;
  href?: string;
  icon?: string | (() => void);
  onClick?: (() => void) | null | undefined;
  reference?: Ref<any>;
  sidebar?: boolean;
  target?: string;
  title?: string;
  type?: string;
  variant?: 'contained' | 'icon' | 'text';
  rollOver?: string;
  className?: any[];
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
  rollOver,
  color,
  component = 'button',
  grow,
  disabled,
  id,
  href,
  icon: getIcon,
  onClick,
  reference,
  sidebar,
  target = '_blank',
  title,
  type,
  variant = 'contained',
  className,
  ...rest
}: ButtonProps) => {
  const { configuration } = useConfiguration();
  const classes: any = useStyles({ color, configuration });
  const icon = typeof getIcon === 'function' ? getIcon() : getIcon;
  const theme = useTheme<Models.Theme>();

  const button = (
    <div className={classes.children}>
      {icon ? (
        <Icon
          icon={<MoreIconWhite /> || ''}
          className="button-icon"
          color={theme?.palette?.primary.text}
          alt={rollOver}
        />
      ) : null}
      <div className={classes.txt} children={children} />
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
        { [classes.sidebar]: sidebar },
        classes[variant],
        { [classes.grow]: grow },
        className,
      ),
      ref: reference,
      disabled,
      id,
    },
    button,
  );
};
