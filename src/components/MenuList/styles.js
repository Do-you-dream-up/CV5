import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  icon: () => ({
    height: '1em',
    marginRight: '1em',
    opacity: .5,
    width: '1em',
  }),
  item: () => ({
    alignItems: 'center',
    display: 'flex',
    paddingBottom: '.8em',
    paddingLeft: '1.6em',
    paddingRight: '1.6em',
    paddingTop: '.8em',
  }),
  itemEnabled: () => ({
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '& $icon': {
      opacity: 1,
    },
  }),
  itemDisabled: () => ({
    color: theme.palette.text.disabled,
    cursor: 'not-allowed',
  }),
  root: () => ({
    borderColor: theme.palette.divider,
    borderWidth: 0,
    borderStyle: 'solid',
    listStyleType: 'none',
    margin: 0,
    padding: [['.5em', 0]],
  }),
  selected: () => ({
    backgroundColor: theme.palette.action.selected,
  }),
}));
