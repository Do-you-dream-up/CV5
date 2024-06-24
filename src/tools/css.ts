export const getCss = () => {
  return localStorage.getItem('dydu.css');
};

export const getMain = () => {
  const css = localStorage.getItem('dydu.main');
  if (typeof css === 'string') {
    return JSON.parse(css);
  }
  return null;
};
