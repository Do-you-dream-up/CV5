import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: {
    display: 'flex',
    marginLeft: 'auto',
    '& > :not(:first-child)': {
      marginLeft: '1em',
    },
  },
  frame: {
    border: 0,
    flexGrow: 1,
  },
  header: {
    backgroundColor: `${theme.palette.background.secondary}CC`,
    display: 'flex',
    padding: '1.6em',
    position: 'sticky',
    top: 0,
  },
  over: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 'unset !important',
  },
  base: ({ configuration }) => ({
    backgroundColor: theme.palette.background.secondary,
    overflowY: 'auto',
    ...configuration.secondary.styles,
    [theme.breakpoints.down('xs')]: configuration.secondary.stylesMobile,
  }),
  body: {
    padding: '1.6em',
    paddingTop: 0,
  },
  side: {
    borderRadius: theme.shape.borderRadius,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    marginRight: '1em',
    position: 'absolute',
    right: '100%',
    top: 0,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      left: 0,
      marginRight: 'unset',
      right: 0,
      width: 'unset !important',
    },
  },
  title: {
    margin: 0,
    marginRight: '1em',
  },
}));
