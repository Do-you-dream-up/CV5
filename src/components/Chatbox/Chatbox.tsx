import { EventsContext } from '../../contexts/EventsContext';
import { GdprContext } from '../../contexts/GdprContext';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import { ModalContext, ModalProvider } from '../../contexts/ModalContext';
import { OnboardingContext, OnboardingProvider } from '../../contexts/OnboardingContext';
import { TabContext, TabProvider } from '../../contexts/TabContext';
import { escapeHTML, getChatboxId, isDefined, isValidUrl } from '../../tools/helpers';
import { useContext, useEffect, useRef, useState } from 'react';

import Contacts from '../Contacts';
import Dialog from '../Dialog/Dialog';
import { useDialog } from '../../contexts/DialogContext';
import Dragon from '../Dragon';
import Footer from '../Footer/Footer';
import GdprDisclaimer from '../GdprDisclaimer/GdprDisclaimer';
import Header from '../Header';
import { Local } from '../../tools/storage';
import Modal from '../Modal/Modal';
import ModalClose from '../ModalClose';
import Onboarding from '../Onboarding/Onboarding';
import PoweredBy from '../PoweredBy/PoweredBy';
import Sidebar from '../Sidebar';
import Tab from '../Tab';
import { E_QUESTION_TYPE, VIEW_MODE } from '../../tools/constants';
import Zoom from '../Zoom';
import c from 'classnames';
import dydu from '../../tools/dydu';
import talk from '../../tools/talk';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useLivechat } from '../../contexts/LivechatContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useUploadFile } from '../../contexts/UploadFileContext';
import { useViewMode } from '../../contexts/ViewModeProvider';
import { useWelcomeKnowledge } from '../../contexts/WelcomeKnowledgeContext';
import ScrollToBottom from '../ScrollToBottom/ScrollToBottom';
import { useChatboxLoaded } from '../../contexts/ChatboxLoadedProvider';
import { useTopKnowledge } from '../../contexts/TopKnowledgeContext';
import { useUserAction } from '../../contexts/UserActionContext';
import { useShadow } from '../../contexts/ShadowProvider';

/**
 * Root component of the chatbox. It implements the `window` API as well.
 */

interface ChatboxProps {
  root: any;
}

export default function Chatbox({ root, ...rest }: ChatboxProps) {
  const { configuration, update } = useConfiguration();
  const { send } = useLivechat();
  const { mode, setMode, isFull, isOpen } = useViewMode();
  const {
    addRequest,
    clearInteractions,
    interactions,
    sidebarActive,
    setDisabled,
    setLocked,
    setPlaceholder,
    setPrompt,
    setSidebar,
    toggleSidebar,
  } = useDialog();
  const { addNotificationOrResponse } = useLivechat();
  const { showUploadFileButton } = useUploadFile();
  const { current } = useContext(TabContext) || {};
  const event = useContext?.(EventsContext)?.onEvent?.('chatbox');
  const { setChatboxRefAndMarkAsLoaded, setIsAppLoaded, hasAfterLoadBeenCalled } = useChatboxLoaded();
  const { isOnboardingAlreadyDone } = useContext(OnboardingContext);
  const { gdprPassed, setGdprPassed } = useContext(GdprContext);
  const onboardingEnable = configuration?.onboarding.enable;
  const { modal } = useContext(ModalContext);
  const [areWindowFunctionsCreated, setAreWindowFunctionsCreated] = useState<boolean>(false);
  const [afterLoadTriggered] = useState<boolean>(false);
  const classes = useStyles({ configuration });
  const [t, i18n] = useTranslation();
  const labelChatbot = t('general.labelChatbot');
  const qualification = configuration?.qualification?.active;
  const { expandable } = configuration?.chatbox || {};
  const sidebarMode = configuration?.sidebar.mode;
  const dialogRef = useRef();
  const gdprRef = useRef();
  const poweredByActive = configuration?.poweredBy?.active;
  const { fetchWelcomeKnowledge } = useWelcomeKnowledge();
  const { fetch: fetchTopKnowledge } = useTopKnowledge();
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const { eventFired } = useUserAction();
  const { shadowRoot } = useShadow();

  let scrollToBottomTimeout: any = {};

  const isPushCondition = (text) => {
    return text.startsWith('_pushcondition_');
  };

  const handleRewordClicked = (text, options) => {
    text = text.trim();
    if (text) {
      const toSend = {
        qualification,
        ...(options.doNotRegisterInteraction && {
          doNotRegisterInteraction: options.doNotRegisterInteraction,
        }),
        extra: options,
      };

      options = JSON.parse(JSON.stringify(options));
      options.hide |= isPushCondition(text) || options.fromSurvey;

      if (
        (toSend.extra.type === E_QUESTION_TYPE.redirection ||
          toSend.extra.type === E_QUESTION_TYPE.redirection_newpage) &&
        !isValidUrl(text)
      ) {
        toSend.extra.type = E_QUESTION_TYPE.redirection_invalidlink;
        options.type = E_QUESTION_TYPE.redirection_invalidlink;
      }

      if (
        !options.hide &&
        options.type !== E_QUESTION_TYPE.redirection &&
        options.type !== E_QUESTION_TYPE.redirection_newpage &&
        options.type !== E_QUESTION_TYPE.redirection_invalidlink &&
        (options.type?.startsWith('redirection') ||
          options.type?.startsWith('reword') ||
          options.type?.startsWith('ask'))
      ) {
        addRequest && addRequest(text);
      }

      if (Local.livechatType.load()) {
        send && send(text, options);
      } else {
        talk(text, toSend).then(addNotificationOrResponse);
      }
    }
  };

  const onClose = () =>
    modal(ModalClose).then(
      () => setMode(VIEW_MODE.close),
      () => {},
    );

  const onMinimize = () => {
    event && event('onMinimize', 'params', 'params2');
    setMode && setMode(VIEW_MODE.minimize);
  };

  useEffect(() => {
    if (isDefined(root.current)) {
      setChatboxRefAndMarkAsLoaded && setChatboxRefAndMarkAsLoaded(root.current);
    }
  }, [setChatboxRefAndMarkAsLoaded, root]);

  useEffect(() => {
    if (areWindowFunctionsCreated) {
      setIsAppLoaded && setIsAppLoaded(true);
    }
  }, [areWindowFunctionsCreated]);

  useEffect(() => {
    if (!areWindowFunctionsCreated) {
      window.dydu = { ...window.dydu }; // ensure window.dydu is a JSON and if eventually defined before, keep previous values

      window.dydu.chat = {
        setRegisterContext: (name, value) => dydu.setRegisterContext(name, escapeHTML(value)),
        handleRewordClicked: (text, options) => handleRewordClicked(text, options),
        clearInteractions: () => clearInteractions && clearInteractions(),
        reply: (text) => addNotificationOrResponse && addNotificationOrResponse({ text }),
        setDialogVariable: (name, value) => dydu.setDialogVariable(name, escapeHTML(value)),
      };

      window.dydu.promptEmail = {
        prompt: (type) => setPrompt && setPrompt(type),
      };

      window.dydu.localization = {
        get: () => dydu.getLocale(),
        set: (locale) => {
          return talk('#reset#', { hide: true, doNotRegisterInteraction: true })
            .then(() => Promise.all([dydu.setLocale(locale, true)]))
            .then(() => Local.locale.save(locale))
            .then(() => clearInteractions && clearInteractions())
            .then(() => Local.contextId.reset(dydu.getBot().id))
            .then(() => fetchTopKnowledge?.())
            .then(() => fetchWelcomeKnowledge?.());
        },
      };

      window.dydu.newdialog = () => {
        return talk('#reset#', { hide: true, doNotRegisterInteraction: true })
          .then(() => Local.contextId.reset(dydu.getBot().id))
          .then(() => fetchTopKnowledge?.())
          .then(() => fetchWelcomeKnowledge?.());
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
        upload: () => showUploadFileButton(),
        placeholder: (value) => setPlaceholder && setPlaceholder(value),
        sidebar: (open: boolean, { body, title }) => toggleSidebar && toggleSidebar(open, { body, title })(),
        toggle: (mode: number) => setMode(mode),
      };

      window.dyduClearPreviousInteractions = window.dydu.chat.empty;
      window.dyduCustomPlaceHolder = window.dydu.ui.placeholder;
      window.reword = window.dydu.chat.handleRewordClicked;
      window.rewordtest = window.dydu.chat.handleRewordClicked; //reword reference for rewords in template
      window._dydu_lockTextField = window.dydu.ui.lock;
      window.dyduKnowledgeUploadFile = window.dydu.ui.upload;
      window.dydu.maximizeIframe = () => {
        setMode(VIEW_MODE.full);
        update('chatbox', 'margin', 0);
      };

      // listen messages from parent to execute corresponding window.dydu functions
      window.addEventListener('message', function (msg) {
        if (msg.data) {
          if (msg.data.type === 'window.dydu' && msg.data.target === getChatboxId()) {
            const toExecute = 'window.dydu.' + msg.data.content;
            // console.log(getChatboxId() + ' will execute ' + toExecute);
            eval(toExecute);
          }
        }
      });

      setAreWindowFunctionsCreated(true);
    }
  }, [
    addNotificationOrResponse,
    handleRewordClicked,
    configuration?.application.defaultLanguage,
    configuration?.application.languages,
    configuration?.spaces.items,
    clearInteractions,
    i18n,
    modal,
    areWindowFunctionsCreated,
    afterLoadTriggered,
    setDisabled,
    setLocked,
    setPlaceholder,
    setPrompt,
    setSidebar,
    t,
    setMode,
    toggleSidebar,
    gdprPassed,
    setGdprPassed,
  ]);

  const classnames = c('dydu-chatbox', classes.root, {
    [classes.rootExtended]: isFull,
    [classes.rootHidden]: !isOpen,
  });
  const idLabel = 'dydu-window-label-bot';

  useEffect(() => {
    if (!configuration?.gdprDisclaimer.enable) {
      setGdprPassed && setGdprPassed(true);
    }
  }, [gdprPassed, setGdprPassed]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - 20 <= e.target.clientHeight;
    clearTimeout(scrollToBottomTimeout);
    scrollToBottomTimeout = setTimeout(() => setShowScrollToBottom(!bottom), 300);
  };

  // UseEffect to handle the tab key press event and keep focus in chatbox. If you change first or last focusable element in chatbox
  // you need to change focusableElements array.
  // We use shadowRoot.activeElement to get the active element inside the shadowRoot.
  useEffect(() => {
    const rootElement = root.current;
    const focusableElements = rootElement ? rootElement.querySelectorAll('button, textarea') : [];
    if (focusableElements.length > 0 && eventFired?.key === 'Tab') {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (eventFired?.shiftKey && shadowRoot?.activeElement === firstElement) {
        eventFired?.preventDefault();
        lastElement.focus();
      } else if (!eventFired?.shiftKey && shadowRoot?.activeElement === lastElement) {
        eventFired?.preventDefault();
        firstElement.focus();
      }
    }
  }, [eventFired]);

  return (
    <div className={classnames} {...rest} role="region" id="dydu-chatbox">
      <div ref={root} aria-label={labelChatbot} role="dialog" aria-modal={true} id="dydu-root-focus">
        {hasAfterLoadBeenCalled ? (
          <div className={classes.container}>
            <>
              {(!isFull || configuration?.chatbox?.margin !== 0) && (
                <Header
                  dialogRef={dialogRef}
                  gdprRef={gdprRef}
                  extended={isFull}
                  minimal={!gdprPassed || (!isOnboardingAlreadyDone && onboardingEnable)}
                  onClose={onClose}
                  onExpand={expandable ? (value) => setMode(value ? VIEW_MODE.full : VIEW_MODE.popin) : null}
                  onMinimize={onMinimize}
                />
              )}
              {sidebarMode !== 'over' && !isFull && <Sidebar anchor={root} />}
              <GdprDisclaimer gdprRef={gdprRef}>
                <Onboarding>
                  <div
                    className={c('dydu-chatbox-body', classes.body, {
                      [classes.bodyHidden]: sidebarActive && (sidebarMode === 'over' || isFull),
                    })}
                    onScroll={handleScroll}
                    tabIndex={-1}
                  >
                    <Tab
                      component={Dialog}
                      dialogRef={dialogRef}
                      interactions={interactions}
                      open={isOpen}
                      render
                      value="dialog"
                      children
                    />
                    <Tab component={Contacts} value="contacts" children render={false} />
                    {poweredByActive && <PoweredBy />}
                  </div>
                  {(sidebarMode === 'over' || isFull) && <Sidebar mode="over" />}
                  {!current && <Footer onRequest={addRequest} onResponse={addNotificationOrResponse} />}
                </Onboarding>
              </GdprDisclaimer>
              {showScrollToBottom ? <ScrollToBottom /> : null}
            </>
            <Modal />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ChatboxWrapper(rest) {
  const { zoomSrc } = useDialog();
  const { isFull } = useViewMode();
  return (
    <OnboardingProvider>
      <ModalProvider>
        <TabProvider>
          <Dragon component={Chatbox} reset={!!isFull} {...rest} />
          {zoomSrc && <Zoom src={zoomSrc} />}
        </TabProvider>
      </ModalProvider>
    </OnboardingProvider>
  );
}
