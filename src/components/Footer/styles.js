import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    alignItems: 'center',
    paddingLeft: '.5em',
  }),
  content: () => ({
    flexGrow: 1,
    padding: '.5em',
  }),
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.shape.radius.outer,
    borderBottomRightRadius: theme.shape.radius.outer,
    color: theme.palette.primary.text,
    display: 'flex',
    position: 'relative',
    width: '100%',
    ...configuration.footer.styles,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      ...configuration.footer.stylesMobile
    },
  }),
}));
