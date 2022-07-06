import React, { useContext, useMemo } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import PropTypes from 'prop-types';
import c from 'classnames';
import useStyles from './styles';

const images = localStorage.getItem('dydu.images');

/**
 * Avatar to display in the conversation. Usually next to the conversation
 * bubbles.
 *
 * A request avatar should be next to the user's input while a response avatar
 * should be next to its response.
 */
const Avatar = ({ path, type, linkAvatarDependOnType }) => {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration, type });
  const logo = images && JSON.parse(images) && JSON.parse(images).logo;
  const background = configuration?.avatar[type]?.background;

  const _path = useMemo(() => {
    if (!linkAvatarDependOnType.includes('/null') && type !== 'request') {
      console.log(linkAvatarDependOnType);
      return linkAvatarDependOnType;
    } else if (path !== undefined) {
      return path;
    } else {
      const requestImage = configuration.avatar?.request?.image;
      console.log('🚀 ~ file: index.js ~ line 30 ~ const_path=useMemo ~ requestImage', requestImage);
      const responseImage = configuration.avatar?.response?.image;
      console.log('🚀 ~ file: index.js ~ line 32 ~ const_path=useMemo ~ responseImage', responseImage);
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
      [classes.background]: background,
    });
  }, [background, classes, type]);

  return <div className={_className}>{!!_path && <img alt={`${type} avatar`} src={logo || _path} />}</div>;
};

Avatar.propTypes = {
  background: PropTypes.bool,
  linkAvatarDependOnType: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};

export default Avatar;
