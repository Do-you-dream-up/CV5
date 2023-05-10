import { useContext, useEffect } from 'react';

import { DialogContext } from '../../contexts/DialogContext';
import Interaction from '../Interaction';
import Paper from '../Paper';
import PromptEmail from '../PromptEmail';
import PropTypes from 'prop-types';
import Spaces from '../Spaces';
import Top from '../Top';
import c from 'classnames';
import dydu from '../../tools/dydu';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Container for the conversation and its interactions. Fetch the history on
 * mount.
 */
export default function Dialog({ dialogRef, open, ...rest }) {
  const { configuration } = useConfiguration();
  const { interactions, prompt, setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { top } = configuration.dialog;
  const { t } = useTranslation('translation');
  const { active: spacesActive, detection: spacesDetection } = configuration.spaces;

  useEffect(() => {
    if (spacesActive) {
      if (!isDefined(dydu.getSpace(spacesDetection))) {
        setPrompt('spaces');
      }
    }
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
      <p className={c('dydu-dialog', classes.root)} ref={dialogRef} {...rest} aria-live="polite" id="dydu-dialog">
        {!!top && <Top component={Paper} elevation={1} title={t('top.title')} />}
        {interactions.map((it, index) => ({ ...it, key: index }))}
        {prompt === 'gdpr' && <PromptEmail type="gdpr" />}
        {prompt === 'spaces' && <Spaces />}
        {prompt === 'exportConv' && <PromptEmail type="exportConv" />}
      </p>
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
