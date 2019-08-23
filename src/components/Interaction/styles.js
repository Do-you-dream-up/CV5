export default theme => ({
  base: {
    display: 'flex',
    marginTop: '.5em',
    '&:last-child': {
      marginBottom: '1em',
    },
  },
  bubbles: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    justifyContent: 'center',
    '& > :first-child': {
      paddingTop: '.5em',
    },
    '& > :not(:last-child)': {
      marginBottom: '.5em',
    },
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
