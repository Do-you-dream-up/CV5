import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: '.7em',
    '& > *': {
      marginTop: '.7em',
    },
    '& > :not(:first-child)': {
      marginLeft: '.7em',
    },
  },
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
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[12],
    overflow: 'hidden',
    padding: '1.4em',
    position: 'relative',
  },
}));
