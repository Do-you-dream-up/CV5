import reset from '../../styles/reset';


export default theme => ({
  root: ({ configuration }) => ({
    ...reset(theme),
    fontFamily: 'sans-serif',
    ...configuration.application.styles,
    [theme.breakpoints.down('xs')]: configuration.application.stylesMobile,
  }),
});
