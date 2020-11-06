import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  externalLinkIcon: {
    'height': '1em',
    'marginLeft': '0.5em',
    'width': '1em',
  },
  root: {
    '@global': {
      'a[href], .dydu-link': {
        '&:hover': {
          textDecoration: 'underline',
        },
        color: theme.palette.text.link,
        cursor: 'pointer',
        textDecoration: 'none',
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
      'img': {
        display: 'block',
        height: 'auto',
        maxWidth: '100%',
      },
      'li:not(:last-child)': {
        marginBottom: '.5em',
      },
      'ol, ul': {
        paddingLeft: '1.4em',
      },
    },
    'alignItems': 'center',
    'display': 'flex',
    'flexDirection': 'row',
  },
  srOnly: {
    'border': 0,
    'clip': 'rect(0, 0, 0, 0)',
    'height': '1px',
    'margin': '-1px',
    'overflow': 'hidden',
    'padding': 0,
    'position': 'absolute',
    'white-space': 'nowrap',
    'width': '1px',
  },
}));
