import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => {
  const side = {
    borderRadius: theme.shape.radius.outer,
    bottom: 0,
    position: 'absolute',
    top: 0,
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      left: 0,
      marginRight: 'unset',
      right: 0,
      width: 'unset !important',
      top: '3.4em', // size of the chatbox header (minHeight + padding)
    },
  };

  return {
    actions: () => ({
      '& > :not(:first-child)': {
        marginLeft: '1em',
      },
      display: 'flex',
      marginLeft: 'auto',
    }),
    base: ({ configuration, height, width }) => ({
      backgroundColor: theme.palette.background.secondary,
      boxShadow: theme.shadows[1],
      display: 'flex',
      flexDirection: 'column',
      height: configuration.secondary.fixedDimensions ? undefined : height,
      overflowY: 'auto',
      width: configuration.secondary.fixedDimensions ? configuration.secondary.width : width,
      [theme.breakpoints.down('xs')]: {
        height: '100%',
      },
    }),
    body: () => ({
      padding: '1.6em',
      paddingTop: 0,
    }),
    frame: () => ({
      border: 0,
      flexGrow: 1,
    }),
    header: () => ({
      backgroundColor: `${theme.palette.background.secondary}CC`,
      display: 'flex',
      padding: '1.6em',
      position: 'sticky',
      top: 0,
    }),
    left: () => ({
      ...side,
      marginRight: '.5em',
      right: '100%',
    }),
    over: () => ({
      boxShadow: 'none',
      flexGrow: 1,
      width: 'unset',
    }),
    right: () => ({
      ...side,
      left: '100%',
      marginLeft: '.5em',
    }),
    title: () => ({
      margin: 0,
      marginRight: '1em',
    }),
  };
});
