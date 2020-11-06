import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import useDebounce from '../../tools/hooks/debounce';


/**
 * Small wrapper to apply `Element.scrollIntoView` on an element. This feature
 * has known limitations with older Microsoft browsers.
 *
 * Typically you would want to wrap all conversation bubbles with this
 * component.
 */
function Scroll({ component, delay, ...rest }) {

  const elementRef = useRef(null);
  const [ ready, setReady] = useState(false);
  const debouncedReady = useDebounce(ready, delay);

  const scroll = () => {
    elementRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  useEffect(() => {
    if (debouncedReady) {
      scroll();
    }
  }, [debouncedReady]);

  useEffect(() => {
    setReady(true);
  }, []);

  return React.createElement(component, {...rest, ref: elementRef});
}


Scroll.defaultProps = {
  component: 'div',
  delay: 0,
};


Scroll.propTypes = {
  component: PropTypes.elementType,
  delay: PropTypes.number,
};


export default Scroll;
