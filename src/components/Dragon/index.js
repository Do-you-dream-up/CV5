import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'react-jss';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DragonProvider } from '../../contexts/DragonContext';
import useEvent from '../../tools/hooks/event';
import useViewport from '../../tools/hooks/viewport';
import { Local } from '../../tools/storage';


/**
 * Wrapper to enable dragging on other components.
 *
 * This works by capturing the delta of the pointer position and applying a
 * `translate3d` CSS property.
 */
export default function Dragon({ children, component, reset, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const { boundaries: withBoundaries, factor: defaultFactor = 1, persist } = configuration.dragon;
  const factor = Math.max(defaultFactor, 1);
  const root = useRef(null);
  const [ boundaries, setBoundaries ] = useState(null);
  const [ current, setCurrent ] = useState(null);
  const [ offset, setOffset ] = useState(null);
  const [ origin, setOrigin ] = useState(null);
  const [ moving, setMoving ] = useState(false);
  const theme = useTheme();
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const active = !reset && configuration.dragon.active && !isMobile;

  const onDrag = event => {
    if (moving && origin) {
      event.preventDefault();
      let x = event.clientX - origin.x;
      let y = event.clientY - origin.y;
      if (factor > 1) {
        x = Math.round(x / factor) * factor;
        y = Math.round(y / factor) * factor;
      }
      if (withBoundaries) {
        const { bottom, left, right, top } = boundaries;
        x = Math.min(Math.max(x, -left), right);
        y = Math.min(Math.max(y, -top), bottom);
      }
      setOffset({x, y});
    }
  };

  const onDragEnd = () => {
    root.current.style.transitionDuration = '';
    setCurrent(previous => ({x: previous.x + offset.x, y: previous.y + offset.y}));
    setMoving(false);
    setOffset({x: 0, y: 0});
    setOrigin(null);
  };

  const onDragStart = element => event => {
    if (element.current === event.target) {
      root.current.style.transitionDuration = '0s';
      let { bottom, left, right, top } = root.current.getBoundingClientRect();
      setBoundaries({bottom: window.innerHeight - bottom, left, right: window.innerWidth - right, top});
      setMoving(true);
      setOrigin({x: event.clientX + offset.x, y: event.clientY + offset.y});
    }
  };

  const onReset = useCallback(({ x = 0, y = 0 }) => {
    setCurrent({x, y});
    setOffset({x: 0, y: 0});
  }, []);

  useEffect(() => {
    if (current && persist) {
      Local.set(Local.names.dragon, current);
    }
  }, [current, persist]);

  useEffect(() => {
    const { x, y } = persist ? Local.get(Local.names.dragon) || {} : {x: 0, y: 0};
    onReset({x, y});
  }, [onReset, persist]);

  useEvent('mousemove', onDrag);
  useEvent('mouseup', onDragEnd);

  const transform = (
    !!current && !reset
      ? `translate3d(${current.x + offset.x}px, ${current.y + offset.y}px, 0)`
      : 'translate3d(0, 0, 0)'
  );
  return !!current && (
    <DragonProvider onDrag={onDrag} onDragEnd={onDragEnd} onDragStart={active ? onDragStart : null}>
      {React.createElement(component, {...rest, root, style: {transform}})}
    </DragonProvider>
  );
}


Dragon.defaultProps = {
  component: 'div',
};


Dragon.propTypes = {
  children: PropTypes.element,
  component: PropTypes.elementType.isRequired,
  reset: PropTypes.bool,
};
