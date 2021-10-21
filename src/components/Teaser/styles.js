import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  brand: () => ({
    alignItems: 'center',
    display: 'flex',
    height: 64,
    justifyContent: 'center',
    marginLeft: '.5em',
    overflow: 'hidden',
    width: 64,
    // eslint-disable-next-line sort-keys
    '& img': {
      height: '100%',
    },
  }),
  button: () => ({
    '&:hover:before': {
      backgroundColor: theme.palette.action.hover,
      bottom: 0,
      content: '""',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.radius.inner,
    boxSizing: 'border-box',
    height: '37px',
    padding: [['.5em', '1em']],
    position: 'relative',
  }),
  dyduTeaserContainer: () => ({
    display: 'flex',
  }),
  dyduTeaserTitle: () => ({
    alignItems: 'center',
    display: 'flex',
  }),
  hidden: () => ({
    display: 'none !important',
  }),
  hideOutline: () => ({
    outline: 'none',
  }),
  root: ({ configuration }) => ({
    alignItems: 'center',
    bottom: configuration.teaser.bottom,
    color: theme.palette.primary.text,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    right: configuration.teaser.right,
  }),
}));
