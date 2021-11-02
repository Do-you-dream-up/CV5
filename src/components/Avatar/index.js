import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
const images = localStorage.getItem('dydu.images');

/**
 * Avatar to display in the conversation. Usually next to the conversation
 * bubbles.
 *
 * A request avatar should be next to the user's input while a response avatar
 * should be next to its response.
 */
export default function Avatar({ background, path, type }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration, type });
  const logo = images && JSON.parse(images) && JSON.parse(images).logo;
  background =
    background !== undefined ? background : configuration.avatar.background;
  path =
    path !== undefined
      ? path
      : {
          request: `${process.env.PUBLIC_URL}assets/${configuration.avatar.request}`,
          response: `${process.env.PUBLIC_URL}assets/${configuration.avatar.response}`,
        }[type];
  return (
    <div
      children={!!path && <img alt={`${type} avatar`} src={logo || path} />}
      className={c(
        'dydu-avatar',
        `dydu-avatar-${type}`,
        classes.base,
        classes[type],
        { [classes.background]: background },
      )}
    />
  );
}

Avatar.propTypes = {
  background: PropTypes.bool,
  path: PropTypes.string,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
