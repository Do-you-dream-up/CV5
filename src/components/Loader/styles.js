import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  bars: () => ({
    alignItems: 'center',
    display: 'flex',
    height: '1.2em',
    margin: [[0, 2]],
    width: 4,
    '&:after': {
      animationDirection: 'alternate',
      animationDuration: '.2s',
      animationIterationCount: 'infinite',
      animationName: '$growForward',
      animationTimingFunction: 'linear',
      backgroundColor: theme.palette.text.primary,
      borderRadius: 2,
      content: '""',
      display: 'block',
      height: '50%',
     width: '100%',
    },
    '&:nth-child(2n+1):after': {
      animationName: '$growBackward',
      height: '100%',
    },
  }),
  bubbles: () => ({
    animationName: '$pulse',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    height: '.75em',
    margin: [[0, '.25em']],
    transform: 'scale(0)',
    width: '.75em',
  }),
  item: () => ({
    animationDirection: 'alternate',
    animationDuration: '.5s',
    animationIterationCount: 'infinite',
  }),
  root: ({ configuration }) => ({
    display: 'flex',
    marginLeft: '-.25em',
    marginRight: '-.25em',
    ...configuration.loader.styles,
    [theme.breakpoints.down('xs')]: configuration.loader.stylesMobile,
  }),
  '@keyframes growBackward': {
    from: {height: '100%'},
    to: {height: '50%'},
  },
  '@keyframes growForward': {
    from: {height: '50%'},
    to: {height: '100%'},
  },
  '@keyframes pulse': {
    from: {transform: 'scale(0)'},
    to: {transform: 'scale(1)'},
  },
}));
