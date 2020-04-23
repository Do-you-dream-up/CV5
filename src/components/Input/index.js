import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import useDebounce from '../../tools/hooks/debounce';
import talk from '../../tools/talk';
import Actions from '../Actions';
import useStyles from './styles';


/**
 * Wrapper around the input bar to contain the talk and suggest logic.
 */
export default function Input({ focus, onRequest, onResponse }) {

  const { configuration } = useContext(ConfigurationContext);
  const { disabled, placeholder } = useContext(DialogContext);
  const classes = useStyles({configuration});
  const [ counter = 100, setCounter ] = useState(configuration.input.maxLength);
  const [ input, setInput ] = useState('');
  const [ suggestions, setSuggestions ] = useState([]);
  const [ typing, setTyping ] = useState(false);
  const { ready, t } = useTranslation('input');
  const actionSend = t('actions.send');
  const qualification = !!configuration.application.qualification;
  const { delay, maxLength = 100 } = configuration.input;
  const { limit: suggestionsLimit = 3 } = configuration.suggestions;
  const debouncedInput = useDebounce(input, delay);

  const onChange = event => {
    setTyping(true);
    setInput(event.target.value);
    setCounter(maxLength - event.target.value.length);
  };

  const onKeyDown = event => {
    if (event.keyCode === 13 && !event.defaultPrevented) {
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
    <div className={c('dydu-input-field', classes.field)}>
      <textarea {...properties} />
      <div children={input} className={classes.fieldShadow} />
      <span className={classes.counter}>{counter}</span>
    </div>
  );

  const reset = () => {
    setCounter(configuration.input.maxLength);
    setInput('');
  };

  const submit = text => {
    text = text.trim();
    if (text) {
      reset();
      onRequest(text);
      talk(text, {qualification}).then(onResponse);
    }
    setTyping(false);
  };

  const suggest = useCallback(text => {
    text = text.trim();
    if (text) {
      dydu.suggest(text).then(suggestions => {
        suggestions = Array.isArray(suggestions) ? suggestions : [suggestions];
        setSuggestions(suggestions.slice(0, suggestionsLimit));
      });
    }
  }, [suggestionsLimit]);

  useEffect(() => {
    if (typing) {
      suggest(debouncedInput);
    }
  }, [debouncedInput, suggest, typing]);

  const theme = {
    container: c('dydu-input-container', classes.container),
    input: c('dydu-input-field-text', classes.fieldText),
    suggestion: c('dydu-suggestions-candidate', classes.suggestionsCandidate),
    suggestionHighlighted: c('dydu-suggestions-selected', classes.suggestionsSelected),
    suggestionsContainer: c('dydu-suggestions', classes.suggestions),
    suggestionsList: c('dydu-suggestions-list', classes.suggestionsList),
  };

  const inputProps = {
    autoFocus: focus,
    disabled,
    maxLength,
    onChange,
    onKeyDown,
    placeholder: (ready && placeholder || t('placeholder')).slice(0, 50),
    value: input,
  };

  const actions = [{
    children: <img alt={actionSend} src="icons/send.black.png" title={actionSend} />,
    type: 'submit',
    variant: 'icon',
  }];

  return (
    <form className={c('dydu-input', classes.root)} onSubmit={onSubmit}>
      <Autosuggest getSuggestionValue={suggestion => suggestion.rootConditionReword || ''}
                   inputProps={inputProps}
                   onSuggestionSelected={onSuggestionSelected}
                   onSuggestionsClearRequested={() => setSuggestions([])}
                   onSuggestionsFetchRequested={({ value }) => value}
                   renderInputComponent={renderInputComponent}
                   renderSuggestion={suggestion => suggestion.rootConditionReword || ''}
                   suggestions={suggestions}
                   theme={theme} />
      <Actions actions={actions} className={c('dydu-input-actions', classes.actions)} />
    </form>
  );
}


Input.defaultProps = {
  focus: true,
};


Input.propTypes = {
  focus: PropTypes.bool,
  onRequest: PropTypes.func.isRequired,
  onResponse: PropTypes.func.isRequired,
};
