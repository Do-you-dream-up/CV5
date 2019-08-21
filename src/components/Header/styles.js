import Configuration from '../../tools/configuration';


export default theme => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: 'auto',
    '& > *': {
      marginLeft: '.5em',
    },
  },
  body: {
    alignItems: 'center',
    display: 'flex',
    padding: '.5em',
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    flex: '0 0 auto',
    position: 'relative',
    '&&': Configuration.getStyles('header'),
    [theme.breakpoints.down('xs')]: {'&&': {borderRadius: 0}},
  },
  title: {
    padding: '.5em',
  },
});