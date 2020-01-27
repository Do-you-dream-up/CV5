import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  content: () => ({
    padding: '.5em',
  }),
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
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
