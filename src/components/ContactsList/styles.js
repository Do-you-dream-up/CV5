import { createUseStyles } from 'react-jss';

export default createUseStyles(theme => ({
  root: () => ({
    display: 'block',
    marginBottom: '1.2em',
  }),
  title: () => ({
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    color: theme.palette.text.primary,
    display: 'flex',
    paddingBottom: '0.6em',
    '& > h4': {
      fontWeight: 'normal',
      margin: '0',
    },
    '& > img': {
      marginRight: '0.4em',
      maxHeight: 24,
      width: 24,
    },
  }),
  list: () => ({
    display: 'block',
    '& > h5': {
      color: theme.palette.primary.main,
      fontWeight: 600,
      marginBottom: '0.6em',
      marginTop: '0.8em',
    },
    '& > p, a[href]': {
      color: theme.palette.text.primary,
      fontSize: '0.8em',
      fontWeight: 'normal',
      marginBottom: '0',
      marginTop: '0',
    },
    '& a[href]': {
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    '& > div': {
      alignItems: 'center',
      display: 'flex',
    },
    '& img': {
      marginLeft: '0.4em',
      maxHeight: 14,
      width: 14,
    }
  }),
}));
