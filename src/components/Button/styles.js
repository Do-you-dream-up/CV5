import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({

  base: {
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    border: 0,
    cursor: 'pointer',
    display: 'flex',
    outline: 'none',
    padding: 0,
    '& > *:not(:first-child)': {
      marginLeft: '.5em',
    },
    '&:disabled': {
      backgroundColor: theme.palette.action.disabled,
      cursor: 'not-allowed',
    },
  },

  default: {
    borderRadius: 4,
    color: theme.palette.primary.text,
    padding: '.5em 1em',
    textTransform: 'uppercase',
    '&:hover:not(:disabled)': {backgroundColor: theme.palette.primary.dark},
  },

  flat: {
    background: 0,
    color: theme.palette.text.primary,
    '&:hover:not(:disabled)': {backgroundColor: theme.palette.action.hover},
  },

  icon: {
    borderRadius: '50%',
    height: 40,
    justifyContent: 'center',
    width: 40,
    '&:hover:not(:disabled)': {backgroundColor: theme.palette.action.hover},
    '& img': {height: 20, width: 20},
  },
}));
