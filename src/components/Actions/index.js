import React, { useMemo } from 'react';

import Button from '../Button';
import Menu from '../Menu';
import PropTypes from 'prop-types';
import c from 'classnames';
import useStyles from './styles';

/**
 * Render a list of actions.
 *
 * Usually these can take the form of a button list at the bottom of a paper component,
 * or at the top-right of a card component.
 */
export default function Actions({ actions, className, targetStyleKey }) {
  const classes = useStyles();
  actions = actions.filter((it) => it.when === undefined || it.when);

  const _classes = useMemo(() => classes[targetStyleKey] || classes.root, [targetStyleKey, classes]);

  return (
    !!actions.length && (
      <div className={c('dydu-actions', _classes, className)}>
        {actions.map(({ items, selected, type = 'button', title, ...rest }, index) =>
          React.createElement(items ? Menu : Button, {
            key: index,
            ...(items ? { component: Button, items, selected } : { type }),
            ...rest,
            title,
          }),
        )}
      </div>
    )
  );
}

Actions.defaultProps = {
  actions: [],
};

Actions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.any,
      items: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
      selected: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      type: PropTypes.string,
      when: PropTypes.bool,
    }),
  ),
  className: PropTypes.string,
  targetStyleKey: PropTypes.string,
};
