import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  field: {
    display: 'block',
    '&:not(:last-child)': {
      marginBottom: '1em',
    },
  },
  fieldCheckbox: {
    alignItems: 'center',
    extend: 'field',
    display: 'flex',
    '& > input[type="checkbox"]': {
      margin: 0,
    },
    '& > input[type="checkbox"] + *': {
      marginLeft: '1em',
    },
  },
  help: {
    marginBottom: '1em',
  },
  input: {
    backgroundColor: theme.palette.primary.light,
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: theme.font.monospace,
    border: 0,
    borderRadius: theme.shape.radius.inner,
    margin: 0,
    padding: '.6em',
    width: '100%',
    '&:not(:first-child)': {
      marginTop: '.5em',
    },
  },
}));
