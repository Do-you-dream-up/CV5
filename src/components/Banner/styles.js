import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    margin: '1em',
  }),
  body: () => ({
    margin: '1em',
  }),
  root: () => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxHeight: 170,
    overflowY: 'auto',
    width: '100%',
  }),
}));
