export default theme => ({
  entry: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    margin: '.5em',
    padding: '1.5em',
  },
  entryContainer: {
    flexGrow: 1,
  },
  fields: {
    listStyleType: 'none',
    margin: 0,
    padding: '0 !important',
  },
  root: ({ configuration }) => {
    const { right, width } = configuration.chatbox.styles;
    return {
      bottom: 0,
      display: 'flex',
      flexWrap: 'wrap',
      left: 0,
      overflowY: 'auto',
      padding: '.5em',
      position: 'absolute',
      right: right + width + right,
      top: 0,
      [theme.breakpoints.down('xs')]: {
        right: 0,
      },
    };
  },
});
