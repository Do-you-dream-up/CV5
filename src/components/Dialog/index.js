import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import dydu from '../../tools/dydu';
import Interaction from '../Interaction';
import Spaces from '../Spaces';
import useStyles from './styles';


/**
 * Container for the conversation and its interactions. Fetch the history on
 * mount.
 */
export default function Dialog({ interactions, onAdd, ...rest }) {

  const [ ready, setReady ] = useState(false);
  const classes = useStyles();

  const fetch = useCallback(() => dydu.history().then(({ interactions }) => {
    if (Array.isArray(interactions)) {
      interactions = interactions.reduce((accumulator, it) => {
        accumulator.push(
          <Interaction history text={it.user} type="request" />,
          <Interaction history text={it.text} secondary={it.sidebar} type="response" />,
        );
        return accumulator;
      }, []);
      onAdd(interactions);
    }
  }), [onAdd]);

  useEffect(() => {
    fetch().finally(() => setReady(true));
  }, [fetch]);

  return (
    <div className={c('dydu-dialog', classes.root)} {...rest}>
      {interactions.map((it, index) => ({...it, key: index}))}
      {ready && <Spaces />}
    </div>
  );
}


Dialog.propTypes = {
  interactions: PropTypes.arrayOf(PropTypes.shape({type: PropTypes.oneOf([Interaction])})).isRequired,
  onAdd: PropTypes.func.isRequired,
};
