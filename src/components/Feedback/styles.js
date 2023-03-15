/* istanbul ignore file */

import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  commentField: {
    height: '100%',
    minHeight: '110px',
    minWidth: '230px',
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
    whiteSpace: 'pre-wrap',
    width: '100%',
    wordBreak: 'break-word',
  },
  commentFieldShadow: {
    extend: 'commentFieldBase',
    minHeight: '100%',
    visibility: 'hidden',
  },
  commentFieldText: {
    '&::placeholder': {
      color: theme.palette.text.secondary,
    },
    backgroundColor: theme.palette.background.highlight,
    border: 0,
    borderRadius: theme.shape.radius.inner,
    extend: 'commentFieldBase',
    height: '100%',
    outline: 'none',
    position: 'absolute',
    resize: 'none',
  },
  thinking: {
    cursor: 'wait',
  },
  vote: {
    display: 'flex',
    gap: '.5em',
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      '& .icon-dydu-thumb-down, & .icon-dydu-thumb-up': {
        position: 'relative',
      },
      '& .icon-dydu-thumb-up': {
        bottom: '1px',
      },
      '& .icon-dydu-thumb-down': {
        top: '2px',
      },
    },
  },
}));
