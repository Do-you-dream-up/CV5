import Configuration from '../../tools/configuration';


export default theme => ({

  actions: {
    alignItems: 'center',
    display: 'flex',
    '& > *': {
      marginLeft: '.5em',
    }
  },

  container: {
    display: 'flex',
    flex: 'auto',
  },

  field: {
    backgroundColor: theme.palette.primary.light,
    border: 0,
    borderRadius: theme.shape.borderRadius,
    flex: 'auto',
    paddingLeft: '1em',
  },

  root: {
    display: 'flex',
    flex: 'auto',
  },

  suggestions: {
    backgroundColor: theme.palette.background.default,
    bottom: '100%',
    left: 0,
    margin: 8,
    position: 'absolute',
    right: 0,
    '&&': Configuration.getStyles('input.suggestions'),
  },

  suggestionsCandidate: {
    color: theme.palette.text.primary,
    cursor: 'pointer',
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
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
    padding: '0 !important',
  },
});
