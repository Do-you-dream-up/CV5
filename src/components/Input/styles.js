import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  actions: () => ({
    '& > *': {
      marginLeft: '.5em',
    },
    alignItems: 'center',
    display: 'flex',
    '& $path': {
      fill: theme?.palette?.primary?.main,
    },
  }),

  container: () => ({
    flexGrow: 1,
    height: '100%',
  }),

  counter: () => ({
    // DEBT: The below font size, font weight and spacings are not dynamic. This
    //       is difficult to maintain and will cause bugs and/or misalignment.
    background: theme?.palette?.background?.menu,
    borderRadius: '0.25em',
    boxSizing: 'border-box',
    color: theme?.palette?.response?.text,
    fontSize: '12px',
    fontWeight: 300,
    height: '1.5em',
    lineHeight: '1.5em',
    maxWidth: '2.31em',
    position: 'absolute',
    right: '0.31em',
    textAlign: 'center',
    top: 'calc(50% - 0.75em)',
    width: '100%',
    zIndex: 0,
  }),

  hidden: () => ({
    position: 'absolute',
    left: '-10000em',
    top: 'auto',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  }),

  field: () => ({
    height: '100%',
    position: 'relative',
    width: '100%',
  }),

  label: () => ({
    display: 'none',
  }),

  fieldBase: {
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: 'inherit',
    fontSize: '16px',
    lineHeight: '1.7em',
    padding: [['.4em', '3em', '.4em', '13px']], // DEBT
    whiteSpace: 'pre-wrap',
    width: '105%',
    wordBreak: 'break-word',
  },

  fieldShadow: () => ({
    extend: 'fieldBase',
    height: '100%',
    minHeight: '100%',
    visibility: 'hidden',
  }),

  fieldText: () => ({
    height: '100%',
    '&::placeholder': {
      color: '#46525F',
    },
    '&[disabled]': {
      cursor: 'not-allowed',
    },
    background: '#EDF1F5',
    border: 0,
    color: theme?.palette?.text?.primary,
    extend: 'fieldBase',
    outline: 'none',
    position: 'absolute',
    resize: 'none',
    '&.focus': {
      border: `1px solid ${theme?.palette?.primary?.main}`,
    },
  }),

  root: () => ({
    display: 'flex',
    flex: 'auto',
    height: '100%',
    borderRadius: theme?.shape?.radius?.inner,
    overflow: 'hidden',
    '&:focus': {
      boxShadow: 'inset 0px 0px 15px 5px rgba(205,205,205,0.18)',
    },
  }),

  suggestions: () => ({
    backgroundColor: theme?.palette?.background?.default,
    borderRadius: theme?.shape?.radius?.inner,
    bottom: '100%',
    boxShadow: theme?.shadows?.[6],
    left: 0,
    margin: 8,
    maxHeight: '70vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'absolute',
    right: 0,
    zIndex: 1,
  }),

  suggestionsCandidate: () => ({
    '&:hover': {
      backgroundColor: theme?.palette?.action?.hover,
    },
    color: theme?.palette?.text?.primary,
    cursor: 'pointer',
    padding: ['1em', '1.4em'],
  }),

  suggestionsList: () => ({
    listStyleType: 'none',
    margin: 0,
    padding: ['.5em', 0],
    paddingLeft: '0 !important',
  }),

  suggestionsSelected: () => ({
    backgroundColor: theme?.palette?.action?.selected,
  }),
}));
