import { createUseStyles } from 'react-jss';

export default createUseStyles({
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    margin: '1em 1em 1em 0',
  },
  body: {
    margin: '.7em',
  },
  root: {
    overflowY: 'auto',
  },
});
