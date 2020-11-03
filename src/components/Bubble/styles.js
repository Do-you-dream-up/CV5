import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    '&:not(:first-child)': {
      marginTop: '1em',
    },
  }),
  base: () => ({
    alignItems: 'center',
    borderRadius: theme.shape.radius.inner,
    display: 'flex',
    minHeight: '3em',
    overflow: 'hidden',
    position: 'relative',
    wordBreak: 'break-word',
    // eslint-disable-next-line sort-keys
    '&:not(:last-child)': {
      marginBottom: '.5em',
    },
  }),
  body: () => ({
    '&:focus': {
      outline: 'none'
    },
    padding: [['.8em', '1em']],
    width: '100%',
  }),
  progress: () => ({
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
  request: () => ({
    backgroundColor: theme.palette.request.background,
    color: theme.palette.request.text,
    marginLeft: 'auto',
  }),
  response: () => ({
    backgroundColor: theme.palette.response.background,
    color: theme.palette.response.text,
    marginRight: 'auto',
  }),
}));
