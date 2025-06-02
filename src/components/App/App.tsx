import { AuthProtected, AuthProvider } from '../auth/AuthContext';
import {
  Suspense,
  lazy,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  MutableRefObject,
  ComponentType,
} from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { ConversationHistoryProvider } from '../../contexts/ConversationHistoryContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { LivechatProvider } from '../../contexts/LivechatContext';
import { OidcProvider } from '../../contexts/OidcContext';
import { SamlProvider } from '../../contexts/SamlContext';
import SurveyProvider from '../../Survey/SurveyProvider';
import Teaser from '../Teaser/Teaser';
import { TopKnowledgeProvider } from '../../contexts/TopKnowledgeContext';
import { UploadFileProvider } from '../../contexts/UploadFileContext';
import { UserActionProvider } from '../../contexts/UserActionContext';
import { WelcomeKnowledgeProvider } from '../../contexts/WelcomeKnowledgeContext';
import c from 'classnames';
import { EventsProvider, useEvent } from '../../contexts/EventsContext';
import useStyles from './styles';
import { useViewMode } from '../../contexts/ViewModeProvider';
import ChatboxReadyProvider from '../../contexts/ChatboxReadyContext';
import { useTranslation } from 'react-i18next';
import CheckCookiesAllowedProvider from '../CheckCookiesAllowedProvider/CheckCookiesAllowedProvider';
import { ChatboxLoadedProvider } from '../../contexts/ChatboxLoadedProvider';
import { Local, Session } from '../../tools/storage';
import Skeleton from '../Skeleton';
import Actions from '../Actions/Actions';
import { VIEW_MODE } from '../../tools/constants';
import { GdprProvider } from '../../contexts/GdprContext';
import { BotInfoProvider } from '../../contexts/BotInfoContext';
import { ServerStatusProvider } from '../../contexts/ServerStatusContext';
import { PushrulesProvider } from '../../contexts/PushrulesContext';
import { ChatStatusProvider } from '../../contexts/ChatStatusContext';
import useViewport from "../../tools/hooks/useViewport";

const Chatbox = lazy(() =>
  lazyRetry(() => import('../Chatbox/Chatbox').then((module) => ({ default: module.ChatboxWrapper }))),
);

const lazyRetry = function (componentImport) {
  return new Promise<{ default: ComponentType<any> }>((resolve, reject) => {
    // try to import the component
    componentImport()
      .then((component) => {
        Session.clear(Session.names.retryLazyRefreshed);
        resolve(component);
      })
      .catch((error) => {
        if (!Session.get(Session.names.retryLazyRefreshed)) {
          Session.set(Session.names.retryLazyRefreshed, 'true');
          return window.location.reload();
        }
        Session.clear(Session.names.retryLazyRefreshed);
        reject(error);
      });
  });
};

interface BodyText {
  text: string;
}

/**
 * Entry point of the application. Either render the chatbox or the teaser.
 */
const App = () => {
  const { configuration } = useContext(ConfigurationContext);
  const { dispatchEvent } = useEvent();
  const { isMobile } = useViewport();
  const { ready, t } = useTranslation('translation');
  const cookiesDisclaimerRef = useRef() as MutableRefObject<HTMLDivElement>;

  const classes: any = useStyles({ configuration });

  const isCookiesDisclaimerEnabled = configuration?.cookiesDisclaimer?.enable;

  const [isOpenDisclaimer, setIsOpenDisclaimer] = useState<boolean>(false);
  const [areCookiesAllowed, setAreCookiesAllowed] = useState<boolean>(
    !isCookiesDisclaimerEnabled || Local.cookies.load(),
  ); // Cookies are allowed if disclaimer is disabled, or if disclaimer has already been accepted

  const { isMinimize, setMode } = useViewMode();
  const idLabel = 'dydu-cookies-text';

  const onAccept = () => {
    setAreCookiesAllowed(true);
    setIsOpenDisclaimer(false);
    Local.cookies.save(true);
    setMode && setMode(configuration?.application.open === VIEW_MODE.full ? VIEW_MODE.full : VIEW_MODE.popin);
  };

  const onDecline = () => {
    setIsOpenDisclaimer(false);
    Local.clearAll();
  };

  const actions = [
    {
      children: t('cookies.disclaimer.cancel'),
      id: 'dydu-disclaimer-refuse',
      onClick: onDecline,
      onTouchStart: onDecline,
      onMouseDown: onDecline,
      sidebar: true,
    },
    {
      children: t('cookies.disclaimer.ok'),
      onClick: onAccept,
      onTouchStart: onAccept,
      onMouseDown: onAccept,
      id: 'dydu-disclaimer-ok',
    },
  ];

  useEffect(() => {
    if (isOpenDisclaimer && !isMobile) {
      cookiesDisclaimerRef?.current.focus();
    }
  }, [isOpenDisclaimer]);

  const body: BodyText[] = t('cookies.disclaimer.body');

  const cookiesDisclaimer = () => {
    return (
      <div className={c('dydu-header-body', classes.cookiesDisclaimerRoot)}>
        <div ref={cookiesDisclaimerRef} tabIndex={0} className={c('dydu-header-title', classes.cookiesDisclaimerTitle)}>
          <Skeleton children={t('cookies.disclaimer.title')} hide={!ready} variant="text" width="6em" />
        </div>
        <div className={c('dydu-header-content', classes.cookiesDisclaimerContent)}>
          <Skeleton hide={!ready} variant="text" width="6em">
            {body &&
              ready &&
              body.map((item, index) => <p tabIndex={0} key={index} dangerouslySetInnerHTML={{ __html: item.text }} />)}
          </Skeleton>
          <Actions
            actions={actions}
            className={c('dydu-gdpr-disclaimer-actions', classes.cookiesDisclaimerActions)}
            groupId={idLabel}
            role="group"
          />
        </div>
      </div>
    );
  };

  const authConfiguration = useMemo(() => {
    return {
      clientId: configuration?.oidc.clientId,
      clientSecret: configuration?.oidc?.clientSecret,
      pkceActive: configuration?.oidc?.pkceActive,
      pkceMode: configuration?.oidc?.pkceMode,
      authUrl: configuration?.oidc.authUrl,
      tokenUrl: configuration?.oidc.tokenUrl,
      discoveryUrl: configuration?.oidc.discoveryUrl,
      scope: configuration?.oidc?.scopes,
    };
  }, [configuration?.oidc?.scopes]);

  if (!areCookiesAllowed && !isMinimize) {
    setMode && setMode(VIEW_MODE.minimize);
  }

  useEffect(() => {
    dispatchEvent && dispatchEvent('chatbox', 'loadChatbox');
  }, []);

  return (
    <div className={c('dydu-application', classes.root)}>
      <EventsProvider>
        <UserActionProvider>
          <ChatboxLoadedProvider areCookiesAllowed={areCookiesAllowed}>
            <Suspense fallback={null}>
              <AuthProvider configuration={authConfiguration}>
                <AuthProtected enable={configuration?.oidc?.enable}>
                  <OidcProvider>
                    <SamlProvider>
                      <GdprProvider>
                        <ChatStatusProvider>
                          <ConversationHistoryProvider>
                            <WelcomeKnowledgeProvider>
                              <TopKnowledgeProvider>
                                <ChatboxReadyProvider>
                                  <BotInfoProvider>
                                    <ServerStatusProvider>
                                      <PushrulesProvider>
                                        <DialogProvider>
                                          <SurveyProvider>
                                            <CheckCookiesAllowedProvider areCookiesAllowed={areCookiesAllowed}>
                                              <UploadFileProvider>
                                                <LivechatProvider>
                                                  <Chatbox />
                                                </LivechatProvider>
                                              </UploadFileProvider>
                                            </CheckCookiesAllowedProvider>
                                          </SurveyProvider>
                                          <Teaser
                                            id={'dydu-teaser'}
                                            toggle={
                                              areCookiesAllowed
                                                ? setMode
                                                : () => {
                                                    const newIsOpenDisclaimer = !isOpenDisclaimer;
                                                    setIsOpenDisclaimer(newIsOpenDisclaimer);
                                                    if (newIsOpenDisclaimer) {
                                                      cookiesDisclaimerRef?.current?.focus();
                                                    }
                                                  }
                                            }
                                            disclaimer={cookiesDisclaimer}
                                            openDisclaimer={isOpenDisclaimer}
                                          />
                                        </DialogProvider>
                                      </PushrulesProvider>
                                    </ServerStatusProvider>
                                  </BotInfoProvider>
                                </ChatboxReadyProvider>
                              </TopKnowledgeProvider>
                            </WelcomeKnowledgeProvider>
                          </ConversationHistoryProvider>
                        </ChatStatusProvider>
                      </GdprProvider>
                    </SamlProvider>
                  </OidcProvider>
                </AuthProtected>
              </AuthProvider>
            </Suspense>
          </ChatboxLoadedProvider>
        </UserActionProvider>
      </EventsProvider>
    </div>
  );
};

export default App;
