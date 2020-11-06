const KEYS = ['xs', 'sm', 'md', 'lg', 'xl'];
const UNIT = 'px';
const VALUES = {xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920};


const between = (start, end) => {
  const next = KEYS.indexOf(end) + 1;
  if (next === KEYS.length) {
    return up(start);
  }
  const left = typeof VALUES[start] === 'number' ? VALUES[start] : start;
  const right = typeof VALUES[KEYS[next]] === 'number' && next ? VALUES[KEYS[next]] - 1 : end;
  return `@media (min-width: ${~~left}${UNIT}) and (max-width: ${~~right}${UNIT})`;
};


const down = value => {
  const next = KEYS.indexOf(value) + 1;
  if (next === KEYS.length) {
    return up(VALUES[0]);
  }
  const right = typeof VALUES[KEYS[next]] === 'number' && next ? VALUES[KEYS[next]] - 1 : value;
  return `@media (max-width: ${~~right}${UNIT})`;
};


const only = value => {
  return between(value, value);
};


const up = value => {
  const left = typeof VALUES[value] === 'number' ? VALUES[value] : value;
  return `@media (min-width: ${~~left}${UNIT})`;
};


const width = key => {
  return VALUES[key];
};


export default {
  keys: KEYS,
  values: VALUES,
  between,
  down,
  only,
  up,
  width,
};
