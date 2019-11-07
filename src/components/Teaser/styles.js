import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  hidden: {
    display: 'none !important',
  },
  root: ({ configuration }) => ({
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    bottom: 0,
    color: theme.palette.primary.text,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    padding: '1em',
    position: 'absolute',
    right: 0,
    '&:hover:before': {
      backgroundColor: theme.palette.action.hover,
      bottom: 0,
      content: '""',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    ...configuration.teaser.styles,
    [theme.breakpoints.down('xs')]: configuration.teaser.stylesMobile,
  }),
}));
