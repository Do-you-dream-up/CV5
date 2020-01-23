import { createUseStyles } from 'react-jss';


const contained = ({ color = 'primary', theme }) => ({
  backgroundColor: theme.palette[color].main,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette[color].text,
  padding: '.5em 1em',
  textTransform: 'uppercase',
});


const icon = () => ({
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


export default createUseStyles(theme => ({

  base: ({ color }) => ({
    alignItems: 'center',
    backgroundColor: 'inherit',
    border: 0,
    color: theme.palette.text.primary,
    cursor: 'pointer',
    display: 'flex',
    outline: 'none',
    padding: 0,
    position: 'relative',
    ...(color && {
      color: theme.palette[color].text,
    }),
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

  contained: ({ color }) => contained({color, theme}),

  text: ({ color }) => ({
    ...contained({color, theme}),
    backgroundColor: 'transparent',
    color: color ? theme.palette[color].main : theme.palette.text.primary,
    '&:disabled': {
      color: theme.palette.text.disabled,
    },
    '&:disabled:after, &:disabled:before': {
      backgroundColor: 'transparent',
    },
  }),

  icon: ({ color }) => icon({color, theme}),

  'icon-contained': ({ color = 'primary' }) => ({
    ...icon({color, theme}),
    backgroundColor: theme.palette[color].main,
  }),
}));
