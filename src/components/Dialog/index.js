import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import Gdpr from '../Gdpr';
import Interaction from '../Interaction';
import Spaces from '../Spaces';
import useStyles from './styles';


/**
 * Container for the conversation and its interactions. Fetch the history on
 * mount.
 */
export default function Dialog({ interactions, onAdd, ...rest }) {

  const { configuration } = useContext(ConfigurationContext);
  const { prompt, setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { active: spacesActive, detection: spacesDetection, items: spaces = [] } = configuration.spaces;

  const fetch = useCallback(() => dydu.history().then(({ interactions }) => {
    if (Array.isArray(interactions)) {
      interactions = interactions.reduce((accumulator, it) => {
        accumulator.push(
          <Interaction children={it.user} history type="request" />,
          <Interaction children={it.text} history secondary={it.sidebar} type="response" />,
        );
        return accumulator;
      }, []);
      onAdd(interactions);
    }
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

  return (
    <div className={c('dydu-dialog', classes.root)} {...rest}>
      {interactions.map((it, index) => ({...it, key: index}))}
      {prompt === 'gdpr' && <Gdpr />}
      {prompt === 'spaces' && <Spaces />}
    </div>
  );
}


Dialog.propTypes = {
  interactions: PropTypes.arrayOf(PropTypes.shape({type: PropTypes.oneOf([Interaction])})).isRequired,
  onAdd: PropTypes.func.isRequired,
};
