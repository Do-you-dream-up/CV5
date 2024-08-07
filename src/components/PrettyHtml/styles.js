/* istanbul ignore file */

import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  root: {
    width: '100%',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    '@global': {
      '@font-face': [
        {
          fontFamily: 'Roboto Regular',
          fontWeight: 400,
          fontStyle: 'normal',
          src: 'url("./fonts/Roboto/Roboto-Regular.ttf") format("truetype")',
          fallbacks: [
            { src: 'url("./fonts/Roboto/Roboto-Regular.woff") format("woff")' },
            { src: 'url("./fonts/Roboto/Roboto-Regular.woff2") format("woff2")' },
          ],
        },
        {
          fontFamily: 'Roboto Medium',
          fontWeight: 500,
          fontStyle: 'normal',
          src: 'url("./fonts/Roboto/Roboto-Medium.ttf") format("truetype")',
          fallbacks: [
            { src: 'url("./fonts/Roboto/Roboto-Medium.woff") format("woff")' },
            { src: 'url("./fonts/Roboto/Roboto-Medium.woff2") format("woff2")' },
          ],
        },
      ],
      'a, .dydu-link': {
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:focus': {
          textDecoration: 'underline',
        },
        color: theme?.palette?.text?.link || theme?.palette?.primary?.main,
        cursor: 'pointer',
        textDecoration: 'none',
      },
      button: {
        fontFamily: theme?.font?.sansSerif,
      },
      dd: {
        color: theme?.palette?.text?.primary,
        marginLeft: '2em',
        textTransform: 'capitalize',
      },
      'dl, h1, h2, h3, h4, h5, h6, ol, p, ul': {
        '&:first-child': { marginTop: 0 },
        '&:last-child': { marginBottom: 0 },
      },
      dt: {
        color: theme?.palette?.text?.sidebar,
        textTransform: 'capitalize',
      },
      'dt:not(:first-child)': {
        color: theme?.palette?.text?.sidebar,
        marginTop: '1em',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontWeight: 'normal',
      },
      img: {
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
    height: '100%',
  },
  srOnly: {
    border: 0,
    clip: 'rect(0, 0, 0, 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    'white-space': 'nowrap',
    width: '1px',
    '& + .p1': {
      marginTop: 0,
      marginBottom: 16,
    },
    '& + p': {
      marginTop: 0,
    },
  },
}));
