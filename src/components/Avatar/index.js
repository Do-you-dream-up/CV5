import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';
import { withConfiguration } from  '../../tools/configuration';


/**
 * Avatar to display in the conversation. Usually next to the conversation
 * bubbles.
 *
 * A request avatar should be next to the user's input while a response avatar
 * should be next to its response.
 */
function Avatar({ configuration, type }) {
  const classes = useStyles({configuration});
  return (
    <div className={classNames('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type])} />
  );
}


Avatar.propTypes = {
  configuration: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};


export default withConfiguration(Avatar);
