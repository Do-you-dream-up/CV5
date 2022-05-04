import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useConfiguration } from '../../contexts/ConfigurationContext';

const RE_UNDERSTOOD = /^(DMUnderstoodQuestion|DMRewordClickedAuto|DMRewordClicked)$/g;
const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;
const RE_MISUNDERSTOOD = /^(GB)((TooMany)?)(MisunderstoodQuestion)(s?)$/g;

const isSet = (value) => value !== null && typeof value !== 'undefined';

const AvatarsMatchingRequest = ({
  defaultAvatar = null,
  headerAvatar,
  type,
  hasLoader,
  carousel,
  carouselTemplate,
  AvatarComponent,
  typeResponse,
}) => {
  const { configuration } = useConfiguration();
  const { customAvatar, image: hasImage, imageLink } = configuration.header.logo;

  const hasAvatar = useMemo(() => {
    return !!configuration?.avatar[type]?.enableInDialog;
  }, [configuration, type]);

  const typeMapImage = useMemo(() => {
    return {
      understood: { image: imageLink.understood, pattern: RE_UNDERSTOOD },
      misunderstood: { image: imageLink.misunderstood, pattern: RE_MISUNDERSTOOD },
      reword: { image: imageLink.reword, pattern: RE_REWORD },
    };
  }, [imageLink.misunderstood, imageLink.reword, imageLink.understood]);

  const imageType = useMemo(() => {
    if (!isSet(customAvatar) || !customAvatar || !isSet(typeResponse)) {
      return defaultAvatar;
    } else {
      const resultMatchingImageType = Object.keys(typeMapImage).filter((keyType) => {
        return typeResponse.match(typeMapImage[keyType].pattern);
      });

      return resultMatchingImageType.length === 0 ? defaultAvatar : typeMapImage[resultMatchingImageType[0]].image;
    }
  }, [customAvatar, defaultAvatar, typeMapImage, typeResponse]);

  const linkAvatarDependOnType = useMemo(() => {
    return `${process.env.PUBLIC_URL}assets/${imageType}`;
  }, [imageType]);

  const showHeaderAvatar = useMemo(() => {
    return !!hasImage && headerAvatar;
  }, [hasImage, headerAvatar]);

  const showInteractionAvatar = useMemo(() => {
    return !!hasAvatar && (hasLoader || !(carousel || carouselTemplate));
  }, [carousel, carouselTemplate, hasAvatar, hasLoader]);

  if (showHeaderAvatar) {
    return <img alt="avatar" src={linkAvatarDependOnType} />;
  }

  if (showInteractionAvatar) {
    return <AvatarComponent type={type} linkAvatarDependOnType={linkAvatarDependOnType} />;
  }

  return null;
};

AvatarsMatchingRequest.propTypes = {
  AvatarComponent: PropTypes.any,
  defaultAvatar: PropTypes.string,
  headerAvatar: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response', '']).isRequired,
  hasLoader: PropTypes.bool,
  carousel: PropTypes.bool,
  carouselTemplate: PropTypes.bool,
  typeResponse: PropTypes.string,
};

export default AvatarsMatchingRequest;
