import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DragonProvider } from '../../contexts/DragonContext';
import useEvent from '../../tools/hooks/event';


/**
 * Wrapper to enable dragging on other components.
 *
 * This works by capturing the delta of the pointer position and applying a
 * `translate3d` CSS property.
 */
export default function Dragon({ children, component, ...rest }) {

  const { active, factor=0 } = useContext(ConfigurationContext).configuration.dragon;
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
      setOffset({x, y});
    }
  };

  const onDragEnd = () => {
    setCurrent(previous => ({x: previous.x + offset.x, y: previous.y + offset.y}));
    setMoving(false);
    setOffset({x: 0, y: 0});
    setOrigin(null);
  };

  const onDragStart = event => {
    setMoving(true);
    setOrigin({x: event.clientX + offset.x, y: event.clientY + offset.y});
  };

  const onReset = useCallback(() => {
    setCurrent({x: 0, y: 0});
    setOffset({x: 0, y: 0});
  }, []);

  useEffect(() => {
    onReset();
  }, [onReset]);

  useEvent('mousemove', onDrag);
  useEvent('mouseup', onDragEnd);

  return !!current && (
    <DragonProvider onDrag={onDrag} onDragEnd={onDragEnd} onDragStart={active ? onDragStart : null}>
      {React.createElement(component, {...rest, style: {
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
