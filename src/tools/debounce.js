import { useEffect, useState } from 'react';


export default function useDebounce(it, delay) {

  const [ value, setValue ] = useState(it);

  useEffect(() => {
    const handler = setTimeout(() => setValue(it), delay);
    return () => clearTimeout(handler);
  }, [delay, it]);

  return value;
}
