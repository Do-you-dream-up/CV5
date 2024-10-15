import { createUseStyles } from 'react-jss';

export default createUseStyles((theme: any) => ({
  root: () => ({
    fontSize: '16px',
    fontWeight: 'normal',
    marginRight: '5px',
    marginBottom: '5px',
  }),
  title: () => ({
    fontSize: '18px',
    minWidth: '6.7em',
    maxWidth: '30em',
    padding: '.5em .5em',
    margin: 0,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.radius.outer,
    borderTopRightRadius: theme.shape.radius.outer,
    boxShadow: theme.shadows[1],
    color: theme.palette.primary.text,
    [theme.breakpoints?.down('xs')]: {
      borderRadius: 0,
    },
    zIndex: 1,
  }),
  content: () => ({
    minWidth: '6.7em',
    maxWidth: '30em',
    padding: '.5em .5em',
    margin: 0,
    width: '100%',
    backgroundColor: 'white',
    boxShadow: theme.shadows[1],
    color: 'black',
    [theme.breakpoints?.down('xs')]: {
      borderRadius: 0,
    },
    zIndex: 1,
  }),
  actions: {
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    margin: '0 1em 1em 1em',
    height: 35,
    '& $button': {
      width: '50%',
      justifyContent: 'center',
    },
  },
}));
