import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from './styles';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';


/**
 * Avatar to display in the conversation. Usually next to the conversation
 * bubbles.
 *
 * A request avatar should be next to the user's input while a response avatar
 * should be next to its response.
 */
export default function Avatar({ type }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  return <div className={c('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type])} />;
}


Avatar.propTypes = {
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
