import { isEmptyArray } from '../helpers';

export default new (class PromiseQueue {
  exec(orderedList: [Promise<any>]): Promise<any> {
    if (isEmptyArray(orderedList)) {
      return Promise.resolve();
    }
    const nextFunctionToExecute = orderedList[0];

    return nextFunctionToExecute().then(() => {
      const remainingList = orderedList.slice(1);
      return this.exec(remainingList);
    });
  }
})();
