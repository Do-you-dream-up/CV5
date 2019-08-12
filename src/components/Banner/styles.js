import Configuration from '../../tools/configuration';


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
  root: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.text,
    overflowY: 'hidden',
    '@global': {
      'a[href]': {
        color: `${theme.palette.warning.text} !important`,
        textDecoration: 'underline !important',
      },
    },
    '&&': Configuration.getStyles('banner'),
  },
});
