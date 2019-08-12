import Configuration from '../../tools/configuration';


export default theme => ({
  body: {
    flexGrow: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  hidden: {
    '&&': {display: 'none'},
  },
  root: {
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    position: 'absolute',
    right: 0,
    width: 350,
    '&&': Configuration.getStyles('chatbox'),
    [theme.breakpoints.down('xs')]: {'&&': Configuration.getStyles('chatbox.mobile')},
  },
});
