import { createUseStyles } from 'react-jss';


export default createUseStyles({
  actions: () => ({
    '& > *': {
      margin: [[0, '.4em']],
    },
    display: 'flex',
    justifyContent: 'center',
  }),
  body: () => ({
    textAlign: 'center',
  }),
  title: () => ({
    textAlign: 'center',
  }),
});
