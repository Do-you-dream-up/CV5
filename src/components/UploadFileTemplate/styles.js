import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  field: () => ({
    color: theme.palette.text.primary,
    textAlign: 'center',
    width: '100%',
    border: '1px solid grey',
    borderRadius: '5px',
  }),
  disable: () => ({
    color: 'lightgrey',
    borderColor: 'lightgrey',
    '& label': {
      cursor: 'not-allowed',
    },
  }),
  label: () => ({
    width: '100%',
    display: 'block',
    cursor: 'pointer',
    padding: '5px 0',
  }),
}));
