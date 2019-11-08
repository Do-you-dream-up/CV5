import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import useStyles from './styles';
import Interaction from '../Interaction';
import Top from '../Top';
import dydu from '../../tools/dydu';


/**
 * Container for the conversation and its interactions. Fetch the history on
 * mount.
 */
export default function Dialog({ interactions, onAdd, ...rest }) {

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
  }, () => {}), [onAdd]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className={classNames('dydu-dialog', classes.root)} {...rest}>
      <Top />
      {interactions.map((it, index) => ({...it, key: index}))}
    </div>
  );
}


Dialog.propTypes = {
  interactions: PropTypes.arrayOf(PropTypes.shape({type: PropTypes.oneOf([Interaction])})).isRequired,
  onAdd: PropTypes.func.isRequired,
};
