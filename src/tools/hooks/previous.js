import { useEffect, useRef } from 'react';


export default function(value) {

  const ref = useRef(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
