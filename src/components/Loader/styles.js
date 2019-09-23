import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  bullet: ({ configuration }) => ({
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
    ...configuration.loader.styles,
    [theme.breakpoints.down('xs')]: configuration.loader.stylesMobile,
  }),
  root: {
    display: 'flex',
    marginLeft: '-.25em',
    marginRight: '-.25em',
  },
  '@keyframes pulse': {
    from: {transform: 'scale(0)'},
    to: {transform: 'scale(1)'},
  },
}));
