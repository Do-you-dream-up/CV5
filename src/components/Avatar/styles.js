import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  base: ({ configuration }) => ({
    borderRadius: '50%',
    height: '3em',
    minWidth: '3em',
    width: '3em',
    ...configuration.avatar.styles,
    [theme.breakpoints.down('xs')]: configuration.avatar.stylesMobile,
  }),
  request: {
    backgroundColor: theme.palette.request.background,
    color: theme.palette.request.text,
    marginLeft: '.5em !important',
    order: 2,
  },
  response: {
    backgroundColor: theme.palette.response.background,
    color: theme.palette.response.text,
    marginRight: '.5em !important',
  },
}));
