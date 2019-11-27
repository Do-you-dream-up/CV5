import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  modal: {
    maxWidth: '70%',
    minWidth: '40%',
  },
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.overlay,
    borderRadius: theme.shape.borderRadius,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));
