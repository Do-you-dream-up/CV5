import c from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import dydu from '../../tools/dydu';
import parseSteps from '../../tools/steps';
import { Local } from '../../tools/storage';
import Interaction from '../Interaction';
import { useLivechat } from '../../contexts/LivechatContext';

/**
 * Fetch the welcome sentece knowledge and display it.
 */
export default function Welcome() {
  const { configuration } = useContext(ConfigurationContext);
  const [welcomeContent, setWelcomeContent] = useState([]);
  const [welcomeSidebar, setWelcomeSidebar] = useState(null);
  const [welcomeSteps, setWelcomeSteps] = useState(null);
  const { isLivechatOn } = useLivechat();
  const hasCarousel = welcomeSteps && welcomeSteps.length > 1;
  const { enable, knowledgeName } = configuration.welcome;
  const teaserMode = Local.get(Local.names.open) === 1;

  const getWelcomeContent = useCallback((response) => {
    const steps = parseSteps(response);
    const list = [].concat(steps ? steps.map(({ text }) => text) : [response.text]);
    setWelcomeSteps(steps);
    setWelcomeContent(list);
    setWelcomeSidebar(response.sidebar);
  }, []);

  useEffect(() => {
    if (isLivechatOn) return;
    if (!welcomeContent[0] && !teaserMode) {
      dydu.talk(knowledgeName, { doNotSave: true, hide: true }).then((response) => {
        getWelcomeContent(response);
      });
    }
  }, [getWelcomeContent, isLivechatOn, knowledgeName, teaserMode, welcomeContent]);

  return enable && welcomeContent && welcomeContent[0] ? (
    <Interaction
      live
      type="response"
      children={welcomeContent}
      secondary={welcomeSidebar}
      steps={welcomeSteps}
      carousel={hasCarousel}
      className={c('dydu-top')}
    />
  ) : null;
}
