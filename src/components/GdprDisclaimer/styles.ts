import { createUseStyles } from 'react-jss';

export default createUseStyles({
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    margin: '0 1em 1em 1em',
    height: 35,
    '& $button': {
      width: '50%',
      justifyContent: 'center',
    },
  },
  body: {
    margin: '0 1em 0 1em',
    alignItems: 'center',
    '& p': {
      marginBottom: '20px',
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
    fontSize: 25,
    fontWeight: 'inherit',
  },
  root: {
    overflowY: 'auto',
    display: 'grid',
    height: '100%',
  },
});
