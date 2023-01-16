import Button, { ButtonProps } from '../Button/Button';

import Menu from '../Menu';
import { ReactNode } from 'react';
import c from 'classnames';
import { useMemo } from 'react';
import useStyles from './styles';

/**
 * Render a list of actions.
 *
 * Usually these can take the form of a button list at the bottom of a paper component,
 * or at the top-right of a card component.
 */

export interface ActionProps {
  children?: ReactNode | null;
  items?: any;
  selected?: string | (() => void);
  type?: any;
  when?: boolean;
  disabled?: boolean;
  variant?: 'contained' | 'icon' | 'text';
  secondary?: boolean;
  spin?: boolean;
  href?: string;
  key?: string | number;
  id?: string;
  title?: string;
  icon?: string;
  component?: any;
  onClick?: () => void;
}

interface ActionsProps {
  actions: ActionProps[];
  className?: string;
  targetStyleKey?: string;
}

const Actions = ({ actions = [], className, targetStyleKey }: ActionsProps) => {
  const classes = useStyles();

  const filteredActions = useMemo(() => actions.filter((it) => it.when === undefined || it.when), [actions]);

  const _classes = useMemo(
    () => (targetStyleKey && classes[targetStyleKey]) || classes.root,
    [targetStyleKey, classes],
  );

  return actions?.length > 0 ? (
    <div className={c('dydu-actions', _classes, className)}>
      {filteredActions.map(({ items, selected, type = 'button', title, ...rest }, index) => {
        delete rest.when;

        const props: ButtonProps = {
          key: index,
          ...rest,
          title,
          type,
        };

        if (items) {
          return <Menu {...props} component={Button} items={items} selected={selected} />;
        }
        return <Button {...props} />;
      })}
    </div>
  ) : null;
};

export default Actions;
