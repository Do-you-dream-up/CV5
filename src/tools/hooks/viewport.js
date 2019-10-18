import { useEffect, useState } from 'react';


export default function(query) {

  query = query.replace(/^@media( ?)/m, '');
  const hasSupport = !!window.matchMedia;
  const [ match, setMatch ] = useState(() => hasSupport ? window.matchMedia(query).matches : false);

  useEffect(() => {
    if (hasSupport) {
      const queries = window.matchMedia(query);
      const onUpdate = () => setMatch(queries.matches);
      queries.addListener(onUpdate);
      return () => queries.removeListener(onUpdate);
    }
  }, [hasSupport, query]);

  return match;
}
