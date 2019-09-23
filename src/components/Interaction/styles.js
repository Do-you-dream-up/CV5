import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  base: ({ configuration }) => ({
    display: 'flex',
    marginTop: '.5em',
    '&:last-child': {
      marginBottom: '1em',
    },
    ...configuration.interaction.styles,
    [theme.breakpoints.down('xs')]: configuration.interaction.stylesMobile,
  }),
  bubbles: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    justifyContent: 'center',
    '& > :first-child': {
      paddingTop: '.5em',
    },
    '& > :not(:last-child)': {
      marginBottom: '.5em',
    },
  },
  request: {
    marginLeft: '2em',
  },
  response: {
    [theme.breakpoints.up('sm')]: {
      marginRight: '2em',
    },
  },
}));
