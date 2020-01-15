import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Portal } from 'react-portal';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import MenuList from '../MenuList';
import useStyles from './styles';


/**
 * Create a togglable menu, akin to the right-click contextual menu on various
 * systems. The toggle has to be located in the menu children and its `onClick`
 * property will be overwritten.
 *
 * Expect items as an array of arrays. This is useful to separate actions
 * between categories.
 */
export default function Menu({ component, items, selected, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const [ geometry, setGeometry ] = useState(null);
  const [ open, setOpen ] = useState(false);
  const anchorRef = useRef(null);
  const menuRef = useRef(null);
  const node = document && document.getElementById(configuration.root);
  const spacing = ~~configuration.menu.spacing;
  items = typeof items === 'function' ? items() : items;

  const onClose = () => setOpen(false);

  const onDocumentClick = event => {
    if (!anchorRef.current.contains(event.target) && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const toggle = value => () => {
    value = value === undefined ? !open : value;
    return value ? setOpen(true) : setOpen(false);
  };

  useEffect(() => {
    if (open) {
      const element = anchorRef.current.getBoundingClientRect();
      const left = element.left + element.width / 2 - menuRef.current.offsetWidth / 2;
      setGeometry({
        left: Math.max(0, Math.min(left, window.innerWidth - menuRef.current.offsetWidth - spacing)),
        maxHeight: window.innerHeight - element.bottom - spacing * 2,
        top: element.bottom + spacing,
        visibility: 'visible',
      });
    }
    else {
      setGeometry(null);
    }
  }, [open, spacing]);


  useEffect(() => {
    if (geometry) {
      document.addEventListener('mousedown', onDocumentClick);
    }
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [geometry]);

  return (
    <>
      {React.createElement(component, {onClick: toggle(), ref: anchorRef, ...rest})}
      {open && (
        <Portal node={node}>
          <div className={c('dydu-menu', classes.root)} ref={menuRef} style={geometry}>
            {items.map((it, index) => (
              <MenuList items={it} key={index} onClose={onClose} selected={selected} />
            ))}
          </div>
        </Portal>
      )}
    </>
  );
}


Menu.defaultProps = {
  component: 'div',
};

Menu.propTypes = {
  component: PropTypes.elementType,
  items: PropTypes.oneOfType([PropTypes.func, PropTypes.array]).isRequired,
  selected: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};
