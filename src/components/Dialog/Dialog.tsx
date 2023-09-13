import React, { useEffect } from 'react';

import Interaction from '../Interaction';
import Loader from '../Loader';
import { Local } from '../../tools/storage';
import Paper from '../Paper';
import PromptEmail from '../PromptEmail';
import Spaces from '../Spaces';
import Top from '../Top';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useDialog } from '../../contexts/DialogContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

interface DialogProps {
  dialogRef: React.RefObject<any> | ((instance: any) => void) | null;
  open: boolean;
}

const Dialog: React.FC<DialogProps> = ({ dialogRef, open }) => {
  const { configuration } = useConfiguration();
  const { interactions, prompt, setPrompt, isWaitingForResponse } = useDialog();
  const classes = useStyles();
  const { top } = configuration?.dialog || {};
  const { t } = useTranslation('translation');
  const { active: spacesActive, detection: spacesDetection } = configuration?.spaces || {};
  const isLiveChatOn = Local.isLivechatOn.load();

  useEffect(() => {
    if (spacesActive) {
      if (!isDefined(dydu.getSpace(spacesDetection))) {
        setPrompt && setPrompt('spaces');
      }
    }
  }, [spacesActive, setPrompt, spacesDetection]);

  /**
   * Scroll to the bottom of the dialog on open chatbox
   */
  useEffect(() => {
    const chatboxDiv = document.querySelector('.dydu-chatbox-body');
    if (open && chatboxDiv) {
      chatboxDiv.scrollTop = chatboxDiv?.scrollHeight;
    }
  }, [open]);

  return (
    <>
      <p className={c('dydu-dialog', classes.root)} ref={dialogRef} aria-live="polite" id="dydu-dialog">
        {!!top && <Top component={Paper} elevation={1} title={t('top.title')} className={'dydu-top'} />}
        {interactions.map((it: any, index: number | null) => ({ ...it, key: index }))}
        {isWaitingForResponse && !isLiveChatOn && (
          <Interaction type="response" className="container-loader-interaction">
            <Loader />
          </Interaction>
        )}
        {prompt === 'gdpr' && <PromptEmail type="gdpr" />}
        {prompt === 'spaces' && <Spaces />}
        {prompt === 'exportConv' && <PromptEmail type="exportConv" />}
      </p>
    </>
  );
};

export default Dialog;
