import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({

  actions: () => ({
    '& > *': {
      marginLeft: '.5em',
    },
    alignItems: 'center',
    display: 'flex',
  }),

  container: () => ({
    backgroundColor: theme.palette.background.dim,
    borderRadius: theme.shape.radius.inner,
    flexGrow: 1,
    overflow: 'hidden',
  }),

  counter: () => ({
    background: '#FFFFFF',
    borderRadius: '4px',
    boxSizing: 'border-box',
    color: '#46525F',
    fontSize: '12px',
    fontWeight: 300,
    height: '24px',
    lineHeight: '24px',
    maxWidth: '37px',
    position: 'absolute',
    right: '5px',
    textAlign: 'center',
    top: 'calc(50% - 12px)',
    width: '100%',
    zIndex: 0,
  }),

  field: () => ({
    height: '100%',
    position: 'relative',
    width: '100%',
  }),

  fieldBase: {
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: 'inherit',
    fontSize: '1em',
    lineHeight: '1.7em',
    overflow: 'hidden',
    padding: [['.4em', '3em', '.4em', '.6em']],
    whiteSpace: 'pre-wrap',
    width: '100%',
    wordBreak: 'break-word',
  },

  fieldShadow: () => ({
    extend: 'fieldBase',
    minHeight: '100%',
    visibility: 'hidden',
  }),

  fieldText: () => ({
    '&::placeholder': {
      color: theme.palette.text.secondary,
    },
    '&[disabled]': {
      cursor: 'not-allowed',
    },
    background: 0,
    border: 0,
    extend: 'fieldBase',
    height: '100%',
    outline: 'none',
    position: 'absolute',
    resize: 'none',
  }),

  root: ({ configuration }) => ({
    display: 'flex',
    flex: 'auto',
    ...configuration.input.styles,
    [theme.breakpoints.down('xs')]: configuration.input.stylesMobile,
  }),

  suggestions: ({ configuration }) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.radius.inner,
    bottom: '100%',
    left: 0,
    margin: 8,
    maxHeight: '70vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'absolute',
    right: 0,
    zIndex: 1,
    ...configuration.suggestions.styles,
    [theme.breakpoints.down('xs')]: configuration.suggestions.stylesMobile,
  }),

  suggestionsCandidate: () => ({
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    color: theme.palette.text.primary,
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
    backgroundColor: theme.palette.action.selected,
  }),
}));
