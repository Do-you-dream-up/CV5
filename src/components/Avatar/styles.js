import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  background: ({ type }) => ({
    backgroundColor: theme.palette[type].background,
  }),
  base: ({ configuration }) => ({
    alignItems: 'center',
    borderRadius: '50%',
    display: 'flex',
    height: '3em',
    justifyContent: 'center',
    minWidth: '3em',
    width: '3em',
    '& > *': {
      height: '75%',
      width: '75%',
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
