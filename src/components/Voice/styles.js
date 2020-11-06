import { createUseStyles } from 'react-jss';


// eslint-disable-next-line no-unused-vars
export default createUseStyles( theme => ({

  actions: () => ({
    '& > *': {
      marginLeft: '.5em',
    },
    alignItems: 'center',
    display: 'flex',
  }),
}));
