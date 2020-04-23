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
    // DEBT: The below font size, font weight and spacings are not dynamic. This
    //       is difficult to maintain and will cause bugs and/or misalignment.
    background: theme.palette.background.menu,
    borderRadius: '0.25em',
    boxSizing: 'border-box',
    color: theme.palette.response.text,
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
    padding: [['.4em', '3em', '.4em', '.6em']],  // DEBT
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
