import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  actions: () => ({
    '& > *': {
      pointerEvents: 'auto',
    },
    '& > :not(:last-child)': {
      marginRight: '.1em',
    },
    marginRight: '.5em',
    position: 'absolute',
    right: 0,
  }),
  body: () => ({
    alignItems: 'center',
    display: 'flex',
    minHeight: '2.8em',
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
    '& img': {
      height: '100%',
    },
    alignItems: 'center',
    display: 'flex',
    height: '2.5em',
    justifyContent: 'center',
    marginRight: '0.6em',
    width: '2.5em',
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
      borderRadius: 0,
    },
    zIndex: 1,
  }),
  title: () => ({
    fontSize: '16px',
    fontWeight: 'normal',
    minWidth: '6.7em',
    padding: '.5em 0',
    margin: 0,
    width: '7.5em',
  }),
}));
