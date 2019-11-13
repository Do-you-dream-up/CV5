import { createUseStyles } from 'react-jss';


export default createUseStyles({
  vote: {
    display: 'flex',
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
  },
});
