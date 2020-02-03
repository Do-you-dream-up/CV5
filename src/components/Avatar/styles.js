import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  background: ({ type }) => ({
    alignItems: 'center',
    backgroundColor: theme.palette[type].background,
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      maxHeight: '75%',
      maxWidth: '75%',
    },
  }),
  base: ({ configuration }) => ({
    borderRadius: '50%',
    height: '3em',
    minWidth: '3em',
    width: '3em',
    '& > *': {
      height: '100%',
      width: '100%',
    },
    ...configuration.avatar.styles,
    [theme.breakpoints.down('xs')]: configuration.avatar.stylesMobile,
  }),
  request: () => ({
    color: theme.palette.request.text,
    marginLeft: '.5em',
    order: 2,
  }),
  response: () => ({
    color: theme.palette.response.text,
    marginRight: '.5em',
  }),
}));
