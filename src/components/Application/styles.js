import reset from '../../styles/reset';


export default theme => ({
  root: {
    '@global': reset(theme),
    fontFamily: 'sans-serif',
  },
});
