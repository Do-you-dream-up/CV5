import Icon from '../Icon/Icon';
import PropTypes from 'prop-types';
import c from 'classnames';
import { isImageUrl } from '../../tools/helpers';
import useStyles from './styles';
import { useTheme } from 'react-jss';

/**
 * Form a list of actions within a menu as list elements.
 */
export default function MenuList({ items, onClose, selected }) {
  const theme = useTheme<Models.Theme>();

  const classes = useStyles();
  items = items.filter((it) => it.when === undefined || it.when);
  selected = typeof selected === 'function' ? selected() : selected;

  const onItemClick = (callback) => () => {
    if (callback) {
      callback();
      onClose();
    }
  };

  const onKeyDown = (callback) => (event) => {
    if (event.keyCode === 13 && callback) {
      callback();
      onClose();
    }
  };

  return (
    <div className={c('dydu-menu-list', classes.root)}>
      {items.map(({ icon, id, onClick, text }, index) => (
        <button
          className={c('dydu-menu-list-item', classes.item, onClick ? classes.itemEnabled : classes.itemDisabled, {
            [classes.selected]: selected && selected === id,
          })}
          key={index}
          onClick={onItemClick(onClick)}
          onKeyDown={onKeyDown(onClick)}
          title={text}
          tabIndex={0}
          autoFocus={index === 0}
        >
          {isImageUrl(icon) ? (
            <img alt={text} className={classes.icon} src={`${process.env.PUBLIC_URL}${icon}`} />
          ) : (
            <Icon
              icon={icon}
              color={theme?.palette?.text?.primary || ''}
              className={classes.icon}
              alt={icon !== 'icon-database' ? icon : ''}
            />
          )}
          {text}
        </button>
      ))}
    </div>
  );
}

MenuList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      onClick: PropTypes.func,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};
