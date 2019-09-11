export default theme => ({

  actions: {
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      marginLeft: '.5em',
    }
  },

  container: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flex: 'auto',
    overflow: 'hidden',
  },

  field: {
    background: 'none',
    border: 0,
    flex: 'auto',
    outline: 'none',
    padding: '0 0 0 1em',
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
});
