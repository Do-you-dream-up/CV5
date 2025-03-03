import { createUseStyles } from 'react-jss';

export default createUseStyles<any, any>((theme: any): any => ({
  brand: () => ({
    alignItems: 'center',
    display: 'flex',
    height: 64,
    justifyContent: 'center',
    marginLeft: '.5em',
    overflow: 'hidden',
    width: 64,
    borderRadius: '50%',
    // eslint-disable-next-line sort-keys
    '& img': {
      width: '75%',
      height: 'auto',
      pointerEvents: 'none',
    },
    '& p': {
      position: 'absolute',
      left: '-10000em',
      top: 'auto',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    },
  }),
  button: () => ({
    marginBlockStart: 0,
    marginBlockEnd: 0,
    '&:hover:before': {
      backgroundColor: theme.palette?.action?.hover,
      bottom: 0,
      content: '""',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    '&:focus': {
      boxShadow: '0px 6px 9px 0px rgba(86,86,86,0.52)',
    },
    backgroundColor: theme?.palette?.primary?.main,
    borderRadius: theme?.shape?.radius?.inner,
    boxSizing: 'border-box',
    height: 'fit-content',
    padding: [['.5em', '1em']],
    position: 'relative',
  }),
  dyduTeaserContainer: () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
  }),
  dyduTeaserContainerContent: () => ({
    display: 'flex',
    flexDirection: 'row',
  }),
  dyduTeaserTitle: () => ({
    alignItems: 'center',
    display: 'flex',
  }),
  hidden: () => ({
    display: 'none !important',
    '& .dydu-teaser-title': {
      display: 'none',
    },
  }),
  root: ({ configuration }) => ({
    alignItems: 'center',
    bottom: configuration?.teaser?.bottom,
    color: theme?.palette?.primary?.text,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    zIndex: 10,
    right: configuration?.teaser?.right,
  }),
  backgroundAvatar: ({ color = 'primary' }) => ({
    backgroundColor: `${theme?.palette?.[color]?.main}33`,
  }),
}));
