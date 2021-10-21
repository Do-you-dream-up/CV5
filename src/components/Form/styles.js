import { createUseStyles } from 'react-jss';

export default createUseStyles({
  actions: {
    '&:not(:first-child)': {
      marginTop: '1em',
    },
  },
  body: {
    '& > :not(:last-child)': {
      marginBottom: '.5em',
    },
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    width: '100%',
  },
});
