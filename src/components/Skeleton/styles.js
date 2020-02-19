import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  base: ({ height, width }) => ({
    backgroundColor: theme.palette.background.skeleton,
    height,
    width,
  }),
  circle: ({ height, width }) => ({
    borderRadius: '50%',
    height: height || '3em',
    width: width || '3em',
  }),
  rectangle: ({ height, width }) => ({
    height: height || '5em',
    width: width || '100%',
  }),
  text: ({ height, width }) => ({
    height: height || '1.3em',
    width: width || '70%',
  }),
}));
