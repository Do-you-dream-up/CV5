import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  actions: () => ({
    '& > *': {
      pointerEvents: 'auto',
    },
    '& > :not(:last-child)': {
      marginRight: '.1em',
    },
    width: '50%', // TODO: put at 30% when there are only 2 icons left in the header
  }),
  body: () => ({
    alignItems: 'center',
    display: 'flex',
    padding: '.6em 20px',
  }),
  draggable: () => ({
    '& > *': {
      pointerEvents: 'none',
    },
    cursor: 'move',
  }),
  flat: () => ({
    boxShadow: 'none !important',
  }),
  image: () => ({
    alignItems: 'center',
    display: 'flex',
    height: '2.5em',
    justifyContent: 'center',
    marginRight: '16px',
    width: '2.5em',
  }),
  logo: () => ({
    '& > .dydu-header-title:only-child': {
      margin: 'auto 0.5em',
      width: '50%', // TODO: put at 70% when there are only 2 icons left in the header
    },
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    width: '70%',
  }),
  root: () => ({
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 270, // header:60 + contact tab:40 + banner:170 max.
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.radius.outer,
    borderTopRightRadius: theme.shape.radius.outer,
    boxShadow: theme.shadows[1],
    color: theme.palette.primary.text,
    width: '100%',
    [theme.breakpoints?.down('xs')]: {
      borderRadius: 0,
    },
    zIndex: 1,
    '& .dydu-header-actions button': {
      width: '40px',
      height: '40px',
      padding: '0px',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
    },
    '& .dydu-header-actions button:not(:disabled):hover::before': {
      backgroundColor: 'rgba(0, 0, 0, 0.14)',
    },
  }),
  title: () => ({
    fontSize: '16px',
    fontWeight: 'normal',
    minWidth: '6.7em',
    padding: '.5em 0',
    margin: 0,
    width: '100%',
  }),
  endLivechat: () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  }),

  buttonContent: () => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    textAlign: 'center',
  }),

  endLivechatIcon: () => ({
    marginLeft: '8px',
    fontSize: '16px',
    fill: '#120CFF',
    '&:hover': {
      fill: 'white',
    },
  }),
}));
