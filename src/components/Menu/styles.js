export default theme => ({
  item: {
    paddingBottom: '.8em',
    paddingLeft: '1.6em',
    paddingRight: '1.6em',
    paddingTop: '.8em',
    '&:first-child': {marginTop: '.5em'},
    '&:last-child': {marginBottom: '.5em'},
  },
  itemEnabled: {
    cursor: 'pointer',
    '&:hover': {backgroundColor: theme.palette.action.hover},
  },
  itemDisabled: {
    color: theme.palette.text.disabled,
    cursor: 'not-allowed',
  },
  root: props => ({
    backgroundColor: theme.palette.background.menu,
    color: theme.palette.text.primary,
    fontFamily: 'sans-serif',
    listStyleType: 'none',
    margin: 0,
    overflowY: 'auto',
    padding: 0,
    position: 'fixed',
    '&&': props.configuration.menu.styles,
  }),
});
