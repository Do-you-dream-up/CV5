import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.background.menu,
    color: theme.palette.text.primary,
    fontFamily: 'sans-serif',
    overflowY: 'auto',
    position: 'fixed',
    visibility: 'hidden',
    ...configuration.menu.styles,
    [theme.breakpoints.down('xs')]: configuration.menu.stylesMobile,
  }),
}));
