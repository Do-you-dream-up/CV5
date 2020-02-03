import useStyles from './styles';
import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';


/**
 * Form a list of actions within a menu as list elements.
 */
export default function MenuList({ items, onClose, selected }) {

  const classes = useStyles();
  selected = typeof selected === 'function' ? selected() : selected;

  const onItemClick = callback => () => {
    if (callback) {
      callback();
      onClose();
    }
  };

  return (
    <ul className={c('dydu-menu-list', classes.root)}>
      {items.map(({ id, onClick, text }, index) => (
        <li children={text}
            className={c(
              'dydu-menu-list-item',
              classes.item,
              onClick ? classes.itemEnabled : classes.itemDisabled,
              {[classes.selected]: selected && selected === id},
            )}
            key={index}
            onClick={onItemClick(onClick)} />
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
