import { Cookie, Local } from '../../tools/storage';
import { EventsContext, useEvent } from '../../contexts/EventsContext';
import { GdprContext, GdprProvider } from '../../contexts/GdprContext';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import { ModalContext, ModalProvider } from '../../contexts/ModalContext';
import { OnboardingContext, OnboardingProvider } from '../../contexts/OnboardingContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { TabContext, TabProvider } from '../../contexts/TabContext';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Contacts from '../Contacts';
import Dialog from '../Dialog';
import { DialogContext } from '../../contexts/DialogContext';
import Dragon from '../Dragon';
import Footer from '../Footer';
import GdprDisclaimer from '../GdprDisclaimer';
import Header from '../Header';
import Modal from '../Modal';
import ModalClose from '../ModalClose';
import Onboarding from '../Onboarding';
import PropTypes from 'prop-types';
import { RE_REWORD } from '../../tools/constants';
import Secondary from '../Secondary';
import Tab from '../Tab';
import Zoom from '../Zoom';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { encode } from '../../tools/cipher';
import { isDefined } from '../../tools/helpers';
import talk from '../../tools/talk';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Root component of the chatbox. It implements the `window` API as well.
 */
export default function Chatbox({ extended, open, root, toggle, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
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
  const event = useContext(EventsContext).onEvent('chatbox');
  const { onChatboxLoaded } = useEvent();
  const { active: onboardingActive } = useContext(OnboardingContext);
  const { gdprPassed } = useContext(GdprContext);
  const onboardingEnable = configuration.onboarding.enable;
  const { modal } = useContext(ModalContext);
  const [ready, setReady] = useState(false);
  const [afterLoadTriggered, setAfterLoadTriggered] = useState(false);
  const classes = useStyles({ configuration });
  const [t, i] = useTranslation();
  const labelChatbot = t('general.labelChatbot');
  const qualification =
    window.DYDU_QUALIFICATION_MODE !== undefined ? window.DYDU_QUALIFICATION_MODE : process.env.QUALIFICATION;
  const { expandable } = configuration.chatbox;
  const secondaryMode = configuration.secondary.mode;
  const dialogRef = useRef();
  const gdprRef = useRef();

  useEffect(() => {
    if (ready && afterLoadTriggered) {
      callWelcomeKnowledge();
    }
    // eslint-disable-next-line
  }, [ready, afterLoadTriggered]);

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
          if (!RE_REWORD) {
            addRequest(text);
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
    event('onMinimize', 'params', 'params2');
    toggle(1)();
  };

  useEffect(() => {
    if (isDefined(root.current)) {
      onChatboxLoaded(root.current);
    }
  }, [onChatboxLoaded, root]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (typeof window.dyduAfterLoad === 'function') {
      const dyduAfterLoad = async () => {
        await window.dyduAfterLoad();
      };
      dyduAfterLoad().then(() => {
        setAfterLoadTriggered(true);
      });
    } else {
      setAfterLoadTriggered(true);
    }
  }, [ready]);

  useEffect(() => {
    if (!ready && !afterLoadTriggered) {
      window.dydu = { ...window.dydu };

      window.dydu.chat = {
        ask: (text, options) => ask(text, options),
        empty: () => empty(),
        reply: (text) => addResponse({ text }),
        setDialogVariable: (name, value) => dydu.setDialogVariable(name, value),
        setRegisterContext: (name, value) => dydu.setRegisterContext(name, value),
      };

      window.dydu.promptEmail = {
        prompt: (type) => setPrompt(type),
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
        prompt: () => setPrompt('spaces'),
        set: (space, { quiet = true } = {}) =>
          dydu.setSpace(space).then(
            (space) => !quiet && window.dydu.chat.reply(`${t('interaction.spaceChange')} '${space}'.`),
            () => {},
          ),
      };

      window.dydu.ui = {
        disable: () => setDisabled(true),
        enable: () => setDisabled(false),
        lock: (value = true) => setLocked(value),
        placeholder: (value) => setPlaceholder(value),
        secondary: (open, { body, title }) => toggleSecondary(open, { body, title })(),
        toggle: (mode) => toggle(mode)(),
      };

      window.dyduClearPreviousInteractions = window.dydu.chat.empty;
      window.dyduCustomPlaceHolder = window.dydu.ui.placeholder;
      window.reword = window.dydu.chat.ask;
      window.rewordtest = window.dydu.chat.ask; //reword reference for rewords in template
      window._dydu_lockTextField = window.dydu.ui.lock;
    }

    if (window.dydu.localization.get() && !configuration.application.languages.includes(window.dydu.localization.get()))
      window.dydu.localization.set(configuration.application.defaultLanguage[0], configuration.application.languages);

    if (configuration.spaces.items && configuration.spaces.items.length === 1)
      window.dydu.space.set(window.dydu.space.get() ? window.dydu.space.get() : configuration.spaces.items[0], {
        quiet: true,
      });
    setReady(true);
  }, [
    addResponse,
    ask,
    configuration.application.defaultLanguage,
    configuration.application.languages,
    configuration.spaces.items,
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

  const cookieStringKeyUniqueVisitor = useCallback(async () => {
    const botId = await dydu.getBotId();
    const currentSpace = Local.get(Local.names.space);
    const currentLanguage = Local.get(Local.names.locale);
    return `DYDU_lastvisitfor_${botId}_${currentSpace}_${currentLanguage}`;
  }, []);

  useEffect(() => {
    cookieStringKeyUniqueVisitor().then((visitorCookieValue) => {
      if (gdprPassed && !Cookie.get(visitorCookieValue)) {
        dydu.welcomeCall({ qualification }).then(
          () => Cookie.set(visitorCookieValue, encode(new Date().toISOString()), undefined),
          () => {},
        );
      }
    });
  }, [cookieStringKeyUniqueVisitor, gdprPassed, qualification]);

  const classnames = c('dydu-chatbox', classes.root, {
    [classes.rootExtended]: extended,
    [classes.rootHidden]: !open,
  });
  return (
    <div className={classnames} ref={root} {...rest} role="region" aria-labelledby={labelChatbot}>
      <span className={classes.srOnly} tabIndex="-1">
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
                  tabIndex="0"
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
                  />
                  <Tab component={Contacts} value="contacts" />
                </div>
                {(secondaryMode === 'over' || extended) && <Secondary mode="over" />}
                {!current && <Footer onRequest={addRequest} onResponse={addResponse} />}
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

Chatbox.propTypes = {
  extended: PropTypes.bool,
  open: PropTypes.bool,
  root: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  toggle: PropTypes.func.isRequired,
};

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
