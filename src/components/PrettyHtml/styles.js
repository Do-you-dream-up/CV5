import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  root: {
    '@global': {
      'a[href], .dydu-link': {
        color: theme.palette.text.link,
        cursor: 'pointer',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      button: {
        fontFamily: theme.fontFamily,
      },
      dd: {
        color: theme.palette.text.primary,
        marginLeft: '2em',
        textTransform: 'capitalize',
      },
      'dl, h1, h2, h3, h4, h5, h6, ol, p, ul': {
        '&:first-child': {marginTop: 0},
        '&:last-child': {marginBottom: 0},
      },
      dt: {
        color: theme.palette.text.secondary,
        textTransform: 'capitalize',
      },
      'dt:not(:first-child)': {
        color: theme.palette.text.secondary,
        marginTop: '1em',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontWeight: 'normal',
        textTransform: 'capitalize',
      },
      'li:not(:last-child)': {
        marginBottom: '.5em',
      },
      'ol, ul': {
        paddingLeft: '1.4em',
      },
    },
  },
}));
