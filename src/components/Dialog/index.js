import React, { useContext, useEffect } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import Interaction from '../Interaction';
import Paper from '../Paper';
import PoweredBy from '../PoweredBy';
import PromptEmail from '../PromptEmail';
import PropTypes from 'prop-types';
import Spaces from '../Spaces';
import Top from '../Top';
import c from 'classnames';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';
import { useEvent } from '../../contexts/EventsContext';

/**
 * Container for the conversation and its interactions. Fetch the history on
 * mount.
 */
export default function Dialog({ dialogRef, onAdd, open, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const { interactions, prompt, setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { top } = configuration.dialog;
  const { t } = useTranslation('translation');
  // eslint-disable-next-line
  const { isAppReady } = useEvent();
  const { active: spacesActive, detection: spacesDetection } = configuration.spaces;
  const poweredByActive = configuration.poweredBy && configuration.poweredBy.active;

  useEffect(() => {
    if (isAppReady && spacesActive) {
      if (!window.dydu.space.get(spacesDetection)) {
        setPrompt('spaces');
      }
    }
    // eslint-disable-next-line
  }, [spacesActive, setPrompt, spacesDetection]);

  /**
   * scroll to bottom of dialog on open chatbox
   */
  useEffect(() => {
    const chatboxDiv = document.querySelector('.dydu-chatbox-body');
    if (open && chatboxDiv) {
      chatboxDiv.scrollTop = chatboxDiv?.scrollHeight;
    }
  }, [open]);

  return (
    <>
      <div className={c('dydu-dialog', classes.root)} ref={dialogRef} {...rest} aria-live="polite">
        {!!top && <Top component={Paper} elevation={1} title={t('top.title')} />}
        {interactions.map((it, index) => ({ ...it, key: index }))}
        {prompt === 'gdpr' && <PromptEmail type="gdpr" />}
        {prompt === 'spaces' && <Spaces />}
        {prompt === 'exportConv' && <PromptEmail type="exportConv" />}
      </div>
      {poweredByActive && <PoweredBy />}
    </>
  );
}

Dialog.propTypes = {
  dialogRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  interactions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({ type: PropTypes.oneOf([Interaction]) }),
      PropTypes.shape({ type: PropTypes.oneOf([Interaction.Notification]) }),
      PropTypes.shape({ type: PropTypes.oneOf([Interaction.Writing]) }),
    ]),
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
