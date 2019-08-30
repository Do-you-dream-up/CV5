export default theme => ({
  actions: {
    display: 'flex',
    float: 'right',
    margin: '.5em',
    '& > :not(:first-child)': {
      marginLeft: '.5em',
    },
  },
  body: {
    padding: '1em',
  },
  root: props => ({
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.text,
    overflowY: 'hidden',
    '@global': {
      'a[href]': {
        color: `${theme.palette.warning.text} !important`,
        textDecoration: 'underline !important',
      },
    },
    '&&': props.configuration.banner.styles,
  }),
});
