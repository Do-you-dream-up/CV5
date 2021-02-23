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
      height: '0.375em',
      margin: [[0, '.15em']],
      width: '0.375em',
    },
    display: 'flex',
    justifyContent: 'center',
    marginTop: '.5em',
  }),
  controls: ({ offset }) => ({
    '& .dydu-button' : {
      backgroundColor: 'rgb(196 196 196 /50%)',
    },
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    left: '-18px',
    margin: ['.5em', `${offset}%`, 0],
    padding: [0, '.25em'],
    position:'absolute',
    right: '-18px',
    top:'calc(50% - 20px)',
  }),
  root: () => ({
    overflow: 'hidden',
    position: 'relative',
  }),
  step: ({length, offsetBetweenCard}) => ({
    '& .dydu-bubble': {
      height: '100%',
    },
    '& > *': {
      flexGrow: 1,
      margin: [[0, '.25em'], '!important'],
    },
    float: 'left',
    height: '100%',
    margin: [[0], '!important'],
    width: `${offsetBetweenCard / length}%`,
  }),
  steps: ({index, length, offsetBetweenCard}) => ({
    '& .dydu-bubble-response' : {
      alignItems: 'normal',
    },
    display: 'block',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    transform: `translate3d(${(index * -offsetBetweenCard / length)}%, 0, 0)`,
    transitionDuration: '.25s',
    transitionProperty: 'transform',
    width: `${length * 100}%`,
  })
}));
