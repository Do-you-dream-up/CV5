import { createUseStyles } from 'react-jss';


export default createUseStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    '& > :not(:first-child)': {
      marginLeft: '.7em',
    },
  },
});
