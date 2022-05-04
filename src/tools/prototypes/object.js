import { recursiveBase64DecodeString } from '../helpers';

Object.prototype.recursiveBase64DecodeString = function () {
  return recursiveBase64DecodeString(this, Object.keys(this || {}), {});
};
