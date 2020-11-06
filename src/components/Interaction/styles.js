import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  barf: {
    marginLeft: [[0], '!important'],
    marginRight: [[0], '!important'],
  },
  base: () => ({
    display: 'flex',
    margin: '1em',
  }),
  bubble: () => ({
    '&:not(:last-child)': {
      marginBottom: '.5em',
    },
  }),
  bubbles: () => ({
    '&:not(:last-child)': {
      marginBottom: '.5em',
    },
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    overflowX: 'hidden',
  }),
  loader: () => ({
    marginLeft: '.2em',
  }),
  request: () => ({
    marginLeft: '2em',
  }),
  response: () => ({
    [theme.breakpoints.up('sm')]: {
      marginRight: '2em',
    },
  }),
  wrapper: () => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
  }),
}));
