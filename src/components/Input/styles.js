import { createUseStyles } from 'react-jss';


export default createUseStyles(theme => ({

  actions: {
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      marginLeft: '.5em',
    }
  },

  container: {
    backgroundColor: theme.palette.background.highlight,
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    overflow: 'hidden',
  },

  field: {
    height: '100%',
    position: 'relative',
    width: '100%',
  },

  fieldBase: {
    boxSizing: 'border-box',
    display: 'block',
    fontFamily: 'inherit',
    fontSize: '1em',
    lineHeight: '1.7em',
    overflow: 'hidden',
    padding: [['.4em', '.6em']],
    width: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },

  fieldShadow: {
    extend: 'fieldBase',
    minHeight: '100%',
    visibility: 'hidden',
  },

  fieldText: {
    extend: 'fieldBase',
    background: 0,
    border: 0,
    height: '100%',
    outline: 'none',
    position: 'absolute',
    resize: 'none',
    '&::placeholder': {
      color: theme.palette.text.secondary,
    },
  },

  root: ({ configuration }) => ({
    display: 'flex',
    flex: 'auto',
    ...configuration.input.styles,
    [theme.breakpoints.down('xs')]: configuration.input.stylesMobile,
  }),

  suggestions: ({ configuration }) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    bottom: '100%',
    left: 0,
    margin: 8,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    ...configuration.suggestions.styles,
    [theme.breakpoints.down('xs')]: configuration.suggestions.stylesMobile,
  }),

  suggestionsCandidate: {
    color: theme.palette.text.primary,
    cursor: 'pointer',
    padding: ['1em', '1.4em'],
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },

  suggestionsSelected: {
    backgroundColor: theme.palette.action.selected,
  },

  suggestionsList: {
    listStyleType: 'none',
    margin: 0,
    padding: ['.5em', 0],
    paddingLeft: '0 !important',
  },
}));
