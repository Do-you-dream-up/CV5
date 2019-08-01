export default () => ({
  'dl, h1, h2, h3, h4, h5, h6, p': {
    '&:first-child': {marginTop: 0},
    '&:last-child': {marginBottom: 0},
  },
  'h1, h2, h3, h4, h5, h6': {
    fontWeight: 'normal',
    textTransform: 'capitalize',
  },
});
