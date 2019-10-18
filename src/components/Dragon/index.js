import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DragonProvider } from '../../contexts/DragonContext';
import useEvent from '../../tools/hooks/event';
import { Local } from '../../tools/storage';


/**
 * Wrapper to enable dragging on other components.
 *
 * This works by capturing the delta of the pointer position and applying a
 * `translate3d` CSS property.
 */
export default function Dragon({ children, component, ...rest }) {

  const root = useRef(null);
  const { configuration } = useContext(ConfigurationContext);
  const { active, boundaries: withBoundaries, factor: defaultFactor=1, persist } = configuration.dragon;
  const factor = Math.max(defaultFactor, 1);
  const [ boundaries, setBoundaries ] = useState(null);
  const [ current, setCurrent ] = useState(null);
  const [ offset, setOffset ] = useState(null);
  const [ origin, setOrigin ] = useState(null);
  const [ moving, setMoving ] = useState(false);

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
        let { bottom, left, right, top } = boundaries;
        x = Math.min(Math.max(x, -left), right);
        y = Math.min(Math.max(y, -top), bottom);
      }
      setOffset({x, y});
    }
  };

  const onDragEnd = () => {
    setCurrent(previous => ({x: previous.x + offset.x, y: previous.y + offset.y}));
    setMoving(false);
    setOffset({x: 0, y: 0});
    setOrigin(null);
  };

  const onDragStart = element => event => {
    if (element.current === event.target) {
      let { bottom, left, right, top } = root.current.getBoundingClientRect();
      setBoundaries({bottom: window.innerHeight - bottom, left, right: window.innerWidth - right, top});
      setMoving(true);
      setOrigin({x: event.clientX + offset.x, y: event.clientY + offset.y});
    }
  };

  const onReset = useCallback(({ x=0, y=0 }) => {
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

  return !!current && (
    <DragonProvider onDrag={onDrag} onDragEnd={onDragEnd} onDragStart={active ? onDragStart : null}>
      {React.createElement(component, {...rest, ref: root, style: {
        transform: `translate3d(${current.x + offset.x}px, ${current.y + offset.y}px, 0)`,
      }})}
    </DragonProvider>
  );
}


Dragon.defaultProps = {
  component: 'div',
};


Dragon.propTypes = {
  children: PropTypes.element,
  component: PropTypes.elementType.isRequired,
};