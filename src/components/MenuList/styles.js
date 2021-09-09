import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  icon: () => ({
    marginRight: '1em',
    maxHeight: '2em',
    opacity: .5,
    overflow: 'hidden',
    width: '1.2em',
  }),
  item: () => ({
    alignItems: 'center',
    display: 'flex',
    paddingBottom: '.8em',
    paddingLeft: '1.6em',
    paddingRight: '1.6em',
    paddingTop: '.8em',
  }),
  itemDisabled: () => ({
    color: theme.palette.text.disabled,
    cursor: 'not-allowed',
    display: 'none',
  }),
  itemEnabled: () => ({
    '& $icon': {
      opacity: 1,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: 'pointer',
  }),
  root: () => ({
    borderColor: theme.palette.divider,
    borderStyle: 'solid',
    borderWidth: 0,
    listStyleType: 'none',
    margin: 0,
    padding: [['.5em', 0]],
  }),
  selected: () => ({
    backgroundColor: theme.palette.action.selected,
  }),
}));
