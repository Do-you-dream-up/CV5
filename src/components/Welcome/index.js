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
  const { enable, knowledgeName } = configuration.welcome;

  useEffect(() => {
     if(Local.get(Local.names.welcome)) {
      setWelcomeText(Local.get(Local.names.welcome));
      return;
     }
      dydu.talk(knowledgeName, {hide: true, doNotSave: true}).then(response => {
        setWelcomeText(response.text);
        Local.set(Local.names.welcome, response.text);
      });
  }, []);

  return  enable && welcomeText && (
    <article className={c('dydu-top')}>
      <Interaction live text={welcomeText} type="response" />
    </article>
  );
}
