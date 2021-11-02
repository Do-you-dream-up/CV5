import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  background: ({ type }) => ({
    backgroundColor: theme.palette[type].background,
  }),
  base: () => ({
    '& > *': {
      height: '75%',
      width: '75%',
    },
    alignItems: 'center',
    borderRadius: '50%',
    display: 'flex',
    height: '3em',
    justifyContent: 'center',
    minWidth: '3em',
    width: '3em',
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
