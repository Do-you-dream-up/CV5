import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  base: () => ({
    display: 'block',
  }),
  error: () => ({
    fill: theme.palette.error.main,
  }),
  pending: () => ({
    fill: theme.palette.warning.main,
  }),
  root: () => ({
    position: 'relative',
    '&:hover $tooltip': {
      opacity: 1,
      pointerEvents: 'initial',
    },
  }),
  success: () => ({
    fill: theme.palette.success.main,
  }),
  tooltip: () => ({
    backgroundColor: theme.palette.tooltip.background,
    borderRadius: theme.shape.radius.inner,
    color: theme.palette.tooltip.text,
    fontSize: '.8em',
    marginRight: '.6em',
    opacity: 0,
    padding: [['.6em', '1.2em']],
    pointerEvents: 'none',
    position: 'absolute',
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    transitionDuration: '.2s',
    transitionProperty: 'opacity',
    whiteSpace: 'nowrap',
  }),
}));
