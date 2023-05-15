import Actions, { ActionProps } from '../Actions/Actions';
import { escapeHTML, isDefined } from '../../tools/helpers';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import Autosuggest from 'react-autosuggest';
import { DialogContext } from '../../contexts/DialogContext';
import Icon from '../Icon/Icon';
import Voice from '../Voice';
import c from 'classnames';
import dydu from '../../tools/dydu';
import icons from '../../tools/icon-constants';
import talk from '../../tools/talk';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useDebounce from '../../tools/hooks/debounce';
import { useEvent } from '../../contexts/EventsContext';
import { useLivechat } from '../../contexts/LivechatContext';
import useStyles from './styles';
import { useTheme } from 'react-jss';
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
  const counterRemaining = t('input.actions.counterRemaining');
  const [showCounterA11y, setShowCounterA11y] = useState<boolean>(false);
  const { counter: showCounter, delay, maxLength = 100 } = configuration?.input || {};
  const { limit: suggestionsLimit = 3 } = configuration?.suggestions || {};
  const themeColor = useTheme<Models.Theme>();
  const debouncedInput = useDebounce(input, delay);
  const inputRef = useRef(null);
  const containerRef = useRef<null | any>(null);
  const textareaRef = useRef<null | any>(null);

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

  const onFocus = () => {
    setShowCounterA11y(true);
  };

  const renderInputComponent = useCallback(
    (properties) => {
      const data = {
        ...properties,
      };

      const textareaId = 'dydu-textarea';
      return (
        <div className={c('dydu-input-field', classes.field)}>
          <label htmlFor={textareaId} className={c('dydu-input-label', classes.label)}>
            textarea
          </label>
          <textarea
            {...data}
            aria-describedby="characters-remaining"
            disabled={prompt || locked}
            id={textareaId}
            ref={textareaRef}
            onFocus={onFocus}
          />
          <div children={input} className={classes.fieldShadow} />
          {!!showCounter && (
            <div>
              <span children={counter} className={classes.counter} placeholder={`${counter} ${counterRemaining}`} />
              <span
                id="characters-remaining"
                className={c('dydu-counter-hidden', classes.hidden)}
                aria-label={`${counter} ${counterRemaining}`}
                aria-live="assertive"
              >{`${counter} ${counterRemaining}`}</span>
            </div>
          )}
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
      nodeElementInputContainer.setAttribute('aria-label', t('input.label'));
      nodeElementInputContainer.setAttribute('title', t('input.label'));
      nodeElementInputContainer.removeAttribute('role');
      nodeElementInputContainer.removeAttribute('aria-haspopup');
      nodeElementInputContainer.removeAttribute('aria-owns');
      nodeElementInputContainer.removeAttribute('aria-label');
    }

    const nodeElementSuggestionsContainer = containerRef?.current?.suggestionsContainer;
    const nodeElementSuggestionsChildren = containerRef?.current?.suggestionsContainer?.children;
    if (isDefined(nodeElementSuggestionsContainer)) {
      nodeElementSuggestionsContainer.setAttribute('aria-label', 'dydu-input-suggestions-container');
      nodeElementSuggestionsContainer.setAttribute('aria-labelledby', 'dydu-input-suggestions');
      nodeElementSuggestionsContainer.setAttribute('title', 'dydu-input-suggestions-container');
      if (nodeElementSuggestionsChildren.length === 0) {
        nodeElementSuggestionsContainer.setAttribute('aria-hidden', 'true');
      } else {
        nodeElementSuggestionsContainer.removeAttribute('aria-hidden');
      }
    }

    if (nodeElementSuggestionsChildren.length === 0) {
      nodeElementSuggestionsContainer.setAttribute('aria-hidden', 'true');
    } else {
      nodeElementSuggestionsContainer.removeAttribute('aria-hidden');
    }

    const nodeElementTextareaContainer = textareaRef?.current;
    nodeElementTextareaContainer.removeAttribute('aria-autocomplete');
    nodeElementTextareaContainer.removeAttribute('aria-controls');
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
      children: <Icon icon={icons?.submit || ''} color={themeColor?.palette?.primary.main} alt={actionSend} />,
      type: 'submit',
      variant: 'icon',
      title: actionSend,
      id: 'dydu-submit-action',
      testId: 'dydu-submit-footer',
    },
  ];

  const renderVoiceInput = useCallback(() => {
    return voice && counter === maxLength ? (
      <Voice show={dydu.hasUserAcceptedGdpr()} t={t('input.actions.record')} />
    ) : (
      counter < maxLength && <Actions actions={actions} className={c('dydu-input-actions', classes.actions)} />
    );
  }, [voice, counter, maxLength]);

  return (
    <form className={c('dydu-input', classes.root)} onSubmit={onSubmit} id="dydu-input">
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
      {renderVoiceInput()}
    </form>
  );
}
