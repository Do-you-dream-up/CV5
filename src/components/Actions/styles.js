import { createUseStyles } from 'react-jss';


export default createUseStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    '&:not(:first-child)': {
      marginTop: '.7em',
    },
    '& > *': {
      marginTop: '.7em',
    },
    '& > :not(:first-child)': {
      marginLeft: '.7em',
    },
  },
});
