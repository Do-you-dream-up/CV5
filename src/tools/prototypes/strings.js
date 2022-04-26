import { b64decode, b64encode } from '../helpers';

String.prototype.contains = function (substr) {
  return this.indexOf(substr) >= 0;
};

String.prototype.toBase64 = function () {
  return b64encode(this);
};

String.prototype.fromBase64 = function () {
  return b64decode(this);
};

String.prototype.equals = function (str) {
  return this.localeCompare(str) === 0;
};
