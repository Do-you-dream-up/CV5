import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: 'auto',
    '& > *': {
      marginLeft: '.5em',
    },
  },
  body: {
    alignItems: 'center',
    display: 'flex',
    padding: '.5em',
  },
  draggable: {
    cursor: 'move',
  },
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    flex: '0 0 auto',
    position: 'relative',
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
