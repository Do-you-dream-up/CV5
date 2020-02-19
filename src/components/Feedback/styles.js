import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({
  commentField: {
    height: '100%',
    minHeight: '2.1em',
    minWidth: '10em',
    position: 'relative',
    width: '100%',
  },
  commentFieldBase: {
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: 'inherit',
    fontSize: '1em',
    lineHeight: '1.7em',
    overflow: 'hidden',
    padding: [['.2em', '.6em']],
    width: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  commentFieldShadow: {
    extend: 'commentFieldBase',
    minHeight: '100%',
    visibility: 'hidden',
  },
  commentFieldText: {
    extend: 'commentFieldBase',
    backgroundColor: theme.palette.background.highlight,
    border: 0,
    borderRadius: theme.shape.radius.inner,
    height: '100%',
    outline: 'none',
    position: 'absolute',
    resize: 'none',
    '&::placeholder': {
      color: theme.palette.text.secondary,
    },
  },
  thinking: {
    cursor: 'wait',
  },
  vote: {
    display: 'flex',
    '& > :not(:last-child)': {
      marginRight: '.5em',
    },
  },
}));
