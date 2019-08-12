import Configuration from  '../../tools/configuration';


export default theme => ({
  bullet: {
    animationDirection: 'alternate',
    animationDuration: '.5s',
    animationIterationCount: 'infinite',
    animationName: '$pulse',
    backgroundColor: theme.palette.response.background,
    borderRadius: '50%',
    height: '.75em',
    marginLeft: '.25em',
    marginRight: '.25em',
    transform: 'scale(0)',
    width: '.75em',
    '&&': Configuration.getStyles('loader'),
  },
  root: {
    display: 'flex',
    marginLeft: '-.25em',
    marginRight: '-.25em',
  },
  '@keyframes pulse': {
    from: {transform: 'scale(0)'},
    to: {transform: 'scale(1)'},
  },
});
