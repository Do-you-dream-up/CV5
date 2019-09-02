import classNames from 'classnames';
import debounce from 'debounce-promise';
import PropTypes from 'prop-types';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import withStyles from 'react-jss';
import styles from './styles';
import Button from '../Button';
import { withConfiguration } from '../../tools/configuration';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';


/**
 * Wrapper around the input bar to contain the talk and suggest logic.
 */
export default withConfiguration(withStyles(styles)(class Input extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
    onRequest: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {input: '', suggestions: []};
    this.submit = debounce(this.submit, 200, {leading: true});
    this.suggest = debounce(this.suggest, props.configuration.input.delay);
  }

  /**
   * Update the input field with user's input and maybe trigger suggestions.
   *
   * @param {Object} event - DOM event.
   * @public
   */
  change = event => {
    const { delay } = this.props.configuration.input;
    this.setState({input: event.target.value}, delay > 0 ? this.suggest : null);
  };

  /**
   * Prevent refresh of the page and run the debounced submit routine.
   *
   * @param {Object} event - DOM event.
   * @returns {Promise}
   * @public
   */
  onSubmit = event => {
    event.preventDefault();
    return this.submit();
  };

  /**
   * Prevent refresh of the page and select a suggestion candidate.
   *
   * @param {Object} event - DOM event.
   * @param {Object} data
   * @param {string} data.suggestionValue - Selected text.
   * @public
   */
  onSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault();
    this.setState({input: suggestionValue}, this.submit);
  };

  /**
   * Empty the input field.
   *
   * @public
   */
  reset = () => {
    this.setState({input: ''});
  };

  /**
   * Submit the user's input and handle its response.
   *
   * @public
   */
  submit = () => {
    const text = this.state.input.trim();
    if (text) {
      this.reset();
      this.props.onRequest(text);
      talk(text).then(this.props.onResponse);
    }
  };

  /**
   * Fetch suggestions based on the user's input.
   *
   * @public
   */
  suggest = () => {
    const text = this.state.input.trim();
    if (text) {
      dydu.suggest(text).then(suggestions => {
        if (Array.isArray(suggestions)) {
          this.setState({suggestions});
        }
      });
    }
  };

  render() {
    const { classes, configuration } = this.props;
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
      placeholder: configuration.input.placeholder,
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
}));
