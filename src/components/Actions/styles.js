import { createUseStyles } from 'react-jss';


export default createUseStyles({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > :not(:last-child)': {
      marginRight: '.6em',
    },
  },
});
