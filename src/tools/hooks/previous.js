import { useEffect, useRef } from 'react';


export default function usePrevious(value) {

  const ref = useRef(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
