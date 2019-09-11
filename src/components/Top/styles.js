export default theme => ({
  root: ({ configuration }) => ({
    ...configuration.top.styles,
    [theme.breakpoints.down('xs')]: configuration.top.stylesMobile,
  }),
});
