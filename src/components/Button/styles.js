import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => {

  const contained = ({ color = 'primary' } = {}) => ({
    borderRadius: theme.shape.borderRadius,
    padding: '.5em 1em',
    textTransform: 'uppercase',
    ...(color && {
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].text,
    }),
  });

  const overlay = {
    borderRadius: 'inherit',
    bottom: 0,
    content: '""',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  };

  return {

    base: ({ color }) => ({
      alignItems: 'center',
      backgroundColor: 'inherit',
      border: 0,
      color: color ? theme.palette[color].text : theme.palette.text.primary,
      cursor: 'pointer',
      display: 'flex',
      outline: 'none',
      padding: 0,
      position: 'relative',
      '& > *:not(:first-child)': {
        marginLeft: '.5em',
      },
      '&:disabled': {
        cursor: 'not-allowed',
      },
      '&:disabled:after': {
        ...overlay,
        backgroundColor: theme.palette.action.disabled,
      },
      '&:before': {
        ...overlay,
      },
      '&:hover:before': {
        backgroundColor: theme.palette.action.hover,
      },
    }),

    contained,

    icon: ({ color = '' }) => ({
      ...contained({color}),
      height: 40,
      justifyContent: 'center',
      width: 40,
      '&, &:after, &:before': {
        borderRadius: '50%',
      },
      '& > *': {
        height: 20,
        position: 'absolute',
        width: 20,
      },
      ...(!color && {
        '&:disabled:after, &:disabled:before': {
          backgroundColor: 'transparent',
        },
      }),
    }),

    text: ({ color }) => ({
      ...contained(),
      backgroundColor: 'transparent',
      color: color ? theme.palette[color].main : theme.palette.text.primary,
      '&:disabled': {
        color: theme.palette.text.disabled,
      },
      '&:disabled:after, &:disabled:before': {
        backgroundColor: 'transparent',
      },
    }),
  };
});
