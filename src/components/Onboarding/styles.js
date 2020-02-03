import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    display: 'flex',
    justifyContent: 'space-between',
    '&:not(:first-child)': {
      marginTop: '1em',
    },
  }),
  actionsCentered: () => ({
    justifyContent: 'center',
  }),
  body: () => ({
    overflowY: 'auto',
    padding: '1em',
    position: 'relative',
    width: '100%',
    '& > :not(:last-child)': {
      marginBottom: '1em',
    },
  }),
  carousel: () => ({
    textAlign: 'center',
  }),
  preamble: () => ({
    color: theme.palette.primary.text,
    textAlign: 'center',
  }),
  root: ({ configuration }) => ({
    display: 'flex',
    flexGrow: '1',
    height: 0,
    position: 'relative',
    '&:before': {
      backgroundColor: theme.palette.primary.main,
      content: '""',
      display: 'block',
      height: '25%',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    ...configuration.onboarding.styles,
    [theme.breakpoints.down('xs')]: configuration.onboarding.stylesMobile,
  }),
}));
