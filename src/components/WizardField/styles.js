import { createUseStyles } from 'react-jss';


export default createUseStyles({
  field: {
    display: 'flex',
    '& > :not(:first-child)': {
      marginLeft: '1em',
    },
  },
  input: {
    flexGrow: 1,
    '& > *': {
      boxSizing: 'border-box',
      display: 'block',
      margin: 0,
      minHeight: 24,
      padding: 0,
    },
    '& input[type="number"], & input[type="text"], & textarea': {
      fontFamily: 'monospace',
      minWidth: 200,
    },
    '& input[type="number"], & input[type="text"]': {
      width: '100%',
    },
    '& textarea': {
      minHeight: '6em',
      resize: 'vertical',
      whiteSpace: 'pre',
      width: '100%',
    },
  },
  text: {
    minWidth: 140,
  },
});
