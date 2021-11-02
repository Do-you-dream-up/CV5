import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  buttons: () => ({
    '& > a[href]': {
      color: theme.palette.primary.text,
      display: 'flex',
      flexShrink: '0',
      justifyContent: 'center',
      padding: '0.5em 1.2em',
    },
    '& > a[href] > img': {
      display: 'inline',
      height: 'auto',
      marginRight: '3px',
      objectFit: 'cover',
    },
    '&:hover': {
      '& > a[href]': {
        textDecoration: 'none',
      },
      backgroundColor: theme.palette.primary.hover,
    },
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
  }),
  quick: () => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1em',
  }),
  text: () => ({
    margin: '0.8em 0',
  }),
}));
