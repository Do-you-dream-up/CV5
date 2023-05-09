import { createUseStyles } from 'react-jss';

export default createUseStyles({
  root: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    // add to position "powered by" line at the end of the chatbox
    display: 'flex',
    flexDirection: 'column',
    flex: 'none',
    // -------------------------------------------------------- //
    overflow: 'hidden',
    marginBottom: 'auto',
  },
});
