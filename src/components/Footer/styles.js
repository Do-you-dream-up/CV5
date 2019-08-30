export default theme => ({
  root: props => ({
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    display: 'flex',
    flex: '0 0 auto',
    padding: '.5em',
    position: 'relative',
    '&&': props.configuration.footer.styles,
    [theme.breakpoints.down('xs')]: {'&&': {borderRadius: 0}},
  }),
});
