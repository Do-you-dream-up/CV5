export default theme => ({
  body: {
    flexGrow: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  hidden: {
    '&&': {display: 'none'},
  },
  root: props => ({
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    position: 'absolute',
    right: 0,
    width: 350,
    '&&': props.configuration.chatbox.styles,
    [theme.breakpoints.down('xs')]: {'&&': props.configuration.chatbox.stylesMobile},
  }),
});
