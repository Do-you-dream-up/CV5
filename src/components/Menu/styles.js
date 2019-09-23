import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
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
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.background.menu,
    color: theme.palette.text.primary,
    fontFamily: 'sans-serif',
    listStyleType: 'none',
    margin: 0,
    overflowY: 'auto',
    padding: 0,
    position: 'fixed',
    visibility: 'hidden',
    ...configuration.menu.styles,
    [theme.breakpoints.down('xs')]: configuration.menu.stylesMobile,
  }),
}));
