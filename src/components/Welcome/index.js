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
  const [ welcomeText, setWelcomeText ] = useState(null);
  const [ welcomeSidebar, setWelcomeSidebar ] = useState(null);
  const { enable, knowledgeName } = configuration.welcome;

  useEffect(() => {
     if (Local.get(Local.names.welcome)) {
      setWelcomeText((Local.get(Local.names.welcome)).text);
      setWelcomeSidebar((Local.get(Local.names.welcome)).sidebar);
      return;
     }
      dydu.talk(knowledgeName, {hide: true, doNotSave: true}).then(response => {
        setWelcomeText(response.text);
        setWelcomeSidebar(response.sidebar);
        const localWelcome = {text : response.text, sidebar: response.sidebar};
        Local.set(Local.names.welcome, localWelcome);
      });
  }, []);

  return  enable && welcomeText && (
    <Interaction live type="response" secondary={welcomeSidebar} className={c('dydu-top')}>
      {[welcomeText]}
    </Interaction>
  );
}
