import { createUseStyles } from 'react-jss';

export default createUseStyles({
  root: {
    '& > :not(:last-child)': {
      marginRight: '.6em',
    },
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  arrowButtonRight: {
    '& .dydu-button-icon': {
      width: '30px',
      height: '30px',
    },
    bottom: 0,
    width: '30px',
    height: '30px',
    position: 'absolute',
    marginTop: '0.5em',
    right: 0,
  },
  arrowButtonLeft: {
    '& .dydu-button-icon': {
      width: '30px',
      height: '30px',
    },
    bottom: 0,
    width: '30px',
    height: '30px',
    position: 'absolute',
    marginTop: '0.5em',
  },
});
