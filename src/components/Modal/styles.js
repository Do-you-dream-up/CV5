import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  modal: ({ configuration }) => ({
    maxWidth: configuration.modal.maxWidth,
    minWidth: configuration.modal.minWidth,
  }),
  root: () => ({
    alignItems: 'center',
    backgroundColor: theme.palette.background.overlay,
    borderRadius: theme.shape.radius.outer,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
    },
  }),
}));
