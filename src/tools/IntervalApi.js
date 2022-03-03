import { isDefined } from './helpers';

export default class IntervalApi {
  #id = null;
  #ref = null;
  #callbackFn = null;
  #timeoutMs = null;

  constructor(callback, timeoutMs, id) {
    this.#callbackFn = callback;
    this.#id = id;
    this.#timeoutMs = timeoutMs;
  }

  getId = () => this.#id;
  cmpId = (val) => this.#id === val;
  isSetId = () => isDefined(this.#id);
  setCallbackFn = (fn) => (this.#callbackFn = fn);
  setTimeoutMs = (ms) => this.#timeoutMs(ms);
  isRunning = () => isDefined(this.#ref);
  isReadyToRun = () => isDefined(this.#id) && isDefined(this.#timeoutMs) && isDefined(this.#callbackFn);

  configure = ({ callbackFn, timeoutMs, id }) => {
    this.#id = id;
    this.#callbackFn = callbackFn;
    this.#timeoutMs = timeoutMs;
  };

  run = (callbackFn) => {
    if (!this.isRunning()) this.#ref = setInterval(this.#callbackFn || callbackFn, this.#timeoutMs);
  };

  stopAndClear = () => {
    this.stop();
    this.clear();
  };

  stop = () => {
    if (this.isRunning()) clearInterval(this.#ref);
  };

  clear = () => {
    this.#id = null;
    this.#ref = null;
    this.#callbackFn = null;
    this.#timeoutMs = null;
  };
}
