import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => {
  return {
    root: () => ({
      fontFamily: theme.font.sansSerif,
    }),
  };
});
