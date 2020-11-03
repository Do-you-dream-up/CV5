import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => {

  const contained = ({ color = 'primary' } = {}) => ({
    borderRadius: theme.shape.radius.inner,
    padding: [['.5em', '1.2em']],
    ...(color && {
      '&:disabled': {
        backgroundColor: theme.palette.action.disabled,
      },
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].text,
    }),
  });

  return {

    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },

    base: ({ color }) => ({
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
      alignItems: 'center',
      backgroundColor: 'inherit',
      border: 0,
      color: color ? theme.palette[color].text : theme.palette.text.primary,
      cursor: 'pointer',
      display: 'flex',
      fontFamily: theme.font.sansSerif,
      fontSize: '1em',
      padding: 0,
      position: 'relative',
      textDecoration: 'none',
    }),

    children: () => ({
      '& > *': {
        lineHeight: '1.1em',
        maxHeight: '1.1em',
      },
      '& > :not(:last-child)': {
        marginRight: '.5em',
      },
      alignItems: 'center',
      display: 'flex',
      position: 'relative',
    }),

    contained: ({ color = 'primary'}) => ({
      ...contained({color}),
    }),

    grow: () => ({
      flexGrow: 1,
      justifyContent: 'center',
    }),

    hideOutline: () => ({
      outline : 'none',
    }),

    icon: ({ color = ''}) => ({
      ...contained({color}),
      '& $children *': {
        display: 'block',
        maxHeight: 24,
        width: 24,
      },
      '&, &:after, &:before': {
        borderRadius: '50%',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
      height: 40,
      justifyContent: 'center',
      padding: 0,
      width: 40,
    }),

    spin: () => ({
      animationDuration: '1.2s',
      animationIterationCount: 'infinite',
      animationName: '$spin',
      animationTimingFunction: 'linear',
    }),

    text: ({ color }) => ({
      ...contained(),
      '&:disabled': {
        color: theme.palette.text.disabled,
      },
      '&:disabled:after': {
        backgroundColor: 'transparent',
      },
      backgroundColor: 'transparent',
      color: color ? theme.palette[color].main : theme.palette.text.primary,
    }),
  };
});
