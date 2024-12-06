import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useMemo } from 'react';
import { useDialog } from '../../contexts/DialogContext';
import { Local } from '../../tools/storage';

const RE_UNDERSTOOD = /^(DMUnderstoodQuestion|DMRewordClickedAuto|DMRewordClicked)$/g;
const RE_REWORD = /^(RW)[\w]+(Reword)(s?)$/g;
const RE_MISUNDERSTOOD = /^(GB)((TooMany)?)(MisunderstoodQuestion)(s?)$/g;
const RE_LIVECHAT =
  /^(OPRegularOperatorAnswer|OPRegularManagerAnswer|OPAutoReengageOperatorAnswer|OPAutoHelloOperatorAnswer|NAWaitingForOperator|DMLiveChatConnectionSucceed|NANotificationFromOperator|OPAutoOperatorAnswer|DMLiveChatConnectionInQueue)$/g;

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
  const { livechatCustomAvatar, livechatImageLink } = configuration?.header?.livechatLogo || {};
  const { interactions } = useDialog();

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

  function isWelcomeResponse() {
    return interactions?.length === 1 && interactions[0]?.props?.type === 'response';
  }

  function shouldNotChangeCustomAvatar() {
    return isWelcomeResponse();
  }

  const imageType = useMemo(() => {
    if (livechatCustomAvatar && typeResponse && typeResponse.match(RE_LIVECHAT) && Local.livechatType.load()) {
      return livechatImageLink;
    } else if (!customAvatar || !typeResponse || shouldNotChangeCustomAvatar()) {
      return defaultAvatar;
    } else {
      const resultMatchingImageType = Object.keys(typeMapImage)?.filter((keyType) => {
        return typeResponse.match(typeMapImage[keyType].pattern);
      });

      return !resultMatchingImageType || resultMatchingImageType.length === 0
        ? defaultAvatar
        : typeMapImage[resultMatchingImageType[0]].image;
    }
  }, [customAvatar, defaultAvatar, typeMapImage, typeResponse, livechatCustomAvatar]);

  const linkAvatarDependOnType = useMemo(() => {
    return imageType?.includes('base64') ? imageType : `${process.env.PUBLIC_URL}assets/${imageType}`;
  }, [imageType]);

  const showHeaderAvatar = useMemo(() => {
    return !!hasImage && headerAvatar;
  }, [hasImage, headerAvatar]);
  const showInteractionAvatar = useMemo(() => {
    return !!hasAvatar && (hasLoader || !(carousel || carouselTemplate));
  }, [carousel, carouselTemplate, hasAvatar, hasLoader]);

  if (showHeaderAvatar) {
    return <img alt="" src={linkAvatarDependOnType} aria-hidden={true} data-testid="header-avatar" />;
  }

  if (showInteractionAvatar) {
    return <AvatarComponent type={type} linkAvatarDependOnType={linkAvatarDependOnType} />;
  }

  return null;
};

export default AvatarsMatchingRequest;
