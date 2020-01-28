import { createUseStyles } from 'react-jss';
import reset from '../../styles/reset';


export default createUseStyles(theme => {
  return {
    root: {
      ...reset(theme),
      // ...configuration.application.styles,
      // [theme.breakpoints.down('xs')]: configuration.application.stylesMobile,
    },
  };
});
