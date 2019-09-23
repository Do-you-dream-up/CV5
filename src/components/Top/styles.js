import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  root: ({ configuration }) => ({
    ...configuration.top.styles,
    [theme.breakpoints.down('xs')]: configuration.top.stylesMobile,
  }),
}));
