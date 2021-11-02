import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  button: () => ({
    '& a[href]': {
      '&:hover': {
        backgroundColor: theme.palette.primary.hover,
        textDecoration: 'none',
      },
      alignItems: 'center',
      background: theme.palette.primary.main,
      borderRadius: '4px',
      color: theme.palette.primary.text,
      display: 'flex',
      fontSize: '1em',
      justifyContent: 'center',
      margin: '0.2em 0',
      padding: '0.5em 1.2em',
    },
    '& div': {
      '&:not(:first-child) a[href]': {
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
      },
      flexShrink: '0',
    },
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto 0 0.8em 0',
  }),
  image: () => ({
    '& img': {
      maxWidth: '80%',
    },
  }),
  root: () => ({
    display: 'flex',
    flexDirection: 'column',
    margin: '-0.8em -1em',
  }),
  text: () => ({
    '& div': {
      textAlign: 'justify',
    },
    '& h3': {
      '& + p': {
        marginTop: '-0.75em',
      },
      fontWeight: 'bold!important',
    },
    margin: '0.8em 0',
    padding: '0 1em',
  }),
}));
