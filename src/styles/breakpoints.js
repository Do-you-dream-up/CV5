const KEYS = ['xs', 'sm', 'md', 'lg', 'xl'];
const UNIT = 'px';
const VALUES = { lg: 1280, md: 960, sm: 600, xl: 1920, xs: 0 };

const between = (start, end) => {
  const next = KEYS.indexOf(end) + 1;
  if (next === KEYS.length) {
    return up(start);
  }
  const left = typeof VALUES[start] === 'number' ? VALUES[start] : start;
  const right =
    typeof VALUES[KEYS[next]] === 'number' && next
      ? VALUES[KEYS[next]] - 1
      : end;
  return `@media (min-width: ${~~left}${UNIT}) and (max-width: ${~~right}${UNIT})`;
};

const down = (value) => {
  const next = KEYS.indexOf(value) + 1;
  if (next === KEYS.length) {
    return up(VALUES[0]);
  }
  const right =
    typeof VALUES[KEYS[next]] === 'number' && next
      ? VALUES[KEYS[next]] - 1
      : value;
  return `@media (max-width: ${~~right}${UNIT})`;
};

const only = (value) => {
  return between(value, value);
};

const up = (value) => {
  const left = typeof VALUES[value] === 'number' ? VALUES[value] : value;
  return `@media (min-width: ${~~left}${UNIT})`;
};

const width = (key) => {
  return VALUES[key];
};

export default {
  between,
  down,
  keys: KEYS,
  only,
  up,
  values: VALUES,
  width,
};
