import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  body: {
    flexGrow: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  hidden: {
    display: 'none !important',
  },
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.background.default,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    position: 'absolute',
    right: 0,
    width: 350,
    ...configuration.chatbox.styles,
    [theme.breakpoints.down('xs')]: configuration.chatbox.stylesMobile,
  }),
}));
