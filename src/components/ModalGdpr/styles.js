import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  input: {
    backgroundColor: theme.palette.primary.light,
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: 'monospace',
    border: 0,
    borderRadius: theme.shape.borderRadius,
    margin: 0,
    padding: '.6em',
    width: '100%',
    '&:not(:first-child)': {
      marginTop: '.5em',
    },
  },
  root: {
    '& > :not(:last-child)': {
      display: 'block',
      marginBottom: '1em',
    },
  },
}));
