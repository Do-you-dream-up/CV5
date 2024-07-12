import { createElement, useEffect, useRef, useState } from 'react';

import useDebounce from '../../tools/hooks/debounce';
import { useShadow } from '../../contexts/ShadowProvider';

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
  scrollToBottom?: boolean;
  className?: string;
}

function Scroll({ component = 'div', delay = 0, scrollToBottom = false, ...rest }: ScrollProps) {
  const elementRef = useRef<any>(null);
  const debouncedReady = useDebounce(elementRef, delay);
  const { shadowAnchor } = useShadow();
  const [scrollDone, setScrollDone] = useState<boolean>(false);

  const scroll = () => {
    setTimeout(() => {
      const chatboxDiv = shadowAnchor?.querySelector('.dydu-chatbox-body');
      if (chatboxDiv) {
        const responseBubbles = shadowAnchor?.getElementsByClassName('dydu-interaction-response');
        const requestBubbles = shadowAnchor?.getElementsByClassName('dydu-interaction-request');
        const lastRequestBubble: Element | null | undefined = requestBubbles?.item(requestBubbles?.length - 1);
        const lastResponseBubble: Element | null | undefined = responseBubbles?.item(responseBubbles?.length - 1);

        if (scrollToBottom) {
          chatboxDiv.scrollTop = chatboxDiv?.scrollHeight;
        } else {
          chatboxDiv.scrollTop =
            chatboxDiv?.scrollHeight -
            (lastResponseBubble ? lastResponseBubble.scrollHeight + (lastRequestBubble?.scrollHeight || 0) : 0);
        }
      }
    }, delay);
  };

  useEffect(() => {
    if (debouncedReady && !scrollDone) {
      scroll();
      setScrollDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedReady]);

  return createElement(component, { ...rest, ref: elementRef, 'data-testid': 'Scroll' });
}

export default Scroll;
