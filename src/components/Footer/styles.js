import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  actions: () => ({
    alignItems: 'center',
    paddingLeft: '.5em',
  }),
  content: () => ({
    flexGrow: 1,
    padding: '.5em',
  }),
  root: () => ({
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.shape.radius.outer,
    borderBottomRightRadius: theme.shape.radius.outer,
    boxShadow: theme.shadows[1],
    color: theme.palette.primary.text,
    display: 'flex',
    flexShrink: 0,
    position: 'relative',
    width: '100%',
    height: 60,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
    },
  }),
}));
