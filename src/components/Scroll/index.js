import { createElement, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
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
  const debouncedReady = useDebounce(elementRef, delay);

  const scroll = () => {
    setTimeout(() => {
      const chatboxDiv = document.querySelector('.dydu-chatbox-body');
      if (chatboxDiv) {
        chatboxDiv.scrollTop = chatboxDiv?.scrollHeight;
      }
    }, delay);
  };

  useEffect(() => {
    if (debouncedReady) {
      scroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReady]);

  return createElement(component, { ...rest, ref: elementRef, 'data-testid': 'Scroll' });
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
