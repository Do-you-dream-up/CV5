import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    color: theme.palette.primary.text,
    display: 'flex',
    flex: '0 0 auto',
    padding: '.5em',
    position: 'relative',
    ...configuration.footer.styles,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      ...configuration.footer.stylesMobile
    },
  }),
}));
