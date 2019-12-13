import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  base: ({ configuration }) => ({
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    padding: '1em',
    position: 'relative',
    wordBreak: 'break-word',
    ...configuration.bubble.styles,
    [theme.breakpoints.down('xs')]: configuration.bubble.stylesMobile,
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
