import { createUseStyles } from 'react-jss';

export default createUseStyles({
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    margin: '0 1em 1em 1em',
    '& $button': {
      justifyContent: 'center',
    },
    '& [class*="txt"]': {
      maxHeight: 'none',
    },
    justifyContent: 'center',
  },
  body: {
    margin: '0 1em 0 1em',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
    fontWeight: '400',
    textAlign: 'center',
    margin: '1rem 1rem 0 1rem',
  },
  root: {
    overflowY: 'auto',
    display: 'grid',
    height: '100%',
  },
});
