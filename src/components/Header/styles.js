import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    position: 'absolute',
    right: 0,
    marginRight: '.5em',
    '& > *': {
      pointerEvents: 'auto',
    },
  }),
  body: () => ({
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    padding: '.6em',
  }),
  draggable: () => ({
    cursor: 'move',
    '& > *': {
      pointerEvents: 'none',
    },
  }),
  flat: () => ({
    boxShadow: 'none !important',
  }),
  root: () => ({
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.radius.outer,
    borderTopRightRadius: theme.shape.radius.outer,
    boxShadow: theme.shadows[1],
    color: theme.palette.primary.text,
    position: 'relative',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0
    },
  }),
  title: () => ({
    padding: '.5em',
  }),
}));
