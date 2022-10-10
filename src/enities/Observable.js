import { isArray, isEmptyString, isFunction, isString } from '../tools/helpers';

const OBSERVER_PROPERTY = {
  key: 'key',
  callback: 'callback',
};

export class Observable {
  static createObserver = (key, callback) => ({ [OBSERVER_PROPERTY.key]: key, [OBSERVER_PROPERTY.callback]: callback });

  static checkObserverThrowError = (observer = {}) => {
    const isRegular = Object.values(OBSERVER_PROPERTY).every((v) => Object.prototype.hasOwnProperty.call(observer, v));
    if (!isRegular) throw new NoRegularObserverEntityError();

    const observerValues = Object.values(observer);
    const typeCheckList = [(v) => isString(v) && !isEmptyString(v), isFunction];
    const hasCorrectType = observerValues.every((value, index) => {
      const fnTypeCheck = typeCheckList[index];
      return fnTypeCheck(value);
    });
    if (!hasCorrectType) throw new NoRegularObserverEntityError();
  };

  constructor(listObserver = []) {
    this.list = isArray(listObserver) ? listObserver : [];
  }
  isEmpty() {
    return this.list.length === 0;
  }
  add(observer) {
    Observable.checkObserverThrowError(observer);
    this.list.push(observer);
  }
  notify(payload) {
    this.list.forEach((observer) => {
      observer.callback(payload);
    });
  }
  remove(targetKey) {
    const index = this.list.findIndex(({ key }) => key === targetKey);
    if (index > 0) this.list = this.list.splice(index, 1);
  }
  removeAll() {
    this.list = [];
  }
}

class NoRegularObserverEntityError extends Error {
  constructor() {
    super('Error: use Observable.createObserver to create a regular observer');
    this.name = 'NoRegularObserverEntityError';
  }
}
