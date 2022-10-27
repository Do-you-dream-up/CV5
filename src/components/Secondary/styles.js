import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => {
  const side = {
    borderRadius: theme.shape.radius.outer,
    bottom: 0,
    position: 'absolute',
    top: 0,
    [theme.breakpoints.down('md')]: {
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
    base: ({ configuration, width, height }) => ({
      backgroundColor: theme.palette.background.secondary,
      boxShadow: theme.shadows[1],
      display: 'flex',
      flexDirection: 'column',
      height: configuration.secondary.fixedDimensions ? undefined : height,
      overflowY: 'auto',
      maxHeight: '648px',
      width: configuration.secondary.fixedDimensions ? configuration.secondary.width : width,
      [theme.breakpoints.up('lg')]: {
        minWidth: configuration.secondary.fixedDimensions ? configuration.secondary.width : width,
        maxWidth: configuration.secondary.width,
      },
      [theme.breakpoints.down('md')]: {
        maxHeight: '595px',
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: configuration.secondary.widthXL,
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
