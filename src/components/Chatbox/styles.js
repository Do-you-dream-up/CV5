import { createUseStyles } from 'react-jss';

const extendedStyles = {
  bottom: 0,
  height: '100% !important',
  maxHeight: 'inherit !important',
  right: 0,
  width: '100% !important',
};

export default createUseStyles((theme) => ({
  body: () => ({
    '&:focus': {
      outline: 'none',
    },
    flexGrow: 1,
    overflowY: 'auto',
    position: 'relative',
    scrollBehavior: 'smooth',
  }),
  bodyHidden: () => ({
    display: 'none',
  }),
  container: () => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.radius.outer,
    boxShadow: theme.shadows[6],
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }),
  root: ({ configuration }) => ({
    '& > *': {
      bottom: ~~configuration.chatbox.margin,
      display: 'block',
      left: ~~configuration.chatbox.margin,
      position: 'absolute',
      right: ~~configuration.chatbox.margin,
      top: ~~configuration.chatbox.margin,
      [theme.breakpoints.down('xs')]: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
    },
    bottom: 0,
    height: 'calc(100% - 20px)',
    maxHeight: 520,
    minWidth: 320,
    position: 'fixed',
    right: 0,
    transitionDuration: '.2s',
    transitionProperty: 'bottom, height, right, transform, width',
    width: 370,
    [theme.breakpoints.down('xs')]: extendedStyles,
  }),
  rootExtended: () => extendedStyles,
  rootHidden: () => ({
    display: 'none !important',
  }),
  srOnly: {
    border: 0,
    clip: 'rect(0, 0, 0, 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    'white-space': 'nowrap',
    width: '1px',
  },
}));
