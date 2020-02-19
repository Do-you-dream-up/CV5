import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../Button';
import Menu from '../Menu';
import useStyles from './styles';


/**
 * Render a list of actions.
 *
 * Usually these can take the form of a button list at the bottom of a paper component,
 * or at the top-right of a card component.
 */
export default function Actions({ actions, className }) {
  const classes = useStyles();
  actions = actions.filter(it => it.when === undefined || it.when);
  return !!actions.length && (
    <div className={c('dydu-actions', classes.root, className)}>
      {actions.map(({ items, selected, type = 'button', when, ...rest }, index) => (
        React.createElement(items ? Menu : Button, {
          key: index,
          ...(items ? {component: Button, items, selected} : {type}),
          ...rest,
        })
      ))}
    </div>
  );
}


Actions.defaultProps = {
  actions: [],
};


Actions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    children: PropTypes.any,
    items: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    selected: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    type: PropTypes.string,
    when: PropTypes.bool,
  })),
  className: PropTypes.string,
};
