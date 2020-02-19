import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  disabled: () => ({
    cursor: 'not-allowed',
    opacity: .5,
  }),
  icon: () => ({
    height: '1.3em',
    opacity: .5,
    transitionDuration: '.2s',
    transitionProperty: 'opacity',
    width: '1.3em',
  }),
  label: () => ({
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    transitionDuration: '.2s',
    transitionProperty: 'bottom',
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
  }),
  indicator: ({ current, length }) => ({...(length && current > -1 && {
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: `${100 / length * current}%`,
    position: 'absolute',
    transitionDuration: '.2s',
    transitionProperty: 'left',
    width: `${100 / length}%`,
    '&:after': {
      backgroundColor: theme.palette.primary.text,
      borderRadius: '50%',
      content: '""',
      display: 'block',
      marginBottom: '.3em',
      height: '.3em',
      width: '.3em',
    },
  })}),
  root: ({ configuration }) => ({
    background: theme.palette.primary.main,
    display: 'flex',
    position: 'relative',
    width: '100%',
    ...configuration.tabs.styles,
    [theme.breakpoints.down('xs')]: configuration.tabs.stylesMobile,
  }),
  selected: () => ({
    bottom: '.3em',
    '& $icon': {
      opacity: 1,
    },
  }),
  tab: () => ({
    alignItems: 'center',
    color: theme.palette.primary.text,
    cursor: 'pointer',
    display: 'flex',
    flexBasis: 0,
    flexGrow: 1,
    justifyContent: 'center',
    overflowX: 'hidden',
    padding: '.6em',
    position: 'relative',
    whiteSpace: 'nowrap',
  }),
}));
