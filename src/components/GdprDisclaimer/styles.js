import { createUseStyles } from 'react-jss';


export default createUseStyles({
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    marginTop: '1em',
  },
  root: {
    margin: '.7em'
  },
});
