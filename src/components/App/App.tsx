import { AuthProtected, AuthProvider } from '../auth/AuthContext';
import { Suspense, lazy, useContext, useEffect, useMemo, useState, useRef, MutableRefObject } from 'react';

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
import { hasWizard } from '../../tools/wizard';
import { EventsProvider, useEvent } from '../../contexts/EventsContext';
import useStyles from './styles';
import { useViewMode } from '../../contexts/ViewModeProvider';
import ChatboxReadyProvider from '../../contexts/ChatboxReadyContext';
import { useTranslation } from 'react-i18next';
import CheckCookiesAllowedProvider from '../CheckCookiesAllowedProvider/CheckCookiesAllowedProvider';
import { ChatboxLoadedProvider } from '../../contexts/ChatboxLoadedProvider';
import { Local } from '../../tools/storage';
import Skeleton from '../Skeleton';
import Actions from '../Actions/Actions';
import { VIEW_MODE } from '../../tools/constants';

const Chatbox = lazy(() => import('../Chatbox/Chatbox').then((module) => ({ default: module.ChatboxWrapper })));
const Wizard = lazy(() => import('../Wizard'));

interface BodyText {
  text: string;
}

/**
 * Entry point of the application. Either render the chatbox or the teaser.
 *
 * Optionally render the Wizard when the `dydupanel` URL parameter is found.
 */
const App = () => {
  const { configuration } = useContext(ConfigurationContext);
  const { dispatchEvent } = useEvent();
  const { ready, t } = useTranslation('translation');
  const cookiesDisclaimerRef = useRef() as MutableRefObject<HTMLDivElement>;

  const classes: any = useStyles({ configuration });

  const isCookiesDisclaimerEnabled = configuration?.cookiesDisclaimer?.enable;

  const [isOpenDisclaimer, setIsOpenDisclaimer] = useState<boolean>(false);
  const [areCookiesAllowed, setAreCookiesAllowed] = useState<boolean>(
    !isCookiesDisclaimerEnabled || Local.cookies.load(),
  ); // Cookies are allowed if disclaimer is disabled, or if disclaimer has already been accepted

  const { mode, isOpen: isChatboxOpen, isFull: isChatboxFullScreen, isMinimize, toggle } = useViewMode();
  const idLabel = 'dydu-cookies-text';

  const onAccept = () => {
    setAreCookiesAllowed(true);
    setIsOpenDisclaimer(false);
    Local.cookies.save(true);
    toggle && toggle(VIEW_MODE.popin);
  };

  const onDecline = () => {
    setIsOpenDisclaimer(false);
    localStorage.clear();
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

  const body: BodyText[] = t('cookies.disclaimer.body');

  const cookiesDisclaimer = () => {
    return (
      <div className={c('dydu-header-body', classes.cookiesDisclaimerRoot)}>
        <div ref={cookiesDisclaimerRef} tabIndex={0} className={c('dydu-header-title', classes.cookiesDisclaimerTitle)}>
          <Skeleton children={t('cookies.disclaimer.title')} hide={!ready} variant="text" width="6em" />
        </div>
        <div tabIndex={0} className={c('dydu-header-content', classes.cookiesDisclaimerContent)}>
          <Skeleton hide={!ready} variant="text" width="6em">
            {body &&
              ready &&
              body.map((item, index) => <p key={index} tabIndex={0} dangerouslySetInnerHTML={{ __html: item.text }} />)}
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
    toggle && toggle(VIEW_MODE.minimize);
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
              {hasWizard() && <Wizard />}
              <AuthProvider configuration={authConfiguration}>
                <AuthProtected enable={configuration?.oidc?.enable}>
                  <OidcProvider>
                    <SamlProvider>
                      <ConversationHistoryProvider>
                        <WelcomeKnowledgeProvider>
                          <TopKnowledgeProvider>
                            <ChatboxReadyProvider>
                              <DialogProvider>
                                <SurveyProvider>
                                  <CheckCookiesAllowedProvider areCookiesAllowed={areCookiesAllowed}>
                                    <UploadFileProvider>
                                      <LivechatProvider>
                                        <Chatbox
                                          extended={isChatboxFullScreen}
                                          open={isChatboxOpen}
                                          toggle={toggle}
                                          mode={mode}
                                        />
                                      </LivechatProvider>
                                    </UploadFileProvider>
                                  </CheckCookiesAllowedProvider>
                                </SurveyProvider>
                                <Teaser
                                  id={'dydu-teaser'}
                                  toggle={
                                    areCookiesAllowed
                                      ? toggle
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
                            </ChatboxReadyProvider>
                          </TopKnowledgeProvider>
                        </WelcomeKnowledgeProvider>
                      </ConversationHistoryProvider>
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
