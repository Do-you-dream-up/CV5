import c from 'classnames';
import { isBoolean } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useMemo } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

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
  type: 'response';
}

const Avatar = ({ path, type, linkAvatarDependOnType }: AvatarProps) => {
  const { configuration } = useConfiguration();
  const { t } = useTranslation();
  const classes: any = useStyles({ configuration, type });
  const background = configuration?.avatar[type]?.background;
  const answerTextAlt = t('avatar.altAnswer');
  const altText = configuration?.interaction?.NameBot ? configuration?.interaction?.NameBot + ' ' + answerTextAlt : '';
  const _path = useMemo(() => {
    if (!linkAvatarDependOnType?.includes('/null') && type !== 'request') {
      return linkAvatarDependOnType;
    } else if (path !== undefined) {
      return path;
    } else {
      const responseImage = configuration?.avatar?.response?.image;
      const result = {
        response: responseImage?.includes('base64')
          ? responseImage
          : `${process.env.PUBLIC_URL}assets/${responseImage}`,
      }[type];
      return result;
    }
  }, [configuration?.avatar?.response?.image, linkAvatarDependOnType, path, type]);

  const _className = useMemo(() => {
    return c('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type], {
      [classes.background]: isBoolean(background) ? null : background,
    });
  }, [background, classes, type]);

  return (
    <div className={_className} id={`dydu-avatar-${type}`}>
      {!!_path && <img alt={altText} className="dydu-avatar-image" src={_path} />}
    </div>
  );
};

export default Avatar;
