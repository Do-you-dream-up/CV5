import { useCallback, useEffect, useState } from 'react';

import { isEmptyArray } from '../helpers';

export default function usePromiseQueue(orderedList = [], hasAfterLoadBeenCalled) {
  const [queue, setQueue] = useState(orderedList);
  const [unqueue, setUnqueue] = useState(false);

  useEffect(() => {
    if (!hasAfterLoadBeenCalled || isEmptyArray(queue) || !unqueue) return;
    const q = queue.slice();
    const fn = q.shift();
    fn?.().then(() => setQueue(q));
    if (q.length === 0) setUnqueue(false);
  }, [unqueue, queue, hasAfterLoadBeenCalled]);

  const exec = useCallback(() => setUnqueue(true), []);

  const forceExec = useCallback(() => {
    setQueue(orderedList);
    setUnqueue(true);
  }, [orderedList]);

  return {
    exec,
    forceExec,
  };
}
