import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  item: {
    paddingBottom: '.8em',
    paddingLeft: '1.6em',
    paddingRight: '1.6em',
    paddingTop: '.8em',
  },
  itemEnabled: {
    cursor: 'pointer',
    '&:hover': {backgroundColor: theme.palette.action.hover},
  },
  itemDisabled: {
    color: theme.palette.text.disabled,
    cursor: 'not-allowed',
  },
  root: {
    borderColor: theme.palette.divider,
    borderWidth: 0,
    borderStyle: 'solid',
    listStyleType: 'none',
    margin: 0,
    padding: [['.5em', 0]],
    '&:not(:last-child)': {
      borderBottomWidth: 1,
    },
  },
}));
