import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  active: {},
  bullets: () => ({
    '& > *': {
      '&$active:after': {
        backgroundColor: theme.palette.action.active,
        borderRadius: '50%',
        content: '""',
        display: 'block',
        height: '100%',
        width: '100%',
      },
      backgroundColor: theme.palette.background.bullet,
      borderRadius: '50%',
      cursor: 'pointer',
      height: '.4em',
      margin: [[0, '.15em']],
      width: '.4em',
    },
    display: 'flex',
    justifyContent: 'center',
    marginTop: '.5em',
  }),
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
}));
