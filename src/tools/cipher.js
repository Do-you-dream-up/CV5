import { Base64 } from 'js-base64';


/**
 * Deep-apply manipulator onto data.
 *
 * @param {*} data - Parameter description.
 * @param {function} manipulator - Function to transform with.
 * @returns {*} The transformed data.
 */
const transform = (data, manipulator) => {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = transform(data[i], manipulator);
    }
  }
  else if (typeof data === 'object') {
    for (let key in data) {
      data[key] = transform(data[key], manipulator);
    }
  }
  else if (typeof data === 'string') {
    return manipulator(data);
  }
  return data;
};


export const decode = data => transform(data, Base64.decode);
export const encode = data => transform(data, Base64.encode);
