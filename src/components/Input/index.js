import classNames from 'classnames';
import debounce from 'debounce-promise';
import PropTypes from 'prop-types';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import withStyles from 'react-jss';
import Button from '../Button';
import Configuration from '../../tools/configuration';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';


const styles = theme => ({

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
    padding: 0,
  },
});


const INPUT = Configuration.get('input');
const INPUT_DELAY = INPUT.delay === true ? 1000 : ~~INPUT.delay;
const INPUT_PLACEHOLDER = INPUT.placeholder;


class Input extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onRequest: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
  };

  state = {input: '', suggestions: []};

  change = event => {
    this.setState({input: event.target.value}, INPUT_DELAY > 0 ? this.suggest : null);
  };

  onSubmit = event => {
    event.preventDefault();
    return this.submit();
  };

  onSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault();
    this.setState({input: suggestionValue}, this.submit);
  };

  reset = () => {
    this.setState({input: ''});
  };

  submit = debounce(() => {
    const text = this.state.input.trim();
    if (text) {
      this.reset();
      this.props.onRequest(text);
      talk(text).then(this.props.onResponse);
    }
  }, 200, {leading: true});

  suggest = debounce(() => {
    const text = this.state.input.trim();
    if (text) {
      dydu.suggest(text).then(suggestions => {
        if (Array.isArray(suggestions)) {
          this.setState({suggestions});
        }
      });
    }
  }, INPUT_DELAY);

  render() {
    const { classes } = this.props;
    const { input, suggestions } = this.state;
    const theme = {
      container: classNames('dydu-input-container', classes.container),
      input: classNames('dydu-input-field', classes.field),
      suggestionsContainer: classNames('dydu-suggestions', classes.suggestions),
      suggestionsList: classNames('dydu-suggestions-list', classes.suggestionsList),
      suggestion: classNames('dydu-suggestions-candidate', classes.suggestionsCandidate),
      suggestionHighlighted: classNames('dydu-suggestions-selected', classes.suggestionsSelected),
    };
    const inputProps = {
      autoFocus: true,
      onChange: this.change,
      placeholder: INPUT_PLACEHOLDER,
      value: input,
    };
    return (
      <form className={classNames('dydu-input', classes.root)} onSubmit={this.onSubmit}>
        <Autosuggest getSuggestionValue={suggestion => suggestion.rootConditionReword || ''}
                     inputProps={inputProps}
                     onSuggestionSelected={this.onSuggestionSelected}
                     onSuggestionsClearRequested={() => this.setState({suggestions: []})}
                     onSuggestionsFetchRequested={({ value }) => value}
                     renderSuggestion={suggestion => suggestion.rootConditionReword || ''}
                     suggestions={suggestions}
                     theme={theme} />
        <div className={classNames('dydu-input-actions', classes.actions)}>
          <Button flat type="submit" variant="icon">
            <img alt="Send" src="icons/send.png" title="Send" />
          </Button>
        </div>
      </form>
    );
  }
}


export default withStyles(styles)(Input);
