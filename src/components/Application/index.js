import '../../../public/override/style.css';
import '../../../public/chatboxHomepage.css';

import { AuthProtected, AuthProvider } from '../../components/auth/context/AuthContext';
import { Suspense, lazy, useContext, useEffect, useMemo } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { EventsContext } from '../../contexts/EventsContext';
import { LivechatProvider } from '../../contexts/LivechatContext';
import { OidcProvider } from '../../contexts/OidcContext';
import { SamlProvider } from '../../contexts/SamlContext';
import SurveyProvider from '../../Survey/SurveyProvider';
import Teaser from '../Teaser';
import { UserActionProvider } from '../../contexts/UserActionContext';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { hasWizard } from '../../tools/wizard';
import useStyles from './styles';
import { useViewMode } from '../../contexts/ViewModeProvider';

const Chatbox = lazy(() =>
  import(
    // webpackChunkName: "chatbox"
    '../Chatbox'
  ).then((module) => ({ default: module.ChatboxWrapper })),
);
const Wizard = lazy(() =>
  import(
    // webpackChunkName: "wizard"
    '../Wizard'
  ),
);

/**
 * Entry point of the application. Either render the chatbox or the teaser.
 *
 * Optionally render the Wizard when the `dydupanel` URL parameter is found.
 */
export default function Application() {
  const { configuration } = useContext(ConfigurationContext);
  const event = useContext(EventsContext).onEvent('chatbox');
  const classes = useStyles({ configuration });

  const {
    mode,
    popin: popinChatbox,
    isOpen: isChatboxOpen,
    isFull: isChatboxFullScreen,
    isMinimize: isChatboxMinimize,
    toggle,
  } = useViewMode();

  const authConfiguration = useMemo(() => {
    return {
      clientId: configuration.oidc.clientId,
      clientSecret: configuration?.oidc?.clientSecret,
      pkceActive: configuration?.oidc?.pkceActive,
      pkceMode: configuration?.oidc?.pkceMode,
      authUrl: configuration.oidc.authUrl,
      tokenUrl: configuration.oidc.tokenUrl,
      scope: configuration?.oidc?.scopes,
    };
  }, [configuration?.oidc?.scopes]);

  let customFont = configuration.font.url;

  if (customFont && document.getElementById('font') && customFont !== document.getElementById('font').href) {
    document.getElementById('font').href = customFont;
  }

  useEffect(() => {
    event('loadChatbox');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c('dydu-application', classes.root)}>
      <Suspense fallback={null}>
        {hasWizard() && <Wizard />}
        <AuthProvider configuration={authConfiguration}>
          <AuthProtected enable={configuration?.oidc?.enable}>
            <OidcProvider>
              <SamlProvider>
                <UserActionProvider>
                  <DialogProvider onPushrulesDataReceived={popinChatbox}>
                    <SurveyProvider api={dydu}>
                      <LivechatProvider>
                        <Chatbox extended={isChatboxFullScreen} open={isChatboxOpen} toggle={toggle} mode={mode} />
                      </LivechatProvider>
                    </SurveyProvider>
                    <Teaser open={isChatboxMinimize} toggle={toggle} />
                  </DialogProvider>
                </UserActionProvider>
              </SamlProvider>
            </OidcProvider>
          </AuthProtected>
        </AuthProvider>
      </Suspense>
    </div>
  );
}
