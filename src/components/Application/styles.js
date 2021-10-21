import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  background: () => ({
    position: 'absolute',
  }),
  iframe: () => ({
    '& .dydu-actions': {
      '& button:first-child': {
        display: 'none',
      },
      marginLeft: '10px',
      marginTop: 0,
    },
    '& :first-child': {
      flexGrow: 1,
    },
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '15px',
  }),
  root: () => ({
    '& *': {
      boxSizing: 'border-box',
    },
    '& iframe': {
      maxWidth: '100%',
    },
    '& img': {
      display: 'block',
      maxWidth: '100%',
    },
    fontFamily: theme.font.sansSerif,
  }),
}));
