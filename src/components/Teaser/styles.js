import Configuration from '../../tools/configuration';


export default theme => ({
  hidden: {
    '&&': {display: 'none'},
  },
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    bottom: 0,
    color: theme.palette.primary.text,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    padding: '1em',
    position: 'absolute',
    right: 0,
    '&&': Configuration.getStyles('teaser'),
  },
});
