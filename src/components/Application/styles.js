import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  root: () => ({
    '& *' : {
      boxSizing : 'border-box',
    },
    '& img' : {
      display:'block',
      height: 'auto',
      maxWidth: '100%'
    },
    fontFamily: theme.font.sansSerif,
  }),
}));
