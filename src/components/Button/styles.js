import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => {

  const contained = ({ color = 'primary' } = {}) => ({
    borderRadius: theme.shape.radius.inner,
    padding: [['.5em', '1.2em']],
    ...(color && {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].text,
      '&:disabled': {
        backgroundColor: theme.palette.action.disabled,
      },
    }),
  });

  return {

    base: ({ color }) => ({
      alignItems: 'center',
      backgroundColor: 'inherit',
      border: 0,
      color: color ? theme.palette[color].text : theme.palette.text.primary,
      cursor: 'pointer',
      display: 'flex',
      fontFamily: theme.font.sansSerif,
      fontSize: '1em',
      outline: 'none',
      padding: 0,
      position: 'relative',
      textDecoration: 'none',
      '&:disabled': {
        cursor: 'not-allowed',
      },
      '&:not(:disabled):before': {
        borderRadius: 'inherit',
        bottom: 0,
        content: '""',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      },
      '&:not(:disabled):hover:before': {
        backgroundColor: theme.palette.action.hover,
      },
    }),

    children: () => ({
      alignItems: 'center',
      display: 'flex',
      position: 'relative',
      '& > *': {
        height: '1.1em',
        lineHeight: '1.1em',
      },
      '& > :not(:last-child)': {
        marginRight: '.5em',
      },
    }),

    contained,

    grow: () => ({
      flexGrow: 1,
      justifyContent: 'center',
    }),

    icon: ({ color = '' }) => ({
      ...contained({color}),
      height: 40,
      justifyContent: 'center',
      padding: 0,
      width: 40,
      '&, &:after, &:before': {
        borderRadius: '50%',
      },
      '& $children *': {
        display: 'block',
        height: 24,
        width: 24,
      },
    }),

    spin: () => ({
      animationDuration: '1.2s',
      animationIterationCount: 'infinite',
      animationName: '$spin',
      animationTimingFunction: 'linear',
    }),

    text: ({ color }) => ({
      ...contained(),
      backgroundColor: 'transparent',
      color: color ? theme.palette[color].main : theme.palette.text.primary,
      '&:disabled': {
        color: theme.palette.text.disabled,
      },
      '&:disabled:after': {
        backgroundColor: 'transparent',
      },
    }),

    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  };
});
