import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    '& > *': {
      pointerEvents: 'auto',
    },
    marginRight: '.5em',
    position: 'absolute',
    right: 0,
  }),
  body: () => ({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '.6em',
  }),
  draggable: () => ({
    '& > *': {
      pointerEvents: 'none',
    },
    cursor: 'move',
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
