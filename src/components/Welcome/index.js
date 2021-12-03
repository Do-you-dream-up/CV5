import c from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import dydu from '../../tools/dydu';
import { Local } from '../../tools/storage';
import Interaction from '../Interaction';

/**
 * Fetch the welcome sentece knowledge and display it.
 */
export default function Welcome() {
  const { configuration } = useContext(ConfigurationContext);
  const [welcomeText, setWelcomeText] = useState(null);
  const [welcomeSidebar, setWelcomeSidebar] = useState(null);
  const { enable, knowledgeName } = configuration.welcome;
  const teaserMode = Local.get(Local.names.open) === 1;

  useEffect(() => {
    if (!welcomeText && !teaserMode) {
      dydu.talk(knowledgeName, { doNotSave: true, hide: true }).then((response) => {
        setWelcomeText(response.text);
        setWelcomeSidebar(response.sidebar);
      });
    }
  }, [knowledgeName, teaserMode, welcomeText]);

  return enable && welcomeText ? (
    <Interaction live type="response" secondary={welcomeSidebar} className={c('dydu-top')}>
      {[welcomeText]}
    </Interaction>
  ) : null;
}
