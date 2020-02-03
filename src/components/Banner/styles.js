import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  actions: () => ({
    margin: '1em',
  }),
  body: () => ({
    margin: '1em',
  }),
  root: ({ configuration }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxHeight: 170,
    overflowY: 'auto',
    width: '100%',
    ...configuration.banner.styles,
    [theme.breakpoints.down('xs')]: configuration.banner.stylesMobile,
  }),
}));
