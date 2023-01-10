import { ReactElement, createElement, useMemo } from 'react';

import Button from '../Button';
import Menu from '../Menu';
import c from 'classnames';
import useStyles from './styles';

/**
 * Render a list of actions.
 *
 * Usually these can take the form of a button list at the bottom of a paper component,
 * or at the top-right of a card component.
 */

interface ActionProps {
  children: ReactElement;
  items: any[] | (() => void);
  selected: string | (() => void);
  type: string;
  when: boolean;
  title?: string;
}

interface ActionsProps {
  actions: ActionProps[];
  className: string;
  targetStyleKey: string;
}

const Actions = ({ actions = [], className, targetStyleKey }: ActionsProps) => {
  const classes = useStyles();
  actions = actions.filter((it) => it.when === undefined || it.when);

  const _classes = useMemo(() => classes[targetStyleKey] || classes.root, [targetStyleKey, classes]);

  return (
    !!actions.length && (
      <div className={c('dydu-actions', _classes, className)}>
        {actions.map(({ items, selected, type = 'button', title, ...rest }, index) =>
          createElement(items ? Menu : Button, {
            key: index,
            ...(items ? { component: Button, items, selected } : { type }),
            ...rest,
            title,
          }),
        )}
      </div>
    )
  );
};

export default Actions;
