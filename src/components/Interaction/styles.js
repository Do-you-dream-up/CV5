import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  base: ({ configuration }) => ({
    display: 'flex',
    margin: [['1em']],
    ...configuration.interaction.styles,
    [theme.breakpoints.down('xs')]: configuration.interaction.stylesMobile,
  }),
  bubbles: () => ({
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    justifyContent: 'center',
  }),
  loader: () => ({
    marginLeft: '.2em',
  }),
  request: () => ({
    marginLeft: '2em',
  }),
  response: () => ({
    [theme.breakpoints.up('sm')]: {
      marginRight: '2em',
    },
  }),
}));
