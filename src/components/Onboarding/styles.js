import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  actions: () => ({
    display: 'flex',
    flexDirection: 'column',
    height: '20%',
    justifyContent: 'space-around',
  }),
  active: {},
  bullets: () => ({
    '& > *': {
      '&$active:after': {
        backgroundColor: theme.palette.action.active,
        borderRadius: '50%',
        content: '""',
        display: 'block',
        height: '100%',
        width: '100%',
      },
      backgroundColor: theme.palette.background.bullet,
      borderRadius: '50%',
      cursor: 'pointer',
      height: '.4em',
      margin: [[0, '.15em']],
      width: '.4em',
    },
    display: 'flex',
    justifyContent: 'center',
    marginTop: '.5em',
  }),
  buttons: () => ({
    display: 'flex',
    justifyContent: 'space-between',
  }),
  carousel: () => ({
    '& > :not(:last-child)': {
      marginBottom: '1em',
    },
    '& > button': {
      padding: 0,
      border: 0,
      background: 'none',
      color: theme.palette.text.link || theme.palette.primary.main,
      fontFamily: theme.font.sansSerif,
      fontSize: 16,
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    height: '80%',
    overflowY: 'auto',
    position: 'relative',
    textAlign: 'center',
    width: '100%',
  }),
  image: () => ({
    '& img': {
      height: 'auto',
      margin: '0 auto',
      maxWidth: '50%',
    },
    display: 'block',
    textAlign: 'center',
  }),
  root: () => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    height: 0,
    padding: '1em',
    position: 'relative',
  }),
  title: () => ({
    fontSize: '1.2em',
    fontWeight: 'bold',
  }),
}));
