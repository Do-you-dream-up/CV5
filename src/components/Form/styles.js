import { createUseStyles } from 'react-jss';


export default createUseStyles({
  actions: {
    '&:not(:first-child)': {
      marginTop: '1em',
    },
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    '& > :not(:last-child)': {
      marginBottom: '.5em',
    },
  },
  root: {
    width: '100%',
  },
});
