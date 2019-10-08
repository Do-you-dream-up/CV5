import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


/**
 * Form a list of actions within a menu as list elements.
 */
export default function MenuList({ items, onClose }) {

  const classes = useStyles();

  const onItemClick = callback => () => {
    if (callback) {
      callback();
      onClose();
    }
  };

  return (
    <ul className={classNames('dydu-menu-list', classes.root)}>
      {items.map((it, index) => (
        <li children={it.text}
            className={classNames(
              'dydu-menu-list-item',
              classes.item,
              it.onClick ? classes.itemEnabled : classes.itemDisabled
            )}
            key={index}
            onClick={onItemClick(it.onClick)} />
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
};
