import { createElement, useEffect, useRef } from 'react';

import useDebounce from '../../tools/hooks/debounce';

/**
 * Small wrapper to apply `Element.scrollIntoView` on an element. This feature
 * has known limitations with older Microsoft browsers.
 *
 * Typically you would want to wrap all conversation bubbles with this
 * component.
 */

interface ScrollProps {
  children?: any;
  component?: any;
  delay?: number;
}

function Scroll({ component = 'div', delay = 0, ...rest }: ScrollProps) {
  const elementRef = useRef<any>(null);
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

  return createElement(component, { ...rest, ref: elementRef });
}

export default Scroll;
