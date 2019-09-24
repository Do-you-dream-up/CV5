import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';


/**
 * Small wrapper to apply `Element.scrollIntoView` on an element. This feature
 * has known limitations with older Microsoft browsers.
 *
 * Typically you would want to wrap all conversation bubbles with this
 * component.
 */
function Scroll({ component, ...rest }) {

  const elementRef = useRef(null);

  const scroll = () => {
    elementRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  useEffect(() => {
    scroll();
  }, []);

  return React.createElement(component, {...rest, ref: elementRef});
}


Scroll.defaultProps = {
  component: 'div',
};


Scroll.propTypes = {
  component: PropTypes.node,
};


export default Scroll;
