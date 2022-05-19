import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import fetchPushrules from '../../tools/pushrules';
import Interaction from '../Interaction';
import Paper from '../Paper';
import PromptEmail from '../PromptEmail';
import Spaces from '../Spaces';
import Top from '../Top';
import Welcome from '../Welcome';
import useStyles from './styles';

/**
 * Container for the conversation and its interactions. Fetch the history on
 * mount.
 */
export default function Dialog({ dialogRef, interactions, onAdd, open, ...rest }) {
  const { configuration } = useContext(ConfigurationContext);
  const { rebuildInteractionsListFromHistory, prompt, setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { top } = configuration.dialog;
  const { active } = configuration.pushrules;
  const { t } = useTranslation('translation');
  // eslint-disable-next-line
  const { active: spacesActive, detection: spacesDetection, items: spaces = [] } = configuration.spaces;

  const fetch = useCallback(() => {
    return dydu.history().then(({ interactions }) => {
      if (Array.isArray(interactions)) {
        interactions = rebuildInteractionsListFromHistory(interactions);
        onAdd(interactions);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, [onAdd, rebuildInteractionsListFromHistory]);

  useEffect(() => {
    if (interactions.length > 0) {
      return;
    }
    fetch().finally(() => {
      if (spacesActive) {
        if (!window.dydu.space.get(spacesDetection)) {
          setPrompt('spaces');
        }
      }
    });
    // eslint-disable-next-line
  }, [spacesActive, setPrompt, spacesDetection]);

  useEffect(() => {
    if (active && open)
      setTimeout(() => {
        fetchPushrules();
      }, 300);
  }, [active, open]);

  /**
   * scroll to bottom of dialog on open chatbox
   */
  useEffect(() => {
    if (open) {
      const chatboxDiv = document.querySelector('.dydu-chatbox-body');
      chatboxDiv.scrollTop = chatboxDiv?.scrollHeight;
    }
  }, [open]);

  return (
    <div className={c('dydu-dialog', classes.root)} ref={dialogRef} {...rest} aria-live="polite">
      {!!top && <Top component={Paper} elevation={1} title={t('top.title')} />}
      <Welcome />
      {interactions.map((it, index) => ({ ...it, key: index }))}
      {prompt === 'gdpr' && <PromptEmail type="gdpr" />}
      {prompt === 'spaces' && <Spaces />}
      {prompt === 'exportConv' && <PromptEmail type="exportConv" />}
    </div>
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
