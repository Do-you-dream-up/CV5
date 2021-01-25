import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import fetchPushrules  from '../../tools/pushrules';
import { knownTemplates } from '../../tools/template';
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
  const { prompt, setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { top } = configuration.dialog;
  const { active } = configuration.pushrules;
  const { t } = useTranslation('translation');
  const { active: spacesActive, detection: spacesDetection, items: spaces = [] } = configuration.spaces;

  const getContent = (text, templateData, templateName) => {
    const list = [];
    if (text) {
      list.push(text);
    }
    if (templateData && knownTemplates.includes(templateName)) {
      list.push(JSON.parse(templateData));
    }
    return list;
  };

  const fetch = useCallback(() => dydu.history().then(({ interactions }) => {
    if (Array.isArray(interactions)) {
      interactions = interactions.reduce((accumulator, it, index) => {
        accumulator.push(
          <Interaction children={it.user} history type="request" scroll={false}/>,
          <Interaction children={getContent(it.text, it.templateData, it.templateName)}
                       templatename={it.templateName}
                       scroll={index < interactions.length - 1 ? false : true}
                       history
                       secondary={it.sidebar}
                       type="response" />,
        );
        return accumulator;
      }, []);
      onAdd(interactions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [onAdd]);

  useEffect(() => {
    fetch().finally(() => {
      if (spacesActive) {
        if (!window.dydu.space.get(spacesDetection)) {
          setPrompt('spaces');
        }
      }
    });
  }, [fetch, setPrompt, spaces, spacesActive, spacesDetection]);

  useEffect(() => {
    if (active && open)
      fetchPushrules();
  }, [active, open]);

  /**
   * scroll to bottom of dialog on open chatbox
   */
  useEffect(() => {
    if (open) {
      const chatboxDiv = document.querySelector('.dydu-chatbox-body');
      chatboxDiv.scrollTop = chatboxDiv.scrollHeight;
    }
  }, [open]);

  return (
    <div className={c('dydu-dialog', classes.root)} ref={dialogRef} {...rest}>
      {!!top && (
        <Top component={Paper} elevation={1} title={t('top.title')}/>
      )}
      <Welcome />
      { interactions.map((it, index) => ({ ...it, key: index })) }
      { prompt === 'gdpr' && <PromptEmail type='gdpr' /> }
      { prompt === 'spaces' && <Spaces /> }
      { prompt === 'exportConv' && <PromptEmail type='exportConv' /> }
    </div >
  );
}


Dialog.propTypes = {
  dialogRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  interactions: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.oneOf([Interaction]) })).isRequired,
  onAdd: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
