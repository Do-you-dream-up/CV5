import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    '&:not(:first-child)': {
      marginTop: '1em',
    },
    display: 'flex',
    justifyContent: 'space-between',
  }),
  actionsCentered: () => ({
    justifyContent: 'center',
  }),
  body: () => ({
    '& > :not(:last-child)': {
      marginBottom: '1em',
    },
    overflowY: 'auto',
    padding: '1em',
    position: 'relative',
    width: '100%',
  }),
  carousel: () => ({
    textAlign: 'center',
  }),
  preamble: () => ({
    color: theme.palette.primary.text,
    textAlign: 'center',
  }),
  root: () => ({
    '&:before': {
      backgroundColor: theme.palette.primary.main,
      content: '""',
      display: 'block',
      height: '25%',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    display: 'flex',
    flexGrow: '1',
    height: 0,
    position: 'relative',
  }),
}));
