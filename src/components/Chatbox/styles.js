import { createUseStyles } from 'react-jss';


const extendedStyles = {
  bottom: 0,
  height: '100%',
  right: 0,
  width: '100%',
};


export default createUseStyles(theme => ({
  body: () => ({
    flexGrow: 1,
    overflowY: 'auto',
    position: 'relative',
    '&:focus': {
      outline: 'none'
    }
  }),
  bodyHidden: () => ({
    display: 'none',
  }),
  container: ({ configuration }) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.radius.outer,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...configuration.chatbox.styles,
    [theme.breakpoints.down('xs')]: configuration.chatbox.stylesMobile,
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
    height: 520,
    minWidth: 320,
    position: 'absolute',
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
    'border': 0,
    'clip': 'rect(0, 0, 0, 0)',
    'height': '1px',
    'margin': '-1px',
    'overflow': 'hidden',
    'padding': 0,
    'position': 'absolute',
    'white-space': 'nowrap',
    'width': '1px',
  },
}));
