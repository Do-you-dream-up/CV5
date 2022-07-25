import { createUseStyles } from 'react-jss';

export default createUseStyles(() => ({
  zoom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'hsl(0deg 0% 0% / 50%)',
    cursor: 'pointer',
  },
  image: {
    maxWidth: '80vh',
    maxHeight: '80vh',
    cursor: 'pointer',
  },
}));
