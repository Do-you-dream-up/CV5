import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  back: {
    backgroundColor: theme.palette.secondary.main,
    height: '100%',
    opacity: .4,
    position: 'absolute',
    width: '150%',
  },
  root: {
    height: 4,
    overflowX: 'hidden',
  },
  segmentBase: {
    backgroundColor: theme.palette.secondary.main,
    height: '100%',
    position: 'absolute',
  },
  segmentGrow: {
    extend: 'segmentBase',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationName: '$grow',
  },
  segmentShrink: {
    extend: 'segmentBase',
    animationDelay: '.5s',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationName: '$shrink',
  },
  '@keyframes grow': {
    from: {left: '-5%', width: '5%'},
    to: {left: '150%', width: '100%'},
  },
  '@keyframes shrink': {
    from: {left: '-80%', width: '80%'},
    to: {left: '120%', width: '20%'},
  },
}));
