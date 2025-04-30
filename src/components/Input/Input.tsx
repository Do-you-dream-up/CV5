import Actions, { ActionProps } from '../Actions/Actions';
import { isDefined } from '../../tools/helpers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

import Autosuggest from 'react-autosuggest';
import Icon from '../Icon/Icon';
import { Local } from '../../tools/storage';
import Voice from '../Voice';
import c from 'classnames';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useDebounce from '../../tools/hooks/debounce';
import { useDialog } from '../../contexts/DialogContext';
import { useEvent } from '../../contexts/EventsContext';
import { useLivechat } from '../../contexts/LivechatContext';
import useStyles from './styles';
import { useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';
import { useShadow } from '../../contexts/ShadowProvider';
import useIdleTimeout from '../../tools/hooks/useIdleTimeout';
import Button from '../Button/Button';
import { useWelcomeKnowledge } from '../../contexts/WelcomeKnowledgeContext';
import PromiseQueue from '../../tools/hooks/PromiseQueue';
import { SendIcon } from '../CustomIcons/CustomIcons';

interface InputProps {
  onRequest?: (input: string) => void;
  onResponse?: (input: Servlet.ChatResponseValues) => void;
  focus?: () => void;
  id?: string;
}

export default function Input({ onRequest, onResponse }: InputProps) {
  const {
    send,
    typing: livechatTyping,
    isWaitingQueue,
    hasToVerifyContextAfterLivechatClosed,
    setHasToVerifyContextAfterLivechatClosed,
  } = useLivechat();
  const { dispatchEvent, isMenuListOpen } = useEvent();
  const { verifyAvailabilityDialogContext } = useWelcomeKnowledge();
  const {
    prompt,
    disabled,
    locked,
    placeholder,
    autoSuggestionActive,
    setIsWaitingForResponse,
    clearInteractions,
    getPromiseQueueList,
    setIsInputFilled,
  } = useDialog();
  const { configuration } = useConfiguration();

  const classes = useStyles();
  const [counter = 100, setCounter] = useState<number | undefined>(configuration?.input.maxLength);
  const [input, setInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const { ready, t } = useTranslation('translation');
  const actionSend = t('input.actions.send');
  const inputPlaceholder = t('input.placeholder');
  const livechatInputPlaceholder = t('input.livechat.placeholder');
  const counterRemaining = `${counter} ${t('input.actions.counterRemaining')}`;
  const { counter: showCounter, delay, maxLength = 100 } = configuration?.input || {};
  const { limit: suggestionsLimit = 3 } = configuration?.suggestions || {};
  const displayedPlaceholderTitleAriaLabel = useRef<string>('');
  const themeColor = useTheme<Models.Theme>();
  const debouncedInput = useDebounce(input, delay);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<null | any>(null);
  const textareaRef = useRef<null | any>(null);
  const { shadowAnchor } = useShadow();

  const isLivechatTypeDefined = !!Local.livechatType.load();

  const sanitizeInput = (input: string) => {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
    });
  };

  const { idleTimer } = useIdleTimeout({
    onIdle: () => {
      livechatTyping?.(input);
    },
    idleTimeout: 1000,
    disabled: !Local.livechatType.load(),
  });

  const voice = configuration?.Voice ? configuration?.Voice?.enable : false;

  const onChange = (event) => {
    setTyping(true);
    setInput(event.target.value);
    setCounter(maxLength - event.target.value.length);
    setIsInputFilled && setIsInputFilled(event.target.value.length > 0);
  };

  const resetIfNecessaryBeforeSubmit = (text): void => {
    const safeText = sanitizeInput(text.trim());
    if (Local.isDialogTimeOver() || hasToVerifyContextAfterLivechatClosed) {
      verifyAvailabilityDialogContext().then((isContextAvailable) => {
        if (!isContextAvailable) {
          clearInteractions && clearInteractions();
          PromiseQueue.exec(getPromiseQueueList()).then(() => {
            setHasToVerifyContextAfterLivechatClosed && setHasToVerifyContextAfterLivechatClosed(false);
            submit(safeText);
          });
        } else {
          submit(safeText);
        }
      });
    } else {
      submit(safeText);
    }
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.defaultPrevented) {
      event.preventDefault();
      resetIfNecessaryBeforeSubmit(input);
    }
    event.stopPropagation();
  };

  const onSubmit = (event) => {
    event.preventDefault();
    resetIfNecessaryBeforeSubmit(input);
  };

  const leaveLiveChatQueue = () => {
    send && send('#livechatleavequeue#', { hide: true });
  };

  useEffect(() => {
    idleTimer.reset();
  }, [input, Local.livechatType.load(), livechatTyping, typing]);

  const onSuggestionSelected = (event, { suggestionValue }) => {
    event.preventDefault();
    setTyping(false);
    setInput(suggestionValue);
    submit(suggestionValue);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFocusChange = (e) => {
    if (!inputFocused && e.keyCode === 9) {
      setInputFocused(true);
    }
    if (e.type === 'click') {
      setInputFocused(false);
    }
  };

  const handleBlur = () => setInputFocused(false);

  const tabIndex = useMemo(() => (isMenuListOpen ? -1 : 0), [isMenuListOpen]);
  const renderInputComponent = useCallback(
    (properties) => {
      const data = {
        ...properties,
        className: `${properties.className} ${inputFocused ? 'focus' : ''}`,
      };

      const textareaId = 'dydu-textarea';

      return (
        <div className={c('dydu-input-field', classes.field)} data-testid="footer-input">
          {/*Delete the old placeholder for RGAA compliance with new label as placeholder classes labelPlaceholder use CSS*/}
          {/*to position the new label at the same place as the old placeholder.*/}
          <label
            htmlFor={textareaId}
            id="textarea-label"
            className={c('textarea-label', input.length > 0 ? classes.hidden : classes.labelPlaceholder)}
          >
            {displayedPlaceholderTitleAriaLabel.current}
          </label>
          <textarea
            {...data}
            maxLength={!Local.livechatType.load() ? maxLength : undefined}
            disabled={prompt || locked}
            id={textareaId}
            data-testId="textareaId"
            onKeyUp={handleFocusChange}
            onBlur={handleBlur}
            tabIndex={tabIndex}
            ref={textareaRef}
            aria-labelledby="textarea-label"
            aria-describedby="counterRemaining"
          />
          <div children={input} className={classes.fieldShadow} />
          {!!showCounter && !Local.livechatType.load() && (
            <div>
              <span className={classes.counter} children={counter} aria-hidden={true} />
              <span className={c('dydu-counter-hidden', classes.hidden)} id="counterRemaining">
                {counterRemaining}
              </span>
            </div>
          )}
        </div>
      );
    },
    [
      classes.counter,
      classes.field,
      classes.fieldShadow,
      counter,
      input,
      locked,
      prompt,
      showCounter,
      inputFocused,
      tabIndex,
    ],
  );

  const reset = useCallback(() => {
    setCounter(configuration?.input.maxLength);
    setInput('');
  }, [configuration?.input.maxLength]);

  const sendInput = useCallback(
    (input, options = {}) => {
      const livechatType = Local.livechatType.load();
      setIsWaitingForResponse && !livechatType && setIsWaitingForResponse(true);
      if (livechatType) {
        send?.(input, options);
      } else {
        talk(input).then((response) => {
          onResponse && onResponse?.(response);
          setIsWaitingForResponse && setIsWaitingForResponse(false);
        });
      }
    },

    [Local.livechatType.load(), send],
  );

  const submit = useCallback(
    (text: string) => {
      const safeText = sanitizeInput(text.trim());
      if (safeText) {
        reset();
        onRequest && onRequest(safeText);
        dispatchEvent && dispatchEvent('chatbox', 'questionSent', safeText);
        sendInput(safeText);
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
      nodeElementInputContainer.removeAttribute('role');
      nodeElementInputContainer.removeAttribute('aria-haspopup');
      nodeElementInputContainer.removeAttribute('aria-owns');
      nodeElementInputContainer.removeAttribute('aria-label');
      nodeElementInputContainer.removeAttribute('aria-expanded');
    }

    const nodeElementSuggestionsContainer = containerRef?.current?.suggestionsContainer;
    const nodeElementSuggestionsChildren = containerRef?.current?.suggestionsContainer?.children;
    if (isDefined(nodeElementSuggestionsContainer)) {
      nodeElementSuggestionsContainer.setAttribute('aria-label', 'dydu-input-suggestions-container');
      nodeElementSuggestionsContainer.setAttribute('aria-labelledby', 'dydu-input-suggestions');
      nodeElementSuggestionsContainer.setAttribute('title', t('input.autosuggest'));
      if (nodeElementSuggestionsChildren?.length === 0) {
        nodeElementSuggestionsContainer.setAttribute('aria-hidden', 'true');
      } else {
        nodeElementSuggestionsContainer.removeAttribute('aria-hidden');
      }
    }

    if (nodeElementSuggestionsChildren?.length === 0) {
      nodeElementSuggestionsContainer?.setAttribute('aria-hidden', 'true');
    } else {
      nodeElementSuggestionsContainer?.removeAttribute('aria-hidden');
    }

    const textareaId = shadowAnchor?.querySelector('#' + 'dydu-textarea');
    if (isDefined(textareaId)) {
      textareaId && textareaId.removeAttribute('aria-autocomplete');
      textareaId && textareaId.removeAttribute('aria-controls');
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

  useEffect(() => {
    displayedPlaceholderTitleAriaLabel.current = (
      (ready && placeholder) ||
      (isLivechatTypeDefined ? livechatInputPlaceholder : inputPlaceholder) ||
      ''
    )?.slice?.(0, 50);
  }, [placeholder]);

  const inputProps = {
    disabled,
    maxLength,
    onChange,
    onKeyDown,
    value: input,
    title: displayedPlaceholderTitleAriaLabel.current,
  };

  const actions: ActionProps[] = [
    {
      children: (
        <Icon
          icon={<SendIcon /> || ''}
          color={themeColor?.palette?.primary.main}
          alt={actionSend}
          ariaLabel={actionSend}
        />
      ),
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
    ) : null;
  }, [voice, counter, maxLength]);

  const renderSubmit = useCallback(() => {
    return !voice
      ? counter < maxLength && <Actions actions={actions} className={c('dydu-input-actions', classes.actions)} />
      : null;
  }, [voice, counter, maxLength]);

  return isWaitingQueue ? (
    <Button
      onClick={() => {
        {
          leaveLiveChatQueue && leaveLiveChatQueue();
        }
      }}
    >
      {t('livechat.queue.leaveQueue')}
    </Button>
  ) : (
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
        data-testid="suggestId"
        focusInputOnSuggestionClick={false}
      />
      {renderVoiceInput()}
      {renderSubmit()}
    </form>
  );
}
