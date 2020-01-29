import { createUseStyles } from 'react-jss';


export default createUseStyles({
  root: {
    display: 'flex',
    '& > :not(:last-child)': {
      marginRight: '.8em',
    },
  },
});
