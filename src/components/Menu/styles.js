import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  root: () => ({
    backgroundColor: theme.palette.background.menu,
    borderRadius: theme.shape.radius.inner,
    boxShadow: theme.shadows[1],
    color: theme.palette.text.primary,
    fontFamily: 'sans-serif',
    overflowY: 'auto',
    position: 'fixed',
    visibility: 'hidden',
    '& > :not(:last-child)': {
      borderBottomWidth: 1,
    },
  }),
}));
