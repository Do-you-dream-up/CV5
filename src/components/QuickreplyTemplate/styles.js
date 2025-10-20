/* istanbul ignore file */

import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  buttons: () => ({
    '&:has(div[style*="text-align"])': {
      width: '100%',
    },
    '& > button[href], a[href]': {
      color: theme.palette.primary.text,
      fontSize: '1em',
      flexShrink: '0',
      display: 'inline-block',
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
    marginBlockEnd: '20px !important',
  }),
  text: () => ({
    width: '100%',
  }),
}));
