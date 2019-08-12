export default theme => ({
  base: {
    display: 'flex',
    '&:not(:first-child)': {
      paddingTop: '1em',
    },
  },
  bubbles: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  request: {
    marginLeft: '2em',
  },
  response: {
    [theme.breakpoints.up('sm')]: {
      marginRight: '2em',
    },
  },
});
