import '../../../public/override/style.css';
import '../../../public/chatboxHomepage.css';

import { AuthProtected, AuthProvider } from '../auth/AuthContext';
import { Suspense, lazy, useContext, useEffect, useMemo } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { ConversationHistoryProvider } from '../../contexts/ConversationHistoryContext';
import { DialogProvider } from '../../contexts/DialogContext';
import { LivechatProvider } from '../../contexts/LivechatContext';
import { OidcProvider } from '../../contexts/OidcContext';
import { SamlProvider } from '../../contexts/SamlContext';
import SurveyProvider from '../../Survey/SurveyProvider';
import Teaser from '../Teaser/Teaser';
import { UserActionProvider } from '../../contexts/UserActionContext';
import c from 'classnames';
import { hasWizard } from '../../tools/wizard';
import { useEvent } from '../../contexts/EventsContext';
import useStyles from './styles';
import { useViewMode } from '../../contexts/ViewModeProvider';
import { TopKnowledgeProvider } from '../../contexts/TopKnowledgeContext';

const Chatbox = lazy(() => import('../Chatbox/Chatbox').then((module) => ({ default: module.ChatboxWrapper })));
const Wizard = lazy(() => import('../Wizard'));

/**
 * Entry point of the application. Either render the chatbox or the teaser.
 *
 * Optionally render the Wizard when the `dydupanel` URL parameter is found.
 */

const App = () => {
  const { configuration } = useContext(ConfigurationContext);
  const { dispatchEvent } = useEvent();

  const classes: any = useStyles({ configuration });

  const {
    mode,
    isOpen: isChatboxOpen,
    isFull: isChatboxFullScreen,
    isMinimize: isChatboxMinimize,
    toggle,
  } = useViewMode();

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

  useEffect(() => {
    dispatchEvent && dispatchEvent('chatbox', 'loadChatbox');
  }, []);

  useEffect(() => {
    const customFont = configuration?.font.url;
    let documentFontHref = (document.getElementById('font') as HTMLAnchorElement)?.href;
    if (customFont && customFont !== documentFontHref) {
      documentFontHref = customFont;
    }
  }, [configuration]);

  return (
    <div className={c('dydu-application', classes.root)}>
      <Suspense fallback={null}>
        {hasWizard() && <Wizard />}
        <AuthProvider configuration={authConfiguration}>
          <AuthProtected enable={configuration?.oidc?.enable}>
            <OidcProvider>
              <SamlProvider>
                <UserActionProvider>
                  <ConversationHistoryProvider>
                    <TopKnowledgeProvider>
                      <DialogProvider>
                        <SurveyProvider>
                          <LivechatProvider>
                            <Chatbox extended={isChatboxFullScreen} open={isChatboxOpen} toggle={toggle} mode={mode} />
                          </LivechatProvider>
                        </SurveyProvider>
                        <Teaser open={isChatboxMinimize} toggle={toggle} />
                      </DialogProvider>
                    </TopKnowledgeProvider>
                  </ConversationHistoryProvider>
                </UserActionProvider>
              </SamlProvider>
            </OidcProvider>
          </AuthProtected>
        </AuthProvider>
      </Suspense>
    </div>
  );
};

export default App;
