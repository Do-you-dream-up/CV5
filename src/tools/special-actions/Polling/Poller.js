import { isDefined } from '../../helpers';

export default class Poller {
  #serverRequestAction = null;
  #conditionStart = null;
  #conditionStop = null;
  #timeoutMs = null;
  #onResponse = null;
  #onResponseError = null;
  #intervalRef = null;
  #postStopAction = null;

  constructor() {}

  configure = ({
    conditionStart = null,
    conditionStop = null,
    timeoutMs = null,
    onResponse = null,
    onResponseError = null,
    serverRequestAction = null,
    postStopAction = null,
  }) => {
    this.#conditionStart = conditionStart;
    this.#conditionStop = conditionStop;
    this.#timeoutMs = timeoutMs;
    this.#onResponse = onResponse;
    this.#onResponseError = onResponseError;
    this.#serverRequestAction = serverRequestAction;
    this.#postStopAction = postStopAction;
    this.#checkMissingAttributes();
    return this;
  };

  run = () => {
    this.#checkMissingAttributes();
    if (this.#conditionStart() && !this.isRunning()) this.#start();
  };

  isRunning() {
    return isDefined(this.#intervalRef);
  }

  #stop() {
    if (this.isRunning()) {
      clearInterval(this.#intervalRef);
      if (isDefined(this.#postStopAction)) this.#postStopAction();
    }
  }

  #checkMissingAttributes() {
    if (this.#getAttributeList().filter((a) => !isDefined(a)).length > 0) Poller.#errorMissingAttributes();
  }

  static #errorMissingAttributes() {
    throw new Error(
      'Missing required Attributes. Poller requires attributes : { conditionStart, conditionStop, timeoutMs, onResponse, onResponseError, serverRequestAction } !',
    );
  }

  #flushAttributes() {
    this.#serverRequestAction = null;
    this.#conditionStart = null;
    this.#conditionStop = null;
    this.#timeoutMs = null;
    this.#onResponse = null;
    this.#onResponseError = null;
    this.#intervalRef = null;
    this.#postStopAction = null;
  }

  #start() {
    if (this.isRunning()) return;

    this.#intervalRef = setInterval(() => {
      this.#serverRequestAction()
        .then((response) => {
          this.#onResponse(response);
          if (this.#conditionStop(response)) return this.#stop();
        })
        .catch(this.#onResponseError);
    }, this.#timeoutMs);
  }

  #getAttributeList() {
    return [
      this.#conditionStart,
      this.#conditionStop,
      this.#timeoutMs,
      this.#onResponse,
      this.#serverRequestAction,
      this.#onResponseError,
    ];
  }
}
