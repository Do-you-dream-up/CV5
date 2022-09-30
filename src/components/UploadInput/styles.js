import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  field: () => ({
    color: theme.palette.text.primary,
    '& span': {
      display: 'block',
    },
    '& span:first-child': {
      color: theme.palette.primary.main,
      borderWidth: '1px',
      borderColor: theme.palette.primary.main,
      background: 'transparent',
    },
    '& span:nth-child(2)': {
      color: 'lightgrey',
    },
  }),
  containerBtns: () => ({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '20px',
  }),
}));
