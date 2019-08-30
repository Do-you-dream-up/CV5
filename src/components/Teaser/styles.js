export default theme => ({
  hidden: {
    '&&': {display: 'none'},
  },
  root: props => ({
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
    '&&': props.configuration.teaser.styles,
  }),
});
