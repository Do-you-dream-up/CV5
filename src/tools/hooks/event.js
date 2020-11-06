import { useEffect, useRef } from 'react';


export default function(event, handler, element = window) {

  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = event => savedHandler.current(event);
    element.addEventListener(event, listener);
    return () => element.removeEventListener(event, listener);
  }, [element, event]);
}
