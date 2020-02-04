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
      fontSize: '.9em',
      outline: 'none',
      padding: 0,
      position: 'relative',
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
        height: '1.2em',
        lineHeight: '1.2em',
      },
      '& > :not(:last-child)': {
        marginRight: '.5em',
      },
    }),

    contained,

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
  };
});
