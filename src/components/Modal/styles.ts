import { createUseStyles } from 'react-jss';

export default createUseStyles<any, any>((theme: any): any => ({
  bottom: () => ({
    borderBottomLeftRadius: theme.shape.radius.outer,
    borderBottomRightRadius: theme.shape.radius.outer,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    bottom: 0,
    boxShadow: 'none',
    left: 0,
    position: 'absolute',
    right: 0,
  }),
  center: ({ configuration }) => ({
    maxWidth: configuration.modal.maxWidth,
    minWidth: configuration.modal.minWidth,
  }),
  full: () => ({
    bottom: 0,
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
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
    [theme.breakpoints?.down('xs')]: {
      borderRadius: 0,
    },
  }),
}));
