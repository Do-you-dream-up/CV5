import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({

  base: ({ color }) => ({
    alignItems: 'center',
    backgroundColor: 'inherit',
    border: 0,
    color: theme.palette.text.primary,
    cursor: 'pointer',
    display: 'flex',
    outline: 'none',
    padding: 0,
    position: 'relative',
    ...(color && {
      color: theme.palette[color].main,
    }),
    '& > *:not(:first-child)': {
      marginLeft: '.5em',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
    '&:disabled:after': {
      extend: 'overlay',
      backgroundColor: theme.palette.action.disabled,
    },
    '&:not(:disabled):before': {
      extend: 'overlay',
    },
    '&:not(:disabled):hover:before': {
      backgroundColor: theme.palette.action.hover,
    },
  }),

  default: () => ({
    color: theme.palette.primary.main,
    padding: '.5em 1em',
    textTransform: 'uppercase',
    '&, &:after, &:before': {
      borderRadius: 4,
    },
  }),

  filled: ({ color }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.text,
    ...(color && {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].text,
    }),
  }),

  icon: () => ({
    height: 40,
    justifyContent: 'center',
    width: 40,
    '&, &:after, &:before': {
      borderRadius: '50%',
    },
    '& > *': {
      height: 20,
      position: 'absolute',
      width: 20,
    },
  }),

  overlay: {
    bottom: 0,
    content: '""',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));
