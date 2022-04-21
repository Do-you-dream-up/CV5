import { createUseStyles } from 'react-jss';

export default createUseStyles({
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    margin: '1em',
    '& $button': {
      width: '50%',
      justifyContent: 'center',
    },
  },
  body: {
    margin: '1em',
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
  },
  root: {
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
});
