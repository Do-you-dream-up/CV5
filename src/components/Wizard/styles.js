export default theme => ({
  entry: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    margin: '.5em',
    padding: '1.5em',
  },
  entryContainer: {
    flexBasis: '50%',
    flexGrow: 1,
    flexShrink: 1,
    [theme.breakpoints.up('md')]: {
      flexBasis: '33%',
      maxWidth: '33%',
      '&:nth-child(3n+2)': {
        flexBasis: '34%',
        maxWidth: '34%',
      },
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: '25%',
      maxWidth: '25%',
    },
  },
  fields: {
    listStyleType: 'none',
    margin: 0,
    padding: '0 !important',
  },
  root: {
    bottom: 0,
    display: 'flex',
    flexWrap: 'wrap',
    left: 0,
    overflowY: 'auto',
    padding: '.5em',
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
