import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import useStyles from './styles';
import Button from '../Button';
import { withConfiguration } from '../../tools/configuration';
import useDebounce from '../../tools/debounce';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';


/**
 * Wrapper around the input bar to contain the talk and suggest logic.
 */
function Input({ configuration, onRequest, onResponse }) {

  const classes = useStyles({configuration});
  const [ input, setInput ] = useState('');
  const [ suggestions, setSuggestions ] = useState([]);
  const [ typing, setTyping ] = useState(false);
  const { delay, placeholder } = configuration.input;
  const debouncedInput = useDebounce(input, delay);

  const onChange = event => {
    setTyping(true);
    setInput(event.target.value);
  };

  const onSubmit = event => {
    event.preventDefault();
    return submit();
  };

  const onSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault();
    setTyping(false);
    setInput(suggestionValue);
    submit();
  };

  const reset = () => {
    setInput('');
  };

  const submit = () => {
    const text = input.trim();
    if (text) {
      reset();
      onRequest(text);
      talk(text).then(onResponse);
    }
    setTyping(false);
  };

  const suggest = useCallback(text => {
    text = text.trim();
    if (text) {
      dydu.suggest(text).then(suggestions => {
        setSuggestions(Array.isArray(suggestions) ? suggestions : [suggestions]);
      });
    }
  }, []);

  useEffect(() => {
    if (typing) {
      suggest(debouncedInput);
    }
  }, [debouncedInput, suggest, typing]);

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
    onChange,
    placeholder,
    value: input,
  };

  return (
    <form className={classNames('dydu-input', classes.root)} onSubmit={onSubmit}>
      <Autosuggest getSuggestionValue={suggestion => suggestion.rootConditionReword || ''}
                   inputProps={inputProps}
                   onSuggestionSelected={onSuggestionSelected}
                   onSuggestionsClearRequested={() => setSuggestions([])}
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


Input.propTypes = {
  configuration: PropTypes.object.isRequired,
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};


export default withConfiguration(Input);
