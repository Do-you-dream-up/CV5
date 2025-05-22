import { Local } from './storage';

export const getCss = () => {
  return localStorage.getItem(Local?.names?.css);
};

export const getMain = () => {
  const css = localStorage.getItem(Local?.names?.main);
  if (typeof css === 'string') {
    return JSON.parse(css);
  }
  return null;
};
