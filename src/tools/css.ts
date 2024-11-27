import { Local } from './storage';

export const getCss = () => {
  return localStorage.getItem(Local?.names?.dydu_chatbox_css);
};

export const getMain = () => {
  const css = localStorage.getItem(Local?.names?.dydu_chatbox_main);
  if (typeof css === 'string') {
    return JSON.parse(css);
  }
  return null;
};
