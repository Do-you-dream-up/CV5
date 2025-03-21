import { createUseStyles } from 'react-jss';

const extendedStyles = {
  bottom: 0,
  height: '100vw !important',
  maxHeight: '100vw !important',
  right: 0,
  width: '100% !important',
  minWidth: 100,
  maxWidth: '100vw',
};

export default createUseStyles<any, any>((theme: any): any => ({
  body: () => ({
    '&:focus': {
      outline: 'none',
    },
    // add to position "powered by" line at the end of the chatbox
    display: 'flex',
    flex: 1,
    flexFlow: 'column nowrap',
    // -------------------------------------------------------- //
    flexGrow: 1,
    overflowY: 'auto',
    position: 'relative',
    scrollBehavior: 'smooth',
  }),
  bodyHidden: () => ({
    display: 'none',
  }),
  container: () => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: 400,
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.radius.outer,
    boxShadow: theme.shadows[6],
    [theme.breakpoints?.down('xs')]: {
      minWidth: 200,
    },
  }),
  root: ({ configuration }) => ({
    '& > *': {
      bottom: ~~configuration.chatbox.margin,
      display: 'block',
      left: ~~configuration.chatbox.margin,
      position: 'absolute',
      right: ~~configuration.chatbox.margin,
      top: ~~configuration.chatbox.margin,
      [theme.breakpoints?.down('xs')]: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
    },
    bottom: 0,
    height: 'calc(100% - 20px)',
    maxHeight: 680,
    minWidth: 400,
    position: 'fixed',
    right: 0,
    transitionDuration: '.2s',
    transitionProperty: 'bottom, height, right, transform, width',
    maxWidth: 430,
    width: 430,
    zIndex: 10,
    [theme.breakpoints?.down('xs')]: extendedStyles,
  }),
  rootExtended: () => ({
    bottom: 0,
    height: '100% !important',
    maxHeight: 'inherit !important',
    right: 0,
    width: '100% !important',
    minWidth: 'inherit',
    maxWidth: '100vw',
    '& .dydu-onboarding-image img': {
      maxWidth: '30%',
    },
  }),
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
