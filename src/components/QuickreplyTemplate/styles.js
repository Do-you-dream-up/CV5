/* istanbul ignore file */

import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  buttons: () => ({
    '& > button[href], a[href]': {
      color: theme.palette.primary.text,
      fontSize: '1em',
      display: 'flex',
      flexShrink: '0',
      justifyContent: 'center',
      padding: '0.5em 1.2em',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      cursor: 'pointer',
      fontFamily: theme.font.sansSerif,
      borderRadius: '4px',
      borderStyle: 'none',
      border: '0px',
    },
    '& > button[href] > img': {
      display: 'inline',
      height: 'auto',
      marginRight: '3px',
      objectFit: 'cover',
    },
    '&:hover': {
      '& > button[href]': {
        textDecoration: 'none',
      },
      backgroundColor: theme.palette.primary.hover,
    },
  }),
  quick: () => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1em',
    '& p': {
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },
  }),
  separator: () => ({
    width: '100%',
  }),
}));
