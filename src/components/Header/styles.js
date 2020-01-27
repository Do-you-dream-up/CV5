import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: 'auto',
    '& > *': {
      marginLeft: '.5em',
      pointerEvents: 'auto',
    },
  },
  body: {
    alignItems: 'center',
    display: 'flex',
    padding: '.5em',
  },
  draggable: {
    cursor: 'move',
    '& > *': {
      pointerEvents: 'none',
    },
  },
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    position: 'relative',
    width: '100%',
    ...configuration.header.styles,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      ...configuration.header.stylesMobile,
    },
  }),
  title: {
    padding: '.5em',
  },
}));
