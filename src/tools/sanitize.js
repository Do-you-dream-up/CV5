export default html => {
  const element = document.createElement('div');
  element.innerHTML = html || '';
  return element.innerHTML;
};
