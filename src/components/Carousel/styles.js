import { createUseStyles } from 'react-jss';


export default createUseStyles({
  content: () => ({
    '& > *': {
      margin: '0 !important',
      minWidth: '100%',
    },
    display: 'flex',
    flexDirection: 'row',
    transitionDuration: '.25s',
    transitionProperty: 'transform',
  }),
  controls: () => ({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '.5em',
  }),
  root: () => ({
    overflow: 'hidden',
    position: 'relative',
  }),
});
