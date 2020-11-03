import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  field: {
    '&:not(:last-child)': {
      marginBottom: '1em',
    },
    display: 'block',
  },
  fieldCheckbox: {
    '& > input[type="checkbox"]': {
      margin: 0,
    },
    '& > input[type="checkbox"] + *': {
      marginLeft: '1em',
    },
    alignItems: 'center',
    display: 'flex',
    extend: 'field',
  },
  input: {
    '&:not(:first-child)': {
      marginTop: '.5em',
    },
    backgroundColor: theme.palette.primary.light,
    border: 0,
    borderRadius: theme.shape.radius.inner,
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: theme.font.monospace,
    margin: 0,
    padding: '.6em',
    width: '100%',
  },
}));
