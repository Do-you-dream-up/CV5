import classNames from 'classnames';
import debounce from 'debounce-promise';
import PropTypes from 'prop-types';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import withStyles from 'react-jss';
import styles from './styles';
import Button from '../Button';
import Configuration from '../../tools/configuration';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';


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
