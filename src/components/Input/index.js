import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import useStyles from './styles';
import Button from '../Button';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import useDebounce from '../../tools/hooks/debounce';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';


/**
 * Wrapper around the input bar to contain the talk and suggest logic.
 */
export default function Input({ onRequest, onResponse }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const [ input, setInput ] = useState('');
  const [ suggestions, setSuggestions ] = useState([]);
  const [ typing, setTyping ] = useState(false);
  const { delay, maxLength=100, placeholder='' } = configuration.input;
  const debouncedInput = useDebounce(input, delay);

  const onChange = event => {
    setTyping(true);
    setInput(event.target.value);
  };

  const onKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      submit(input);
    }
  };

  const onSubmit = event => {
    event.preventDefault();
    submit(input);
  };

  const onSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault();
    setTyping(false);
    setInput(suggestionValue);
    submit(suggestionValue);
  };

  const renderInputComponent = properties => (
    <div className={classNames('dydu-input-field', classes.field)}>
      <textarea {...properties} />
      <div children={input} className={classes.fieldShadow} />
    </div>
  );

  const reset = () => {
    setInput('');
  };

  const submit = text => {
    text = text.trim();
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
    input: classNames('dydu-input-field-text', classes.fieldText),
    suggestionsContainer: classNames('dydu-suggestions', classes.suggestions),
    suggestionsList: classNames('dydu-suggestions-list', classes.suggestionsList),
    suggestion: classNames('dydu-suggestions-candidate', classes.suggestionsCandidate),
    suggestionHighlighted: classNames('dydu-suggestions-selected', classes.suggestionsSelected),
  };
  const inputProps = {
    autoFocus: true,
    maxLength,
    onChange,
    onKeyDown,
    placeholder: placeholder.slice(0, 50),
    value: input,
  };

  return (
    <form className={classNames('dydu-input', classes.root)} onSubmit={onSubmit}>
      <Autosuggest getSuggestionValue={suggestion => suggestion.rootConditionReword || ''}
                   inputProps={inputProps}
                   onSuggestionSelected={onSuggestionSelected}
                   onSuggestionsClearRequested={() => setSuggestions([])}
                   onSuggestionsFetchRequested={({ value }) => value}
                   renderInputComponent={renderInputComponent}
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
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};
