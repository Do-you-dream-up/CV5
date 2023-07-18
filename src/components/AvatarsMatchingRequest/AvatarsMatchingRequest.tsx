import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useMemo } from 'react';

const RE_UNDERSTOOD = /^(DMUnderstoodQuestion|DMRewordClickedAuto|DMRewordClicked)$/g;
const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;
const RE_MISUNDERSTOOD = /^(GB)((TooMany)?)(MisunderstoodQuestion)(s?)$/g;

const isSet = (value) => value !== null && typeof value !== 'undefined';

interface AvatarsMatchingRequestProps {
  AvatarComponent: any;
  defaultAvatar: string | null;
  headerAvatar: boolean;
  type: any;
  hasLoader: boolean;
  carousel: boolean;
  carouselTemplate: boolean;
  typeResponse: string;
}

const AvatarsMatchingRequest = ({
  defaultAvatar = null,
  headerAvatar,
  type,
  hasLoader,
  carousel,
  carouselTemplate,
  AvatarComponent,
  typeResponse,
}: AvatarsMatchingRequestProps) => {
  const { configuration } = useConfiguration();
  const { customAvatar, image: hasImage, imageLink } = configuration?.header?.logo || {};

  const hasAvatar = useMemo(() => {
    return !!configuration?.avatar[type]?.enable;
  }, [configuration, type]);

  const typeMapImage = useMemo(() => {
    return {
      understood: { image: imageLink?.understood, pattern: RE_UNDERSTOOD },
      misunderstood: { image: imageLink?.misunderstood, pattern: RE_MISUNDERSTOOD },
      reword: { image: imageLink?.reword, pattern: RE_REWORD },
    };
  }, [imageLink?.misunderstood, imageLink?.reword, imageLink?.understood]);

  const imageType = useMemo(() => {
    if (!isSet(customAvatar) || !customAvatar || !isSet(typeResponse)) {
      return defaultAvatar;
    } else {
      const resultMatchingImageType = Object.keys(typeMapImage)?.filter((keyType) => {
        return typeResponse.match(typeMapImage[keyType].pattern);
      });

      return resultMatchingImageType.length === 0 ? defaultAvatar : typeMapImage[resultMatchingImageType[0]].image;
    }
  }, [customAvatar, defaultAvatar, typeMapImage, typeResponse]);

  const linkAvatarDependOnType = useMemo(() => {
    const link = imageType?.includes('base64') ? imageType : `${process.env.PUBLIC_URL}assets/${imageType}`;
    return link;
  }, [imageType]);

  const showHeaderAvatar = useMemo(() => {
    return !!hasImage && headerAvatar;
  }, [hasImage, headerAvatar]);
  const showInteractionAvatar = useMemo(() => {
    return !!hasAvatar && (hasLoader || !(carousel || carouselTemplate));
  }, [carousel, carouselTemplate, hasAvatar, hasLoader]);

  if (showHeaderAvatar) {
    return <img alt="" src={linkAvatarDependOnType} />;
  }

  if (showInteractionAvatar) {
    return <AvatarComponent type={type} linkAvatarDependOnType={linkAvatarDependOnType} />;
  }

  return null;
};

export default AvatarsMatchingRequest;
