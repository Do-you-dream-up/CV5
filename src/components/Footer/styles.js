import Configuration from '../../tools/configuration';


export default theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    display: 'flex',
    flex: '0 0 auto',
    padding: '.5em',
    position: 'relative',
    '&&': Configuration.getStyles('footer'),
    [theme.breakpoints.down('xs')]: {'&&': {borderRadius: 0}},
  },
});
