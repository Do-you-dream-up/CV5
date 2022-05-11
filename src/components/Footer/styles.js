import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  actions: () => ({
    alignItems: 'center',
    paddingLeft: '.5em',
    height: '100%',
  }),
  content: () => ({
    flexGrow: 1,
    height: '100%',
    padding: '.5em',
  }),
  root: () => ({
    backgroundColor: '#EDF1F5',
    borderBottomLeftRadius: theme.shape.radius.outer,
    borderBottomRightRadius: theme.shape.radius.outer,
    boxShadow: theme.shadows[1],
    color: theme.palette.primary.text,
    display: 'flex',
    flexShrink: 0,
    position: 'relative',
    width: '100%',
    heigth: 60,
    minHeight: 60,
    maxHeight: 130,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
    },
  }),
}));
