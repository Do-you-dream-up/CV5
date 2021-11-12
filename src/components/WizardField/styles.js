import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  field: () => ({
    '& > :not(:first-child)': {
      marginLeft: '1em',
    },
    display: 'flex',
  }),
  input: () => ({
    '& > *': {
      boxSizing: 'border-box',
      display: 'block',
      margin: 0,
      minHeight: 24,
      padding: 0,
    },
    '& input[type="number"], & input[type="text"]': {
      width: '100%',
    },
    '& input[type="number"], & input[type="text"], & textarea': {
      backgroundColor: theme.palette.background.highlight,
      border: 0,
      borderRadius: theme.shape.radius.inner,
      fontFamily: theme.font.monospace,
      padding: '.6em',
    },
    '& textarea': {
      minHeight: '6em',
      resize: 'vertical',
      whiteSpace: 'pre',
      width: '100%',
    },
    flexGrow: 1,
    minWidth: 200,
  }),
  text: () => ({
    lineHeight: '24px',
    minWidth: 140,
    [theme.breakpoints.down('xs')]: {
      minWidth: 100,
    },
  }),
}));
