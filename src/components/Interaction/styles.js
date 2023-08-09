/* istanbul ignore file */

import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  barf: {
    marginLeft: [[0], '!important'],
    marginRight: [[0], '!important'],
  },
  interactionCarousel: { flexDirection: 'column' },
  base: {
    display: 'flex',
    margin: [['20px 10px'], '!important'],
  },
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
    height: '100%',
    overflowX: 'hidden',
    position: 'relative',
  }),
  loader: () => ({
    marginLeft: '.2em',
  }),
  namerequest: () => ({
    fontSize: '0.9em',
    marginBottom: '0.2em',
    marginLeft: 'auto',
  }),
  nameresponse: () => ({
    fontSize: '0.9em',
    marginBottom: '0.2em',
  }),
  request: () => ({
    borderRadius: '15px',
    marginLeft: '2em',
    paddingLeft: 35,
    '& .dydu-interaction-wrapper': {
      marginLeft: 'auto',
    },
  }),
  response: () => ({
    width: '85%',
    [theme.breakpoints?.up('sm')]: {
      marginRight: '2em',
    },
    '&.dydu-interaction-template': {
      width: 'initial',
    },
  }),
  wrapper: () => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }),
}));
