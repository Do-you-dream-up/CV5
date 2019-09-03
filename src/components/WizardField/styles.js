export default {
  field: {
    display: 'flex',
  },
  input: {
    width: '50%',
    '& > *': {
      boxSizing: 'border-box',
      display: 'block',
      margin: 0,
      padding: 0,
    },
    '& input[type="number"], & input[type="text"]': {
      width: '100%',
    },
    '& textarea': {
      resize: 'vertical',
      whiteSpace: 'pre',
      width: '100%',
    },
  },
  root: {
  },
  text: {
    flexBasis: '50%',
  },
};
