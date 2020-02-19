import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


/**
 * Form a list of actions within a menu as list elements.
 */
export default function MenuList({ items, onClose, selected }) {

  const classes = useStyles();
  items = items.filter(it => it.when === undefined || it.when);
  selected = typeof selected === 'function' ? selected() : selected;

  const onItemClick = callback => () => {
    if (callback) {
      callback();
      onClose();
    }
  };

  return (
    <ul className={c('dydu-menu-list', classes.root)}>
      {items.map(({ icon, id, onClick, text }, index) => (
        <li className={c(
              'dydu-menu-list-item',
              classes.item,
              onClick ? classes.itemEnabled : classes.itemDisabled,
              {[classes.selected]: selected && selected === id},
            )}
            key={index}
            onClick={onItemClick(onClick)}
            title={text}>
          {!!icon && <img alt={text} className={classes.icon} src={icon} />}
          {text}
        </li>
      ))}
    </ul>
  );
}


MenuList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func,
    text: PropTypes.string.isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};
