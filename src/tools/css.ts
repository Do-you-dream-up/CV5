export const getCss = () => {
  const css = localStorage.getItem('dydu.css');
  if (typeof css === 'string') {
    return JSON.parse(css);
  }
  return null;
};
