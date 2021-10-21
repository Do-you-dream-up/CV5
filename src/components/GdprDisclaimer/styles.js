import { createUseStyles } from 'react-jss';

export default createUseStyles({
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    margin: '.7em',
    marginTop: '1em',
  },
  root: {
    '& > .dydu-gdpr-disclaimer-body': {
      margin: '.7em',
    },
    overflow: 'auto',
  },
});
