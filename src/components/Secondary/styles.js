import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => {
  const side = {
    borderRadius: theme.shape.radius.outer,
    bottom: 0,
    position: 'absolute',
    top: 0,
    [theme.breakpoints?.down('sm')]: {
      borderRadius: 0,
      left: 0,
      marginRight: 'unset',
      right: 0,
      width: 'unset !important',
      top: '3.4em',
      height: 'calc(100% - 115px)', // size of the chatbox header (minHeight + padding)
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
    base: ({ configuration, width, height }) => ({
      backgroundColor: theme.palette.background.secondary,
      boxShadow: theme.shadows[1],
      display: 'flex',
      flexDirection: 'column',
      height: configuration.secondary.fixedDimensions ? undefined : height,
      overflowY: 'auto',
      maxHeight: '648px',
      width: configuration.secondary.fixedDimensions ? configuration.secondary.width : width,
      [theme.breakpoints?.up('xl')]: {
        minWidth: configuration.secondary.fixedDimensions ? configuration.secondary.width : width,
        maxWidth: '100%',
        maxHeight: '100%',
      },
      [theme.breakpoints?.down('lg')]: {
        maxHeight: '100%',
      },
    }),
    body: () => ({
      height: 'initial',
      padding: '1.6em',
      paddingTop: 0,
      paddingBottom: 10,
    }),
    frame: () => ({
      border: 0,
      flexGrow: 1,
    }),
    headerWhite: () => ({
      zIndex: 10,
      backgroundColor: `${theme.palette.background.secondary}`,
      display: 'flex',
      padding: '1.6em',
      paddingBottom: 10,
      position: 'sticky',
      top: 0,
    }),
    header: () => ({
      backgroundColor: `${theme.palette.background.secondary}CC`,
      display: 'flex',
      padding: '1.6em',
      paddingBottom: 10,
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
