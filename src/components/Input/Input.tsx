import Actions, { ActionProps } from '../Actions/Actions';
import { escapeHTML, isDefined } from '../../tools/helpers';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import Autosuggest from 'react-autosuggest';
import { DialogContext } from '../../contexts/DialogContext';
import { Local } from '../../tools/storage';
import Voice from '../../modulesApi/VoiceModuleApi';
import c from 'classnames';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useDebounce from '../../tools/hooks/debounce';
import { useEvent } from '../../contexts/EventsContext';
import { useLivechat } from '../../contexts/LivechatContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

interface InputProps {
  onRequest: (input: string) => void;
  onResponse: (input: string) => void;
}

export default function Input({ onRequest, onResponse }: InputProps) {
  const { isLivechatOn, send, typing: livechatTyping } = useLivechat();
  const { configuration } = useConfiguration();
  const { dispatchEvent } = useEvent();
  const { disabled, locked, placeholder, autoSuggestionActive } = useContext(DialogContext);

  const classes = useStyles();
  const [counter = 100, setCounter] = useState<number | undefined>(configuration?.input.maxLength);
  const [input, setInput] = useState<string>('');
  const { prompt } = useContext(DialogContext);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const { ready, t } = useTranslation('translation');
  const actionSend = t('input.actions.send');
  const { counter: showCounter, delay, maxLength = 100 } = configuration?.input || {};
  const { limit: suggestionsLimit = 3 } = configuration?.suggestions || {};
  const debouncedInput = useDebounce(input, delay);
  const inputRef = useRef(null);
  const containerRef = useRef<null | any>(null);

  const voice = configuration?.Voice ? configuration?.Voice?.enable : false;

  const onChange = (event) => {
    setTyping(true);
    setInput(event.target.value);
    setCounter(maxLength - event.target.value.length);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.defaultPrevented) {
      event.preventDefault();
      submit(input);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    submit(input);
  };

  useEffect(() => {
    if (isLivechatOn && typing) livechatTyping?.(input);
  }, [input, isLivechatOn, livechatTyping, typing]);

  const onSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault();
    setTyping(false);
    setInput(suggestionValue);
    submit(suggestionValue);
  };

  const renderInputComponent = useCallback(
    (properties) => {
      const data = {
        ...properties,
      };

      const textareaId = 'dydu-textarea';
      return (
        <div className={c('dydu-input-field', classes.field)} data-testid="footer-input">
          <label htmlFor={textareaId} className={c('dydu-input-label', classes.label)}>
            textarea
          </label>
          <textarea
            {...data}
            role="combobox"
            aria-expanded="false"
            disabled={prompt || locked}
            id={textareaId}
            autoFocus
          />
          <div children={input} className={classes.fieldShadow} />
          {!!showCounter && <span children={counter} className={classes.counter} />}
        </div>
      );
    },
    [classes.counter, classes.field, classes.fieldShadow, counter, input, locked, prompt, showCounter],
  );

  const reset = useCallback(() => {
    setCounter(configuration?.input.maxLength);
    setInput('');
  }, [configuration?.input.maxLength]);

  const sendInput = useCallback(
    (input) => {
      if (isLivechatOn) send?.(input);
      else {
        talk(input).then(onResponse);
      }
    },

    [isLivechatOn, send],
  );

  const submit = useCallback(
    (text) => {
      text = escapeHTML(text.trim());
      if (text) {
        reset();
        onRequest(text);
        dispatchEvent && dispatchEvent('chatbox', 'questionSent', text);
        sendInput(text);
      }
      setTyping(false);
    },
    [dispatchEvent, onRequest, reset, sendInput],
  );

  const suggest = useCallback(
    (text) => {
      text = text.trim();
      if (text && autoSuggestionActive) {
        dydu.suggest(text).then((suggestions) => {
          suggestions = Array.isArray(suggestions) ? suggestions : [suggestions];
          setSuggestions(suggestions.slice(0, suggestionsLimit));
        });
      }
    },
    [suggestionsLimit, autoSuggestionActive],
  );

  useEffect(() => {
    if (typing) {
      suggest(debouncedInput);
    }
  }, [debouncedInput, suggest, typing]);

  useEffect(() => {
    const nodeElementInputContainer = containerRef?.current?.suggestionsContainer?.parentElement;
    if (isDefined(nodeElementInputContainer)) {
      nodeElementInputContainer.setAttribute('aria-label', 'dydu-input-container');
      nodeElementInputContainer.setAttribute('aria-labelledby', 'dydu-input');
      nodeElementInputContainer.setAttribute('title', 'dydu-input-container');
      nodeElementInputContainer.removeAttribute('role');
      nodeElementInputContainer.removeAttribute('aria-haspopup');
      nodeElementInputContainer.removeAttribute('aria-expanded');
    }

    const nodeElementSuggestionsContainer = containerRef?.current?.suggestionsContainer;
    if (isDefined(nodeElementSuggestionsContainer)) {
      nodeElementSuggestionsContainer.setAttribute('aria-label', 'dydu-input-suggestions-container');
      nodeElementSuggestionsContainer.setAttribute('aria-labelledby', 'dydu-input-suggestions');
      nodeElementSuggestionsContainer.setAttribute('title', 'dydu-input-suggestions-container');
    }
  }, []);

  const theme = {
    container: c('dydu-input-container', classes.container),
    input: c('dydu-input-field-text', classes.fieldText),
    suggestion: c('dydu-suggestions-candidate', classes.suggestionsCandidate),
    suggestionHighlighted: c('dydu-suggestions-selected', classes.suggestionsSelected),
    suggestionsContainer: c('dydu-suggestions', classes.suggestions),
    suggestionsList: c('dydu-suggestions-list', classes.suggestionsList),
  };
  const inputProps = {
    ref: inputRef,
    disabled,
    maxLength,
    onChange,
    onKeyDown,
    placeholder: ((ready && placeholder) || t('input.placeholder') || '')?.slice?.(0, 50),
    value: input,
  };

  const actions: ActionProps[] = [
    {
      children: (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="#7091D8"
            d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z"
          />
        </svg>
      ),
      type: 'submit',
      variant: 'icon',
      title: actionSend,
      id: 'dydu-submit-action',
    },
  ];

  return (
    <form className={c('dydu-input', classes.root)} onSubmit={onSubmit} id="dydu-input" data-testid="footer-form">
      <Autosuggest
        getSuggestionValue={(suggestion) => suggestion.rootConditionReword || ''}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionsFetchRequested={({ value }) => value}
        renderInputComponent={renderInputComponent}
        renderSuggestion={(suggestion) => suggestion.rootConditionReword || ''}
        suggestions={suggestions}
        theme={theme}
        ref={containerRef}
      />
      {Voice.isEnabled && voice && counter === maxLength ? (
        <Voice
          DialogContext={DialogContext}
          configuration={configuration}
          Actions={Actions}
          show={!!Local.byBotId(dydu.getBotId()).get(Local.names.gdpr)}
          t={t('input.actions.record')}
        />
      ) : (
        counter < maxLength && <Actions actions={actions} className={c('dydu-input-actions', classes.actions)} />
      )}
    </form>
  );
}
