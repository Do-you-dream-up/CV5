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
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.text,
    overflowY: 'hidden',
    '@global': {
      'a[href]': {
        color: `${theme.palette.warning.text} !important`,
        textDecoration: 'underline !important',
      },
    },
    '&&': configuration.banner.styles,
  }),
});
