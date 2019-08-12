import Configuration from '../../tools/configuration';


export default theme => ({
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& > *': {
      marginTop: '1em',
    },
  },
  base: {
    borderRadius: theme.shape.borderRadius,
    padding: '1em',
    wordBreak: 'break-word',
    '&:not(:last-child)': {
      marginBottom: '.5em',
    },
    '&&': Configuration.getStyles('bubble'),
  },
  request: {
    backgroundColor: theme.palette.request.background,
    color: theme.palette.request.text,
    marginLeft: 'auto',
  },
  response: {
    backgroundColor: theme.palette.response.background,
    color: theme.palette.response.text,
    marginRight: 'auto',
  },
});
