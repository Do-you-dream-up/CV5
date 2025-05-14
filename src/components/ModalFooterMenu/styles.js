import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  actions: () => ({
    '& button': {
      zIndex: 1,
    },
    borderTopColor: theme?.palette?.divider,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    padding: [['.6em', '1.2em']],
  }),
  root: () => ({
    '&&': {
      padding: 0,
      width: '100%',
    },
  }),
  title: () => ({
    borderBottomColor: theme?.palette?.divider,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    padding: [['.8em']],
    textAlign: 'center',
    fontSize: 'inherit',
    fontWeight: 'inherit',
  }),
}));
