import Configuration from '../../tools/configuration';


export default theme => ({
  disabled: {
    cursor: 'not-allowed',
    opacity: .5,
  },
  enabled: {
    cursor: 'pointer',
    '&:hover': {backgroundColor: theme.palette.action.hover},
  },
  root: {
    background: theme.palette.primary.dark,
    display: 'flex',
    '&&': Configuration.getStyles('tabs'),
  },
  selected: {
    '&::after': {
      backgroundColor: theme.palette.secondary.main,
      bottom: 0,
      content: '""',
      display: 'block',
      height: 2,
      left: 0,
      position: 'absolute',
      right: 0,
    },
  },
  tab: {
    alignItems: 'center',
    color: theme.palette.primary.text,
    display: 'flex',
    flexBasis: 0,
    flexGrow: 1,
    justifyContent: 'center',
    padding: '.5em',
    position: 'relative',
  },
});
