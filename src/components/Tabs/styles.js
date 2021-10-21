import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  disabled: () => ({
    cursor: 'not-allowed',
    opacity: 0.5,
  }),
  hideOutline: () => ({
    outline: 'none',
  }),
  icon: () => ({
    height: '1.3em',
    opacity: 0.5,
    transitionDuration: '.2s',
    transitionProperty: 'opacity',
    width: '1.3em',
  }),
  indicator: ({ current, length }) => ({
    ...(length &&
      current > -1 && {
        '&:after': {
          backgroundColor: theme.palette.primary.text,
          borderRadius: '50%',
          content: '""',
          display: 'block',
          height: '.3em',
          marginBottom: '.3em',
          width: '.3em',
        },
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        left: `${(100 / length) * current}%`,
        position: 'absolute',
        transitionDuration: '.2s',
        transitionProperty: 'left',
        width: `${100 / length}%`,
      }),
  }),
  label: () => ({
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
    alignItems: 'center',
    bottom: 0,
    display: 'flex',
    position: 'relative',
    transitionDuration: '.2s',
    transitionProperty: 'bottom',
  }),
  root: () => ({
    background: theme.palette.primary.main,
    display: 'flex',
    position: 'relative',
    width: '100%',
  }),
  selected: () => ({
    '& $icon': {
      opacity: 1,
    },
    bottom: '.3em',
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
