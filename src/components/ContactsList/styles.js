import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  list: () => ({
    '& > div': {
      alignItems: 'center',
      display: 'flex',
    },
    '& > h5': {
      color: theme?.palette?.primary?.main,
      fontWeight: 600,
      marginBottom: '0.6em',
      marginTop: '0.8em',
    },
    '& > p, a[href]': {
      color: theme?.palette?.text?.primary,
      fontSize: '0.8em',
      fontWeight: 'normal',
      marginBottom: '0',
      marginTop: '0',
    },
    '& a[href]': {
      '&:hover': {
        textDecoration: 'underline',
      },
      textDecoration: 'none',
    },
    '& img': {
      marginLeft: '0.4em',
      maxHeight: 14,
      width: 14,
    },
    display: 'block',
  }),
  root: () => ({
    display: 'block',
    marginBottom: '1.2em',
  }),
  title: () => ({
    '& > h4': {
      fontWeight: 'normal',
      margin: '0',
    },
    '& > div:before': {
      marginRight: '0.4em',
      maxHeight: 24,
      width: 24,
    },
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    color: theme?.palette?.text?.primary,
    display: 'flex',
    paddingBottom: '0.6em',
  }),
}));
