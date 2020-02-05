import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  entry: () => ({
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.radius.inner,
    boxShadow: theme.shadows[1],
    margin: '.5em',
    padding: '1em',
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      marginLeft: 0,
      marginRight: 0,
    },
  }),
  entryContainer: () => ({
    flexGrow: 1,
  }),
  fields: () => ({
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    '& > :not(:last-child)': {
      marginBottom: '.5em',
    },
  }),
  root: ({ configuration }) => {
    const { right, width } = configuration.chatbox.styles;
    return {
      bottom: 0,
      display: 'flex',
      flexWrap: 'wrap',
      left: 0,
      overflowY: 'auto',
      padding: '.5em',
      paddingTop: '2em',
      position: 'absolute',
      right: right + width + right,
      top: 0,
      [theme.breakpoints.down('xs')]: {
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        right: 0,
      },
    };
  },
  title: () => ({
    fontWeight: 'normal',
    marginTop: 0,
    textTransform: 'capitalize',
  }),
}));
