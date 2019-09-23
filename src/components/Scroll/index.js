import React, { useEffect, useRef } from 'react';


/**
 * Small wrapper to apply `Element.scrollIntoView` on an element. This feature
 * has known limitations with older Microsoft browsers.
 *
 * Typically you would want to wrap all conversation bubbles with this
 * component.
 */
export default function Scroll({ ...rest }) {

  const elementRef = useRef(null);

  const scroll = () => {
    elementRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  useEffect(() => {
    scroll();
  }, []);

  return <div {...rest} ref={elementRef} />;
}
