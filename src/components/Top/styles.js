import { createUseStyles } from 'react-jss';

export default createUseStyles(() => ({
  hideOutline: () => ({
    outline: 'none',
  }),
  accessibility: () => ({
    '&:focus': {
      textDecoration: 'none !important',
    },
    '&:hover': {
      textDecoration: 'underline !important',
    },
  }),
}));
