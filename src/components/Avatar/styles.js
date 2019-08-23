import Configuration from '../../tools/configuration';


export default theme => ({
  base: {
    borderRadius: '50%',
    height: '3em',
    margin: ['.5em', 0],
    minWidth: '3em',
    width: '3em',
    '&&': Configuration.getStyles('avatar'),
  },
  request: {
    backgroundColor: theme.palette.request.background,
    color: theme.palette.request.text,
    marginLeft: '.5em',
    order: 2,
  },
  response: {
    backgroundColor: theme.palette.response.background,
    color: theme.palette.response.text,
    marginRight: '.5em',
  },
});
