import c from 'classnames';
import { isBoolean } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useMemo } from 'react';
import useStyles from './styles';

/**
 * Avatar to display in the conversation. Usually next to the conversation
 * bubbles.
 *
 * A request avatar should be next to the user's input while a response avatar
 * should be next to its response.
 */

interface AvatarProps {
  background?: boolean;
  linkAvatarDependOnType?: string;
  path?: string;
  type: 'request' | 'response';
}

const Avatar = ({ path, type, linkAvatarDependOnType }: AvatarProps) => {
  const { configuration } = useConfiguration();
  const classes: any = useStyles({ configuration, type });
  const background = configuration?.avatar[type]?.background;

  const _path = useMemo(() => {
    if (!linkAvatarDependOnType?.includes('/null') && type !== 'request') {
      return linkAvatarDependOnType;
    } else if (path !== undefined) {
      return path;
    } else {
      const requestImage = configuration?.avatar?.request?.image;
      console.log('🚀 ~ file: Avatar.tsx:34 ~ const_path=useMemo ~ requestImage', requestImage);
      const responseImage = configuration?.avatar?.response?.image;
      const result = {
        request: requestImage?.includes('base64') ? requestImage : `${process.env.PUBLIC_URL}assets/${requestImage}`,
        response: responseImage?.includes('base64')
          ? responseImage
          : `${process.env.PUBLIC_URL}assets/${configuration?.avatar?.response?.image}`,
      }[type];
      return result;
    }
  }, [
    configuration?.avatar?.request?.image,
    configuration?.avatar?.response?.image,
    linkAvatarDependOnType,
    path,
    type,
  ]);

  const _className = useMemo(() => {
    return c('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type], {
      [classes.background]: isBoolean(background) ? null : background,
    });
  }, [background, classes, type]);

  return (
    <div className={_className}>
      {!!_path && <img alt={`${type} avatar`} className="dydu-avatar-image" src={_path} />}
    </div>
  );
};

export default Avatar;
