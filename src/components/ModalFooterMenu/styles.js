import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    borderTopColor: theme.palette.divider,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    padding: [['.6em', '1.2em']],
  }),
  root: () => ({'&&': {
    padding: 0,
    width: '100%',
  }}),
  title: () => ({
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    padding: [['.8em']],
    textAlign: 'center',
  }),
}));
