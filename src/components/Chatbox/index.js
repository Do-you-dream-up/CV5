import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext, DialogProvider } from '../../contexts/DialogContext';
import { ModalContext, ModalProvider } from '../../contexts/ModalContext';
import { OnboardingContext, OnboardingProvider } from '../../contexts/OnboardingContext';
import { TabProvider } from '../../contexts/TabContext';
import dydu from '../../tools/dydu';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import { Cookie } from '../../tools/storage';
import talk from '../../tools/talk';
import Contacts from '../Contacts';
import Dialog from '../Dialog';
import Dragon from '../Dragon';
import Footer from '../Footer';
import GdprDisclaimer from '../GdprDisclaimer';
import Header from '../Header';
import Modal from '../Modal';
import ModalClose from '../ModalClose';
import Onboarding from '../Onboarding';
import Secondary from '../Secondary';
import Tab from '../Tab';
import useStyles from './styles';


/**
 * Root component of the chatbox. It implements the `window` API as well.
 */
export default function Chatbox({ extended, open, root, toggle, ...rest}) {

  const { configuration } = useContext(ConfigurationContext);
  const {
    add,
    addRequest,
    addResponse,
    empty,
    interactions,
    secondaryActive,
    setDisabled,
    setPlaceholder,
    setPrompt,
    setSecondary,
    toggleSecondary,
  } = useContext(DialogContext);
  const { active: onboardingActive } = useContext(OnboardingContext);
  const { modal } = useContext(ModalContext);
  const [ gdprShowDisclaimer, setGdprShowDisclaimer ] = useState(false);
  const [ gdprPassed, setGdprPassed ] = useState(false);
  const classes = useStyles({configuration});
  const [ t, i ] = useTranslation();
  const qualification = !!configuration.application.qualification;
  const { expandable } = configuration.chatbox;
  const secondaryMode = configuration.secondary.mode;

  const ask = useCallback((text, options) => {
    text = text.trim();
    if (text && ['redirection_newpage'].indexOf(options.type) === -1) {
      options = Object.assign({hide: false}, options);
      if (!options.hide) {
        addRequest(text);
      }
      talk(text, {qualification}).then(addResponse);
    }
  }, [addRequest, addResponse, qualification]);

  const onClose = () => modal(ModalClose).then(toggle(0), () => {});

  const onMinimize = () => toggle(1)();

  useEffect(() => {
    if (!window.dydu) {
      window.dydu = {};

      window.dydu.chat = {
        ask: (text, options) => ask(text, options),
        empty: () => empty(),
        reply: text => addResponse({text}),
        set: (name, value) => dydu.variable(name, value),
      };

      window.dydu.gdpr = {
        prompt: () => setPrompt('gdpr'),
      };

      window.dydu.localization = {
        get: () => dydu.getLocale(),
        set: locale => Promise.all([dydu.setLocale(locale), i.changeLanguage(locale)]).then(
          ([ locale ]) => window.dydu.chat.reply(`New locale set: '${locale}'.`),
          response => window.dydu.chat.reply(response),
        ),
      };

      window.dydu.lorem = {
        split: () => window.dydu.chat.reply(LOREM_HTML_SPLIT),
        standard: () => window.dydu.chat.reply(LOREM_HTML),
      };

      window.dydu.space = {
        get: strategy => dydu.getSpace(strategy),
        prompt: () => setPrompt('spaces'),
        set: (space, { quiet } = {}) => dydu.setSpace(space).then(
          space => !quiet && window.dydu.chat.reply(`New space set: '${space}'.`),
          () => {},
        ),
      };

      window.dydu.ui = {
        disable: () => setDisabled(true),
        enable: () => setDisabled(false),
        placeholder: value => setPlaceholder(value),
        secondary: (open, { body, title }) => toggleSecondary(open, {body, title})(),
        toggle: mode => toggle(mode)(),
      };

      window.dyduClearPreviousInteractions = window.dydu.chat.empty;
      window.dyduCustomPlaceHolder = window.dydu.ui.placeholder;
      window.reword = window.dydu.chat.ask;
    }
  }, [
    addResponse,
    ask,
    empty,
    i,
    modal,
    setDisabled,
    setPlaceholder,
    setPrompt,
    setSecondary,
    t,
    toggle,
    toggleSecondary,
  ]);

  useEffect(() => {
    if (gdprShowDisclaimer) {
      setGdprShowDisclaimer(false);
      modal(GdprDisclaimer, null, {dismissable: false, variant: 'full'}).then(
        () => {
          Cookie.set(Cookie.names.gdpr, undefined, Cookie.duration.long);
          setGdprPassed(true);
        },
        () => {
          setGdprShowDisclaimer(true);
          toggle(1)();
        },
      );
    }
  }, [gdprShowDisclaimer, modal, toggle]);

  useEffect(() => {
    if (!Cookie.get(Cookie.names.gdpr)) {
      setGdprShowDisclaimer(true);
    }
    else {
      setGdprPassed(true);
    }
  }, []);

  const classnames = c('dydu-chatbox', classes.root, {
    [classes.rootExtended]: extended,
    [classes.rootHidden]: !open,
  });
  return (
    <TabProvider>
      <div className={classnames} ref={root} {...rest}>
        <div>
          <div className={classes.container}>
            {gdprPassed && (
              <>
                <Onboarding render>
                  <div className={c(
                    'dydu-chatbox-body',
                    classes.body,
                    {[classes.bodyHidden]: secondaryActive && (secondaryMode === 'over' || extended)},
                  )}>
                    <Tab component={Dialog}
                         interactions={interactions}
                         onAdd={add}
                         render
                         value="dialog" />
                    <Tab component={Contacts} value="contacts" />
                  </div>
                  {(secondaryMode === 'over' || extended) && <Secondary mode="over" />}
                  <Footer onRequest={addRequest} onResponse={addResponse} />
                </Onboarding>
              </>
            )}
            <Header extended={extended}
                    minimal={!gdprPassed || onboardingActive}
                    onClose={onClose}
                    onExpand={expandable ? value => toggle(value ? 3 : 2) : null}
                    onMinimize={onMinimize}
                    style={{order: -1}} />
            <Modal />
            {secondaryMode !== 'over' && !extended && <Secondary anchor={root} />}
          </div>
        </div>
      </div>
    </TabProvider>
  );
}


Chatbox.propTypes = {
  extended: PropTypes.bool,
  open: PropTypes.bool,
  root: PropTypes.shape({current: PropTypes.instanceOf(Element)}),
  toggle: PropTypes.func.isRequired,
};


export function ChatboxWrapper(rest) {
  return (
    <DialogProvider>
      <OnboardingProvider>
        <ModalProvider>
          <Dragon component={Chatbox} reset={!!rest.extended} {...rest} />
        </ModalProvider>
      </OnboardingProvider>
    </DialogProvider>
  );
}
