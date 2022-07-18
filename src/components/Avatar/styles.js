import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  background: ({ color = 'primary' }) => ({
    backgroundColor: `${theme.palette[color].main}33`,
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
