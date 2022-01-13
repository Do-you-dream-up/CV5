import { createUseStyles } from 'react-jss';

export default createUseStyles({
  root: {
    '& > :not(:last-child)': {
      marginRight: '.6em',
    },
    display: 'flex',
    justifyContent: 'flex-end',
  },
  arrowButtonRight: {
    position: 'absolute',
    right: '18px',
    top: 'calc(50% - 27px)',
    width: '40px',
    height: '40px',
  },
  arrowButtonLeft: {
    position: 'absolute',
    left: '18px',
    top: 'calc(50% - 27px)',
    width: '40px',
    height: '40px',
  },
});
