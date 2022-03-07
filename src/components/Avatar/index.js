import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
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
export default function Avatar({ path, type }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration, type });
  const logo = images && JSON.parse(images) && JSON.parse(images).logo;

  const showBackground = useMemo(() => {
    if (type === 'response') {
      return configuration.avatar.response.background;
    } else if (type === 'request') {
      return configuration.avatar.request.background;
    }
  }, [configuration.avatar.request.background, configuration.avatar.response.background, type]);

  path =
    path !== undefined
      ? path
      : {
          request: `${process.env.PUBLIC_URL}assets/${configuration.avatar.request.image}`,
          response: `${process.env.PUBLIC_URL}assets/${configuration.avatar.response.image}`,
        }[type];

  return (
    <div
      children={!!path && <img src={logo || path} />}
      className={c('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type], {
        [classes.showBackground]: showBackground,
      })}
    />
  );
}

Avatar.propTypes = {
  path: PropTypes.string,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
