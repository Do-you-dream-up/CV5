import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  buttons: () => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1em',
  }),
  root: ({ configuration }) => ({
    flexBasis: 'auto',
    flexGrow: '1',
    flexShrink: '1',
    overflowY: 'auto',
    padding: '1em',
    ...configuration.onboarding.styles,
    [theme.breakpoints.down('xs')]: configuration.onboarding.stylesMobile,
  }),
}));
