import { useCallback, useMemo, useState } from 'react';

export default function useQueue(initialList = []) {
  const [list, setList] = useState(initialList);

  const put = useCallback((item) => {
    setList((_list) => {
      _list.splice(0, 1, item);
      return _list;
    });
  }, []);

  const pop = useCallback(() => {
    const _list = list.slice();
    setList((_list) => _list.slice(1));
    return _list[0];
  }, [list]);

  const isEmpty = useMemo(() => list.length === 0, [list]);

  return {
    put,
    pop,
    list,
    isEmpty,
  };
}
