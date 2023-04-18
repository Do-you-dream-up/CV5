import { EventsContext, useEvent } from '../../contexts/EventsContext';
import { GdprContext, GdprProvider } from '../../contexts/GdprContext';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import { ModalContext, ModalProvider } from '../../contexts/ModalContext';
import { OnboardingContext, OnboardingProvider } from '../../contexts/OnboardingContext';
import { TabContext, TabProvider } from '../../contexts/TabContext';
import { escapeHTML, isDefined } from '../../tools/helpers';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import Contacts from '../Contacts';
import Dialog from '../Dialog';
import { DialogContext } from '../../contexts/DialogContext';
import Dragon from '../Dragon';
import Footer from '../Footer';
import GdprDisclaimer from '../GdprDisclaimer/GdprDisclaimer';
import Header from '../Header';
import Modal from '../Modal/Modal';
import ModalClose from '../ModalClose';
import Onboarding from '../Onboarding/Onboarding';
import PoweredBy from '../PoweredBy/PoweredBy';
import { REGEX_URL } from '../../tools/constants';
import Secondary from '../Secondary';
import Tab from '../Tab';
import Zoom from '../Zoom';
import c from 'classnames';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useViewMode } from '../../contexts/ViewModeProvider';

/**
 * Root component of the chatbox. It implements the `window` API as well.
 */

interface ChatboxProps {
  extended: boolean;
  open: boolean;
  root: any;
  toggle: (val: number) => any;
}

export default function Chatbox({ extended, open, root, toggle, ...rest }: ChatboxProps) {
  const { configuration } = useConfiguration();
  const { minimize: minimizeChatbox } = useViewMode();
  const {
    add,
    addRequest,
    addResponse,
    empty,
    interactions,
    secondaryActive,
    setDisabled,
    setLocked,
    setPlaceholder,
    setPrompt,
    setSecondary,
    toggleSecondary,
    callWelcomeKnowledge,
  } = useContext(DialogContext);
  const { current } = useContext(TabContext) || {};
  const event = useContext?.(EventsContext)?.onEvent?.('chatbox');
  const { hasAfterLoadBeenCalled, onChatboxLoaded, onAppReady } = useEvent();
  const { active: onboardingActive } = useContext(OnboardingContext);
  const { gdprPassed } = useContext(GdprContext);
  const onboardingEnable = configuration?.onboarding.enable;
  const { modal } = useContext(ModalContext);
  const [ready, setReady] = useState<boolean>(false);
  const [afterLoadTriggered] = useState<boolean>(false);
  const classes = useStyles({ configuration });
  const [t, i] = useTranslation();
  const labelChatbot = t('general.labelChatbot');
  const qualification = configuration?.qualification?.active;
  const { expandable } = configuration?.chatbox || {};
  const secondaryMode = configuration?.secondary.mode;
  const dialogRef = useRef();
  const gdprRef = useRef();
  const poweredByActive = configuration?.poweredBy?.active;

  useEffect(() => {
    if (hasAfterLoadBeenCalled) callWelcomeKnowledge && callWelcomeKnowledge();
  }, [callWelcomeKnowledge, hasAfterLoadBeenCalled]);

  const ask = useCallback(
    (text, options) => {
      text = text.trim();
      if (text) {
        const toSend = {
          qualification,
          extra: options,
        };
        options = Object.assign({ hide: false }, options);
        if (!options.hide) {
          if (!REGEX_URL.test(text)) {
            addRequest && addRequest(text);
          }
        }
        talk(text, toSend).then(addResponse);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addRequest, addResponse, qualification],
  );

  const onClose = () => modal(ModalClose).then(toggle(0), () => {});

  const onMinimize = () => {
    event && event('onMinimize', 'params', 'params2');
    minimizeChatbox && minimizeChatbox();
  };

  useEffect(() => {
    if (isDefined(root.current)) {
      onChatboxLoaded && onChatboxLoaded(root.current);
    }
  }, [onChatboxLoaded, root]);

  useEffect(() => {
    if (ready) onAppReady && onAppReady();
  }, [onAppReady, ready]);

  useEffect(() => {
    if (!ready) {
      window.dydu = { ...window.dydu };
      window.dydu.chat = {
        ask: (text, options) => {
          ask(text, options);
        },
        empty: () => empty && empty(),
        reply: (text) => addResponse && addResponse({ text }),
        setDialogVariable: (name, value) => {
          dydu.setDialogVariable(name, escapeHTML(value));
        },
        setRegisterContext: (name, value) => {
          dydu.setRegisterContext(name, escapeHTML(value));
        },
      };

      window.dydu.promptEmail = {
        prompt: (type) => setPrompt && setPrompt(type),
      };

      window.dydu.localization = {
        get: () => dydu.getLocale(),
        set: (locale, languages) =>
          Promise.all([dydu.setLocale(locale, languages), i.changeLanguage(locale)]).then(
            ([locale]) =>
              window.dydu.chat.reply(`${t('interaction.languageChange')} ${t(`footer.rosetta.${locale}`)}.`),
            (response) => window.dydu.chat.reply(response),
          ),
      };

      window.dydu.lorem = {
        split: () => window.dydu.chat.reply(LOREM_HTML_SPLIT),
        standard: () => window.dydu.chat.reply(LOREM_HTML),
      };

      window.dydu.space = {
        get: (strategy) => dydu.getSpace(strategy),
        prompt: () => setPrompt && setPrompt('spaces'),
        set: (space, { quiet = true } = {}) => {
          dydu.setSpace(space);
          !quiet && window.dydu.chat.reply(`${t('interaction.spaceChange')} '${dydu.getSpace()}'.`);
        },
      };

      window.dydu.ui = {
        disable: () => setDisabled && setDisabled(true),
        enable: () => setDisabled && setDisabled(false),
        lock: (value = true) => setLocked && setLocked(value),
        placeholder: (value) => setPlaceholder && setPlaceholder(value),
        secondary: (open, { body, title }) => toggleSecondary && toggleSecondary(open, { body, title })(),
        toggle: (mode) => toggle(mode)(),
      };

      window.dyduClearPreviousInteractions = window.dydu.chat.empty;
      window.dyduCustomPlaceHolder = window.dydu.ui.placeholder;
      window.reword = window.dydu.chat.ask;
      window.rewordtest = window.dydu.chat.ask; //reword reference for rewords in template
      window._dydu_lockTextField = window.dydu.ui.lock;
    }

    setReady(true);
  }, [
    addResponse,
    ask,
    configuration?.application.defaultLanguage,
    configuration?.application.languages,
    configuration?.spaces.items,
    empty,
    i,
    modal,
    ready,
    afterLoadTriggered,
    setDisabled,
    setLocked,
    setPlaceholder,
    setPrompt,
    setSecondary,
    t,
    toggle,
    toggleSecondary,
    gdprPassed,
  ]);

  const classnames = c('dydu-chatbox', classes.root, {
    [classes.rootExtended]: extended,
    [classes.rootHidden]: !open,
  });
  const idLabel = 'dydu-window-label-bot';
  const tabIndex = parseInt('0', 10);
  return (
    <div className={classnames} ref={root} {...rest} role="region" aria-labelledby={idLabel} id="dydu-chatbox">
      <span className={classes.srOnly} tabIndex={tabIndex} id={idLabel}>
        {labelChatbot}
      </span>
      <div>
        <div className={classes.container}>
          <>
            <Header
              dialogRef={dialogRef}
              gdprRef={gdprRef}
              extended={extended}
              minimal={!gdprPassed || (onboardingActive && onboardingEnable)}
              onClose={onClose}
              onExpand={expandable ? (value) => toggle(value ? 3 : 2) : null}
              onMinimize={onMinimize}
            />
            <GdprDisclaimer gdprRef={gdprRef}>
              <Onboarding render>
                <div
                  tabIndex={tabIndex}
                  className={c('dydu-chatbox-body', classes.body, {
                    [classes.bodyHidden]: secondaryActive && (secondaryMode === 'over' || extended),
                  })}
                >
                  <Tab
                    component={Dialog}
                    dialogRef={dialogRef}
                    interactions={interactions}
                    onAdd={add}
                    open={open}
                    render
                    value="dialog"
                    children
                  />
                  <Tab component={Contacts} value="contacts" children render={false} />
                  {poweredByActive && <PoweredBy />}
                </div>
                {(secondaryMode === 'over' || extended) && <Secondary mode="over" />}
                {!current && <Footer onRequest={addRequest} onResponse={addResponse} focus />}
              </Onboarding>
            </GdprDisclaimer>
          </>
          <Modal />
          {secondaryMode !== 'over' && !extended && <Secondary anchor={root} />}
        </div>
      </div>
    </div>
  );
}

export function ChatboxWrapper(rest) {
  const { zoomSrc } = useContext(DialogContext);
  return (
    <GdprProvider>
      <OnboardingProvider>
        <ModalProvider>
          <TabProvider>
            <Dragon component={Chatbox} reset={!!rest.extended} {...rest} />
            {zoomSrc && <Zoom src={zoomSrc} />}
          </TabProvider>
        </ModalProvider>
      </OnboardingProvider>
    </GdprProvider>
  );
}