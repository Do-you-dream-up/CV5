import { isEmptyArray } from '../helpers';

export default function usePromiseQueue(orderedList) {
  return {
    exec: () => {
      if (isEmptyArray(orderedList)) {
        return Promise.resolve();
      }
      return orderedList.reduce((promise, functionInList) => {
        return promise.then(() => functionInList && functionInList());
      }, Promise.resolve());
    },
  };
}
