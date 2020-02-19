import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  header: () => ({
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    color: theme.palette.text.secondary,
    fontWeight: 'normal',
    margin: [[0, 0, '.8em']],
    paddingBottom: '.6em',
    textAlign: 'center',
  }),
  progress: () => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  }),
  root: ({ elevation = 12 }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.radius.inner,
    boxShadow: theme.shadows[elevation],
    overflow: 'hidden',
    padding: [['.6em', '1.2em', '1.2em']],
    position: 'relative',
  }),
}));
