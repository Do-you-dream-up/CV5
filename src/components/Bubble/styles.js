import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    '&:not(:first-child)': {
      marginTop: '1em',
    },
  }),
  base: ({ configuration }) => ({
    alignItems: 'center',
    borderRadius: theme.shape.radius.inner,
    display: 'flex',
    minHeight: '3em',
    overflow: 'hidden',
    position: 'relative',
    wordBreak: 'break-word',
    '&:not(:last-child)': {
      marginBottom: '.5em',
    },
    ...configuration.bubble.styles,
    [theme.breakpoints.down('xs')]: configuration.bubble.stylesMobile,
  }),
  body: () => ({
    padding: [['.8em', '1em']],
    width: '100%',
  }),
  progress: () => ({
    position: 'absolute',
    left: 0,
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
