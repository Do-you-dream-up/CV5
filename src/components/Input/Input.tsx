import Actions, { ActionProps } from '../Actions/Actions';
import { isDefined, sanitize } from '../../tools/helpers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { useChatboxReady } from '../../contexts/ChatboxReadyContext';

interface InputProps {
  onRequest?: (input: string) => void;
  onResponse?: (input: Servlet.ChatResponseValues) => void;
  setHasTTSError?: (value: boolean) => void;
  focus?: () => void;
  id?: string;
}

export default function Input({ onRequest, onResponse, setHasTTSError }: InputProps) {
  const {
    send,
    typing: livechatTyping,
    isWaitingQueue,
    hasToVerifyContextAfterLivechatClosed,
    setHasToVerifyContextAfterLivechatClosed,
  } = useLivechat();
  const { isChatboxReady } = useChatboxReady();
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
  const [input, setInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const { ready, t } = useTranslation('translation');
  const actionSend = t('input.actions.send');
  const inputPlaceholder = t('input.placeholder');
  const livechatInputPlaceholder = t('input.livechat.placeholder');
  const { limit: suggestionsLimit = 3 } = configuration?.suggestions || {};
  const displayedPlaceholderTitleAriaLabel = useRef<string>('');
  const themeColor = useTheme<Models.Theme>();
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<null | any>(null);
  const textareaRef = useRef<null | any>(null);
  const { shadowAnchor } = useShadow();
  const isLivechatTypeDefined = !!Local.livechatType.load();

  const { counter: showCounter, delay = 300, maxLength = 100 } = configuration?.input || {};
  const debouncedInput = useDebounce(input, delay);
  const livechatMaxLength = 1024; //bdd limit for userTalk column

  const counterRemaining = useRef<number>(configuration?.input.maxLength ? configuration?.input.maxLength : 100);
  const inputMaxLength = isLivechatTypeDefined ? livechatMaxLength : maxLength;
  const tooltipCounterRemaining = `${counterRemaining.current} ${t('input.actions.counterRemaining')}`;

  const { idleTimer } = useIdleTimeout({
    onIdle: () => {
      livechatTyping?.(input);
    },
    idleTimeout: 1000,
    disabled: !isLivechatTypeDefined,
  });

  const voice = configuration?.Voice ? configuration?.Voice?.enable : false;

  const onChange = (event) => {
    setTyping(true);
    setInput(event.target.value);
    counterRemaining.current = inputMaxLength - event.target.value.length;
    setIsInputFilled && setIsInputFilled(event.target.value.length > 0);
  };

  const resetIfNecessaryBeforeSubmit = (text): void => {
    const safeText = sanitize(text.trim());
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
  }, [input, isLivechatTypeDefined, livechatTyping, typing]);

  useEffect(() => {
    counterRemaining.current = inputMaxLength - input?.length;
  }, [isLivechatTypeDefined, input]);

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
            maxLength={inputMaxLength}
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
          {!!showCounter && (
            <div>
              <span className={classes.counter} children={counterRemaining.current} aria-hidden={true} />
              <span className={c('dydu-counter-hidden', classes.hidden)} id="counterRemaining">
                {tooltipCounterRemaining}
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
      counterRemaining.current,
      input,
      locked,
      prompt,
      showCounter,
      inputFocused,
      tabIndex,
    ],
  );

  const reset = useCallback(() => {
    counterRemaining.current = inputMaxLength - input?.length;
    setInput('');
  }, [isLivechatTypeDefined, input]);

  const sendInput = useCallback(
    (input, options = {}) => {
      const livechatType = isLivechatTypeDefined;
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

    [isLivechatTypeDefined, send],
  );

  const submit = useCallback(
    (text: string) => {
      const safeText = sanitize(text.trim());
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
    length: inputMaxLength,
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
    return voice && counterRemaining.current === inputMaxLength ? (
      <Voice show={dydu.hasUserAcceptedGdpr()} setHasTTSError={setHasTTSError} t={t('input.actions.record')} />
    ) : null;
  }, [voice, counterRemaining, inputMaxLength]);

  const renderSubmit = useCallback(() => {
    return !voice
      ? counterRemaining.current < inputMaxLength && <Actions actions={actions} className={c('dydu-input-actions', classes.actions)} />
      : null;
  }, [voice, counterRemaining, inputMaxLength]);

  return isWaitingQueue ? (
    <Button
      onClick={() => {
        {
          leaveLiveChatQueue && leaveLiveChatQueue();
        }
      }}
      disabled={!isChatboxReady}
    >
      {t('livechat.queue.leaveQueue')}
    </Button>
  ) : (
    <>
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
    </>
  );
}
