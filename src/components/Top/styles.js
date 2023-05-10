import { createUseStyles } from 'react-jss';

export default createUseStyles(() => ({
  hideOutline: () => ({
    outline: 'none',
  }),
  accessibility: () => ({
    color: '#41479B',
    cursor: 'pointer',
    border: 'none',
    fontSize: '16px',
    background: 'inherit',
    '&:focus': {
      textDecoration: 'none !important',
    },
    '&:hover': {
      textDecoration: 'underline !important',
    },
  }),
}));
