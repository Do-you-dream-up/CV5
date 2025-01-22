import { isEmptyArray } from '../helpers';

export default function usePromiseQueue(orderedList) {
  return {
    exec: () => {
      if (isEmptyArray(orderedList)) {
        return Promise.resolve();
      }
      return orderedList
        .reduce((promise, functionInList) => {
          return promise
            .then(() => {
              functionInList && functionInList();
            })
            .catch((e) => console.log('error in promise', e));
        }, Promise.resolve())
        .catch((e) => console.log('error in reduce ', e));
    },
  };
}
