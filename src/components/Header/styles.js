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
    minHeight: '40px',
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
  image: () => ({
    '& > img': {
      height: '75%',
      width: '75%',
    },
    alignItems: 'center',
    display: 'flex',
    height: '2.8em',
    justifyContent: 'center',
    maxWidth: '2.8em',
    minWidth: '2.8em',
    width: '2.8em',
  }),
  logo: () => ({
    '& > .dydu-header-title:only-child': {
      margin: 'auto 0.5em',
      width: '8.5em',
    },
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
    minWidth: '6.7em',
    padding: '.5em 0',
    width: '6.5em',
  }),
}));
