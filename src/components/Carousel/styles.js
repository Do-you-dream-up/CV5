import { createUseStyles } from 'react-jss';


export default createUseStyles({
  controls: ({ offset }) => ({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    margin: ['.5em', `${offset}%`, 0],
    padding: [0, '.25em'],
  }),
  root: () => ({
    overflow: 'hidden',
    position: 'relative',
  }),
  step: ({ width }) => ({
    '& > *': {
      flexGrow: 1,
      margin: [[0, '.25em'], '!important'],
    },
    display: 'flex',
    margin: [[0], '!important'],
    minWidth: `${width}%`,
  }),
  steps: () => ({
    display: 'flex',
    flexDirection: 'row',
    transitionDuration: '.25s',
    transitionProperty: 'transform',
  }),
});
