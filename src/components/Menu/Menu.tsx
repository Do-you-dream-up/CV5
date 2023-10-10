import { CSSProperties, createElement, useEffect, useRef, useState } from 'react';

import MenuList from '../MenuList/MenuList';
import { Portal } from 'react-portal';
import PropTypes from 'prop-types';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useEvent } from '../../contexts/EventsContext';
import useStyles from './styles';
import { useUserAction } from '../../contexts/UserActionContext';

type Visibility = 'visible' | 'hidden' | 'collapse';

interface MenuListPositionParametersState {
  top: number;
  left: number;
  visibility: Visibility;
  maxHeight?: number;
}

/**
 * Create a togglable menu, akin to the right-click contextual menu on various
 * systems. The toggle has to be located in the menu children and its `onClick`
 * property will be overwritten.
 *
 * Expect items as an array of arrays. This is useful to separate actions
 * between categories.
 */
export default function Menu({ component, items, selected, ...rest }) {
  const { configuration } = useConfiguration();
  const [menuListPositionParameters, setmenuListPositionParameters] =
    useState<MenuListPositionParametersState | null>();
  const [open, setOpen] = useState<boolean>(false);
  const { shiftPressed } = useUserAction();
  const { setIsMenuListOpen } = useEvent();
  const anchorRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLInputElement | null>(null);
  let lastFocusedElem = useRef<HTMLInputElement | null>(null);
  const classes = useStyles({ configuration });
  const node = document && configuration && document.getElementById(configuration?.root);
  const spacing: number | undefined = configuration && ~~configuration?.menu?.spacing;
  items = typeof items === 'function' ? items() : items;

  const onClose = () => {
    setIsMenuListOpen?.(false);
    setOpen(false);
  };
  const onKeyDown = (event) => {
    if (
      event.keyCode === 13 ||
      (event.keyCode === 9 && !shiftPressed && lastFocusedElem === menuRef.current?.lastElementChild?.lastElementChild)
    ) {
      closeMenuListAndFocusTextArea(event);
    }
  };

  const closeMenuListAndFocusTextArea = (event) => {
    event.preventDefault();
    setIsMenuListOpen?.(false);
    setOpen(false);
    document.getElementById('dydu-textarea').focus();
  };

  const onBlur = (event) => {
    if (
      !event.currentTarget.contains(event.relatedTarget) &&
      event.target === menuRef.current?.lastElementChild?.firstElementChild
    ) {
      setIsMenuListOpen?.(false);
      setOpen(false);
    }
    lastFocusedElem = event.relatedTarget;
  };

  const onClickOutside = (event) => {
    if (!menuRef.current?.contains(event.target) && !anchorRef.current?.contains(event.target)) {
      setIsMenuListOpen?.(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const onDocumentClick = (event) => {
    if (!anchorRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) {
      setOpen(false);
    }
  };

  const toggle = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const anchor: DOMRect | undefined = anchorRef.current?.getBoundingClientRect();
      const menu: DOMRect | undefined = menuRef.current?.getBoundingClientRect();
      if (anchor && menu && spacing && menuRef.current) {
        const left: number | null | undefined = anchor.left + anchor.width / 2 - menu.width / 2;
        const upwards = window.innerHeight - anchor.y - anchor.height - spacing * 2 < menu.height;
        setmenuListPositionParameters({
          left: Math.max(0, Math.min(left, window.innerWidth - menuRef.current?.offsetWidth - spacing)),
          visibility: 'visible',
          ...(upwards
            ? {
                top: anchor.top - spacing - menu.height,
              }
            : {
                maxHeight: anchor && spacing && anchor.top + window.innerHeight - anchor.bottom - spacing * 2,
                top: anchor.bottom + spacing,
              }),
        });
        setIsMenuListOpen?.(true);
      }
    } else {
      setmenuListPositionParameters(null);
    }
  }, [open, spacing]);

  const menuListPositionParametersCSS: CSSProperties = {
    top: `${menuListPositionParameters?.top}px`,
    left: menuListPositionParameters?.left !== null ? `${menuListPositionParameters?.left}px` : 'unset',
    visibility: menuListPositionParameters?.visibility !== undefined ? menuListPositionParameters?.visibility : 'unset',
    maxHeight:
      menuListPositionParameters?.maxHeight !== undefined ? `${menuListPositionParameters?.maxHeight}px` : 'unset',
  };

  useEffect(() => {
    if (menuListPositionParameters) {
      document.addEventListener('mousedown', onDocumentClick);
    }
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [menuListPositionParameters]);

  return (
    <>
      {createElement(component, {
        onClick: toggle,
        ref: anchorRef,
        ...rest,
      })}
      {open ? (
        <Portal node={node}>
          <div
            className={c('dydu-menu', classes.root)}
            ref={menuRef}
            style={menuListPositionParametersCSS}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          >
            {items.map((it, index) => (
              <MenuList items={it} key={index} onClose={onClose} selected={selected} />
            ))}
          </div>
        </Portal>
      ) : null}
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
