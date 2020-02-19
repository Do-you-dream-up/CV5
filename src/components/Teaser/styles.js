import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  brand: () => ({
    alignItems: 'center',
    display: 'flex',
    height: 64,
    justifyContent: 'center',
    marginLeft: '.5em',
    overflow: 'hidden',
    width: 64,
  }),
  button: () => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.radius.inner,
    padding: [['.5em', '1em']],
    position: 'relative',
    '&:hover:before': {
      backgroundColor: theme.palette.action.hover,
      bottom: 0,
      content: '""',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  }),
  hidden: () => ({
    display: 'none !important',
  }),
  root: ({ configuration }) => ({
    alignItems: 'center',
    bottom: 0,
    color: theme.palette.primary.text,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    ...configuration.teaser.styles,
    [theme.breakpoints.down('xs')]: configuration.teaser.stylesMobile,
  }),
}));
