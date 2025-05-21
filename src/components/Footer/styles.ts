import { createUseStyles } from 'react-jss';

export default createUseStyles<any, any>((theme: any): any => ({
  actions: () => ({
    alignItems: 'center',
    paddingLeft: 17,
    height: '100%',
    '& button': {
      width: 27,
      height: 27,
      '&:not(:disabled):hover:before': {
        backgroundColor: 'inherit',
      },
      '&:not(:disabled)': {
        '& > div:hover': {
          borderRadius: '50%',
          boxShadow: '0px 3px 6px #00000029',
        },
      },
    },
  }),
  content: () => ({
    flexGrow: 1,
    height: '100%',
    padding: '.5em',
  }),
  root: () => ({
    backgroundColor: '#EDF1F5',
    borderBottomLeftRadius: theme.shape?.radius?.outer,
    borderBottomRightRadius: theme.shape?.radius?.outer,
    boxShadow: theme?.shadows?.[1],
    color: theme.palette?.primary?.text,
    display: 'flex',
    flexShrink: 0,
    position: 'relative',
    width: '100%',
    heigth: 60,
    minHeight: 60,
    maxHeight: 'fit-content',
    [theme.breakpoints?.down('xs')]: {
      borderRadius: 0,
    },
  }),
  error: {
    width: '100%',
    backgroundColor: '#ff7777',
    textAlign: 'center',
    fontSize: '90%',
  },
}));
