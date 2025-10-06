import { createUseStyles } from 'react-jss';

export default createUseStyles({
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    margin: '0 1em 1em 1em',
    '& $button': {
      justifyContent: 'center',
      width: '50%',
    },
    justifyContent: 'center',
  },
  horizontalActions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  horizontalButton: {
    textAlign: 'center',
    marginLeft: '10px',
    marginRight: '10px',
    justifyContent: 'center',
  },
  body: {
    margin: '0 1em 0 1em',
    alignItems: 'center',
    '& p': {
      marginTop: '16px',
      marginBottom: '20px',
      lineHeight: 'normal',
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
    fontSize: 25,
    fontWeight: '400',
    margin: '20px 0',
  },
  root: {
    overflowY: 'auto',
    display: 'grid',
    height: '100%',
  },
});
