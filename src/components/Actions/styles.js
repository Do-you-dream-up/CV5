import { createUseStyles } from 'react-jss';


export default createUseStyles({
  root: {
    '& > :not(:last-child)': {
      marginRight: '.1em',
    },
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
