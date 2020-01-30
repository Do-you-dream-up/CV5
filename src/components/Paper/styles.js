import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  header: {
    marginTop: 0,
    textTransform: 'capitalize',
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  root: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.radius.inner,
    boxShadow: theme.shadows[12],
    overflow: 'hidden',
    padding: '1.4em',
    position: 'relative',
  },
}));
