import { EventsContext } from '../../contexts/EventsContext';
import { GdprContext, GdprProvider } from '../../contexts/GdprContext';
import { LOREM_HTML, LOREM_HTML_SPLIT } from '../../tools/lorem';
import { ModalContext, ModalProvider } from '../../contexts/ModalContext';
import { OnboardingContext, OnboardingProvider } from '../../contexts/OnboardingContext';
import { TabContext, TabProvider } from '../../contexts/TabContext';
import { escapeHTML, isDefined, isValidUrl } from '../../tools/helpers';
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

/**
 * Root component of the chatbox. It implements the `window` API as well.
 */

interface ChatboxProps {
  extended: boolean;
  open: boolean;
  root: any;
  toggle: (val: number) => void;
}

export default function Chatbox({ extended, open, root, toggle, ...rest }: ChatboxProps) {
  const { configuration } = useConfiguration();
  const { send } = useLivechat();
  const { minimize: minimizeChatbox } = useViewMode();
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
  const { setChatboxRefAndMarkAsLoaded, setIsAppLoaded } = useChatboxLoaded();
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
  const { mode } = useViewMode();
  const [prevMode, setPrevMode] = useState<number | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  let scrollToBottomTimeout: any = {};

  useEffect(() => {
    if (prevMode === VIEW_MODE.minimize && mode === VIEW_MODE.popin) {
      root?.current.focus();
    }
    if (mode !== undefined) {
      setPrevMode(mode);
    }
  }, [mode]);

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
      () => toggle(VIEW_MODE.close),
      () => {},
    );

  const onMinimize = () => {
    event && event('onMinimize', 'params', 'params2');
    minimizeChatbox && minimizeChatbox();
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

  const getDyduChatObject = () => {
    return {
      handleRewordClicked: (text, options) => handleRewordClicked(text, options),
      clearInteractions: () => clearInteractions && clearInteractions(),
      reply: (text) => addNotificationOrResponse && addNotificationOrResponse({ text }),
      setDialogVariable: (name, value) => {
        dydu.setDialogVariable(name, escapeHTML(value));
      },
      setRegisterContext: (name, value) => {
        dydu.setRegisterContext(name, escapeHTML(value));
      },
    };
  };

  useEffect(() => {
    if (!areWindowFunctionsCreated) {
      window.dydu = { ...window.dydu };

      window.dydu.chat = getDyduChatObject();

      window.dydu.promptEmail = {
        prompt: (type) => setPrompt && setPrompt(type),
      };

      window.dydu.localization = {
        get: () => dydu.getLocale(),
        set: (locale) => {
          return Promise.all([dydu.setLocale(locale), i18n.changeLanguage(locale)])
            .then(() => clearInteractions && clearInteractions())
            .then(() => Local.contextId.reset(dydu.getBot().id))
            .then(() => talk('#reset#', { hide: true, doNotRegisterInteraction: true }))
            .then(() => fetchTopKnowledge?.())
            .then(() => fetchWelcomeKnowledge?.());
        },
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
        toggle: (mode: number) => toggle(mode),
      };

      window.dyduClearPreviousInteractions = window.dydu.chat.empty;
      window.dyduCustomPlaceHolder = window.dydu.ui.placeholder;
      window.reword = window.dydu.chat.handleRewordClicked;
      window.rewordtest = window.dydu.chat.handleRewordClicked; //reword reference for rewords in template
      window._dydu_lockTextField = window.dydu.ui.lock;
      window.dyduKnowledgeUploadFile = window.dydu.ui.upload;

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
    toggle,
    toggleSidebar,
    gdprPassed,
    setGdprPassed,
    getDyduChatObject,
  ]);

  const classnames = c('dydu-chatbox', classes.root, {
    [classes.rootExtended]: extended,
    [classes.rootHidden]: !open,
  });
  const idLabel = 'dydu-window-label-bot';

  useEffect(() => {
    if (gdprPassed === null && !configuration?.gdprDisclaimer.enable) {
      setGdprPassed && setGdprPassed(true);
    }
  }, [gdprPassed, setGdprPassed]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - 20 <= e.target.clientHeight;
    clearTimeout(scrollToBottomTimeout);
    scrollToBottomTimeout = setTimeout(() => setShowScrollToBottom(!bottom), 300);
  };

  return (
    <div className={classnames} {...rest} role="region" aria-labelledby={idLabel} id="dydu-chatbox">
      <div tabIndex={0} ref={root} aria-label={labelChatbot}>
        <div className={classes.container}>
          <>
            <Header
              dialogRef={dialogRef}
              gdprRef={gdprRef}
              extended={extended}
              minimal={!gdprPassed || (!isOnboardingAlreadyDone && onboardingEnable)}
              onClose={onClose}
              onExpand={expandable ? (value) => toggle(value ? VIEW_MODE.full : VIEW_MODE.popin) : null}
              onMinimize={onMinimize}
            />
            {sidebarMode !== 'over' && !extended && <Sidebar anchor={root} />}
            <GdprDisclaimer gdprRef={gdprRef}>
              <Onboarding>
                <div
                  tabIndex={0}
                  className={c('dydu-chatbox-body', classes.body, {
                    [classes.bodyHidden]: sidebarActive && (sidebarMode === 'over' || extended),
                  })}
                  onScroll={handleScroll}
                >
                  <Tab
                    component={Dialog}
                    dialogRef={dialogRef}
                    interactions={interactions}
                    open={open}
                    render
                    value="dialog"
                    children
                  />
                  <Tab component={Contacts} value="contacts" children render={false} />
                  {poweredByActive && <PoweredBy />}
                </div>
                {(sidebarMode === 'over' || extended) && <Sidebar mode="over" />}
                {!current && <Footer onRequest={addRequest} onResponse={addNotificationOrResponse} />}
              </Onboarding>
            </GdprDisclaimer>
            {showScrollToBottom ? <ScrollToBottom /> : null}
          </>
          <Modal />
        </div>
      </div>
    </div>
  );
}

export function ChatboxWrapper(rest) {
  const { zoomSrc } = useDialog();
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
