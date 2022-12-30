import React, { useMemo } from 'react';

import { useConfiguration } from '../../contexts/ConfigurationContext';
import PropTypes from 'prop-types';
import c from 'classnames';
import useStyles from './styles';
import { isBoolean } from '../../tools/helpers';

/**
 * Avatar to display in the conversation. Usually next to the conversation
 * bubbles.
 *
 * A request avatar should be next to the user's input while a response avatar
 * should be next to its response.
 */
const Avatar = ({ path, type, linkAvatarDependOnType }) => {
  const { configuration } = useConfiguration();
  const classes = useStyles({ configuration, type });
  const background = configuration?.avatar[type]?.background;

  const _path = useMemo(() => {
    if (!linkAvatarDependOnType.includes('/null') && type !== 'request') {
      return linkAvatarDependOnType;
    } else if (path !== undefined) {
      return path;
    } else {
      const requestImage = configuration.avatar?.request?.image;
      const responseImage = configuration.avatar?.response?.image;
      return {
        request: requestImage?.includes('base64') ? requestImage : `${process.env.PUBLIC_URL}assets/${requestImage}`,
        response: responseImage?.includes('base64')
          ? responseImage
          : `${process.env.PUBLIC_URL}assets/${configuration.avatar?.response?.image}`,
      }[type];
    }
  }, [configuration.avatar.request.image, configuration.avatar.response.image, linkAvatarDependOnType, path, type]);

  const _className = useMemo(() => {
    return c('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type], {
      [classes.background]: isBoolean(background) ? null : background,
    });
  }, [background, classes, type]);

  return <div className={_className}>{!!_path && <img alt={`${type} avatar`} src={_path} />}</div>;
};

Avatar.propTypes = {
  background: PropTypes.bool,
  linkAvatarDependOnType: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};

export default Avatar;
