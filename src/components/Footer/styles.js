import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  content: () => ({
    padding: '.5em',
  }),
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.shape.radius.outer,
    borderBottomRightRadius: theme.shape.radius.outer,
    color: theme.palette.primary.text,
    position: 'relative',
    width: '100%',
    ...configuration.footer.styles,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      ...configuration.footer.stylesMobile
    },
  }),
}));
