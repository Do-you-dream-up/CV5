import { AvatarContainer, BubbleContainer, InChatNotification, RowInteraction } from '../../styles/styledComponent';
import { INTERACTION_TEMPLATE, INTERACTION_TYPE } from '../../tools/constants';
import { asset, isDefined, isOfTypeObject, isOfTypeString } from '../../tools/helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Avatar from '../Avatar/Avatar';
import AvatarsMatchingRequest from '../AvatarsMatchingRequest/AvatarsMatchingRequest';
import Bubble from '../Bubble';
import Carousel from '../Carousel/Carousel';
import DotLoader from 'react-spinners/BeatLoader';
import Feedback from '../Feedback';
import Icon from '../Icon/Icon';
import Loader from '../Loader';
import { Local } from '../../tools/storage';
import PropTypes from 'prop-types';
import Scroll from '../Scroll/Scroll';
import c from 'classnames';
import sanitize from '../../tools/sanitize';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useNotificationHelper from '../../tools/hooks/useNotificationHelper';
import useStyles from './styles';

const templateNameToBubbleCreateAction = {
  [INTERACTION_TEMPLATE.quickReply]: (list) => {
    const splitText = (text) => text.split(/<hr class="split">/);
    const shouldSplit = (text) => text.indexOf('<hr class="split">') >= 0;
    const makeBubbleObjWithText = (text) => ({ text });
    const jsonStringify = (d) => JSON.stringify(d);

    const [text = '', quick] = list;
    const textArray = splitText(text);
    const results = [];

    if (!shouldSplit(text)) {
      return results.concat([jsonStringify({ text, separator: true, quick })]);
    }

    if (shouldSplit(text)) {
      return textArray.reduce((result, text, i) => {
        if (i === textArray.length - 1) {
          return result.concat([jsonStringify({ text, separator: true, quick })]);
        }

        result.push(jsonStringify(makeBubbleObjWithText(text)));

        return result;
      }, []);
    }
  },
  [INTERACTION_TEMPLATE.product]: (list) => {
    const bubble = {};
    const item = list.pop();
    if (isOfTypeString(item)) bubble.text = item;
    if (isOfTypeObject(item)) bubble.product = item;
    return [JSON.stringify(bubble)];
  },
  [INTERACTION_TEMPLATE.carousel]: (list) => {
    const bubbles = [];
    /* if the interaction is a carousel template, this first divides and orders its content in 5 objects based on the
                    product number (last character of property name), then creates a sortedArray with each product as a string */
    list.forEach((el) => {
      const bubble = {};
      if (typeof el === 'string') {
        // bubble.text = el;
      }

      if (typeof el === 'object') {
        let i = 0;
        let hasItemForIndex = (json, i) => {
          return (
            isDefined(json[`buttonA${i}`]) ||
            isDefined(json[`buttonB${i}`]) ||
            isDefined(json[`buttonC${i}`]) ||
            isDefined(json[`imageLink${i}`]) ||
            isDefined(json[`imageName${i}`]) ||
            isDefined(json[`imageName${i}`]) ||
            isDefined(json[`subtitle${i}`]) ||
            isDefined(json[`title${i}`])
          );
        };
        do {
          i++;
          const product = {};
          product['buttonA'] = el[`buttonA${i}`];
          product['buttonB'] = el[`buttonB${i}`];
          product['buttonC'] = el[`buttonC${i}`];
          product['imageLink'] = el[`imageLink${i}`];
          product['imageName'] = el[`imageName${i}`];
          product['numeric'] = el[`numeric${i}`];
          product['subtitle'] = el[`subtitle${i}`];
          product['title'] = el[`title${i}`];
          bubble.product = product;
          if (!Object.values(bubble.product).every((param) => param === null || param === undefined)) {
            bubbles.push(JSON.stringify(bubble));
          }
        } while (hasItemForIndex(el, i + 1));
      }
    });
    return bubbles;
  },
  [INTERACTION_TEMPLATE.carousel_array]: (list) => {
    const bubbles = [];
    const bubble = {};
    for (const product of list) {
      bubble.product = product;
      if (bubble.product && Object.values(bubble.product).some((param) => param !== null && param !== undefined)) {
        bubbles.push(JSON.stringify(bubble));
      }
    }
    return bubbles;
  },
  [INTERACTION_TEMPLATE.uploadFile]: (list) => {
    const bubble = {};
    const item = list.pop();
    if (isOfTypeString(item)) bubble.text = item;
    if (isOfTypeObject(item)) bubble.product = item;
    return [JSON.stringify(bubble)];
  },
};

/**
 * Build an interaction to display content within the conversation. An
 * interaction usually contains a single bubble but can contain one bubble
 * depending on the content. Interactions are split after the horizontal rule
 * HTML tag.
 */
export default function Interaction({
  autoOpenSidebar,
  askFeedback,
  carousel,
  children,
  className,
  history,
  scroll,
  sidebar,
  hasSurvey,
  steps,
  templatename,
  thinking,
  type,
  typeResponse,
}) {
  const [bubbles, setBubbles] = useState([]);
  const [hasLoader, setHasLoader] = useState(!!thinking);
  const [ready, setReady] = useState(false);

  const { configuration } = useConfiguration();
  const { customAvatar: hasAvatarMatchingRequest } = configuration.header.logo;

  const classes = useStyles({ configuration });

  const {
    displayNameBot: avatarDisplayBot,
    displayNameUser: avatarDisplayUser,
    NameUser,
    NameBot,
    loader,
  } = configuration.interaction;

  const defaultAvatar = configuration.avatar?.response?.image;

  const delay = useMemo(() => {
    const [left, right] = Array.isArray(loader) ? loader : [loader, loader];
    return Math.floor(Math.random() * (~~right - ~~left)) + ~~left;
  }, [loader]);

  children = Array.isArray(children) ? children : [children];

  const carouselTemplate = useMemo(
    () =>
      templatename?.equals(INTERACTION_TEMPLATE.carousel) || templatename?.equals(INTERACTION_TEMPLATE.carousel_array),
    [templatename],
  );
  const productTemplate = useMemo(() => templatename?.equals(INTERACTION_TEMPLATE.product), [templatename]);
  const quickTemplate = useMemo(() => templatename?.equals(INTERACTION_TEMPLATE.quickReply), [templatename]);

  const addBubbles = useCallback(
    (newBubbles) => {
      if (thinking) {
        setTimeout(() => {
          const newBubble = newBubbles.shift();
          setBubbles((previous) => [...previous, ...(newBubble ? [newBubble] : [])]);
          if (newBubbles.length) {
            addBubbles(newBubbles);
          } else {
            setHasLoader(false);
          }
        }, delay);
      } else {
        setBubbles(newBubbles);
        setHasLoader(false);
      }
    },
    [delay, thinking],
  );

  const createBubbleListNoTemplate = useCallback(
    (list) => {
      let _children = list.reduce(
        (accumulator, it) =>
          typeof it === 'string' ? [...accumulator, ...sanitize(it).split(/<hr.*?>/)] : [...accumulator, it],
        [],
      );

      // if the bot have no response but just a sidebar to display, the empty string is not interprated to add a new bubble
      if (_children[0] === '' && sidebar) {
        _children = ['&nbsp;'];
      }
      return _children.filter((it) => it);
    },
    [sidebar],
  );

  useEffect(() => {
    if (!ready && children) {
      setReady(true);

      const createBubbleListFn = templateNameToBubbleCreateAction[templatename] || createBubbleListNoTemplate;

      const bubbles = createBubbleListFn(children);
      addBubbles(bubbles);
    }
  }, [
    addBubbles,
    carouselTemplate,
    history,
    carousel,
    children,
    productTemplate,
    ready,
    templatename,
    quickTemplate,
    sidebar,
    createBubbleListNoTemplate,
  ]);

  const isCarousel = useMemo(() => carousel || carouselTemplate, [carouselTemplate, carousel]);

  const _Avatar = useMemo(() => {
    return (
      <AvatarsMatchingRequest
        type={type}
        hasLoader={hasLoader}
        carousel={carousel}
        carouselTemplate={carouselTemplate}
        defaultAvatar={!hasAvatarMatchingRequest ? defaultAvatar : null}
        AvatarComponent={Avatar}
        typeResponse={typeResponse}
      />
    );
  }, [carousel, carouselTemplate, defaultAvatar, hasAvatarMatchingRequest, hasLoader, type, typeResponse]);

  const EmiterName = useMemo(() => {
    let name = null;
    if (type?.equals(INTERACTION_TYPE.request) && NameUser && !!avatarDisplayUser) name = NameUser;
    if (type?.equals(INTERACTION_TYPE.response) && NameBot && !!avatarDisplayBot) name = NameBot;

    return (
      <span className={c(`dydu-name-${type}`, classes[`name${type}`])} aria-hidden="true">
        {name}
      </span>
    );
  }, [NameBot, NameUser, avatarDisplayBot, avatarDisplayUser, classes, type]);

  const _Feedback = useMemo(() => {
    return !hasLoader && askFeedback ? <Feedback /> : null;
  }, [askFeedback, hasLoader]);

  const _Loader = useMemo(() => {
    if (Local.livechatType.load()) return null;
    return hasLoader ? <Loader className={classes.loader} scroll={scroll} /> : null;
  }, [classes.loader, hasLoader, Local.livechatType.load(), scroll]);

  const bubbleList = useMemo(() => {
    if (bubbles.length <= 0) return null;

    const baseProps = {
      carousel: carousel,
      history: history,
      type: type,
      autoOpenSidebar,
    };

    return bubbles.map((it, index) => {
      const attributes = {
        ...baseProps,
        step: steps ? (steps.length === 1 ? undefined : steps[index]) : undefined,
        component: scroll && !index ? Scroll : undefined,
        sidebar: index === bubbles.length - 1 ? sidebar : undefined,
        hasSurvey: hasSurvey,
        [typeof it === 'string' ? 'html' : 'children']: it,
      };

      return (
        <Scroll key={index} className={classes.bubble}>
          <Bubble templatename={templatename} {...attributes} />
        </Scroll>
      );
    });
  }, [autoOpenSidebar, bubbles, carousel, classes.bubble, history, scroll, sidebar, steps, templatename, type]);

  const handleCarouselInitOk = () => {
    setHasLoader(false);
  };

  const ListBubble = useMemo(() => {
    if (!isDefined(bubbleList)) return null;

    let wrapperProps = {
      className: c('dydu-interaction-bubbles', classes.bubbles),
      steps: steps,
      templatename: templatename,
    };

    if (isCarousel) {
      wrapperProps = {
        ...wrapperProps,
        handleSlickInit: handleCarouselInitOk,
      };
      return <Carousel {...wrapperProps}>{bubbleList}</Carousel>;
    }

    return <div {...wrapperProps}>{bubbleList}</div>;
  }, [bubbleList, classes.bubbles, isCarousel, steps, templatename]);

  return (
    (isCarousel || (!isCarousel && (bubbles.length || hasLoader))) && (
      <div
        className={c(
          'dydu-interaction',
          `dydu-interaction-${type}`,
          !!templatename && templatename !== INTERACTION_TEMPLATE.quickReply && 'dydu-interaction-template',
          classes.base,
          classes[type],
          { [classes.barf]: carousel && bubbles.length },
          { [classes.interactionCarousel]: isCarousel && bubbles.length },
          className,
        )}
        id="dydu-interaction"
      >
        {_Avatar}
        <div className={c('dydu-interaction-wrapper', classes.wrapper)} id="dydu-interaction-wrapper">
          {EmiterName}
          {ListBubble}
          {_Loader}
          {_Feedback}
        </div>
      </div>
    )
  );
}

Interaction.defaultProps = {
  carousel: false,
  scroll: true,
};

Interaction.propTypes = {
  autoOpenSidebar: PropTypes.bool,
  askFeedback: PropTypes.bool,
  carousel: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  className: PropTypes.string,
  history: PropTypes.bool,
  scroll: PropTypes.bool,
  sidebar: PropTypes.any,
  activeSidebarName: PropTypes.string,
  hasSurvey: PropTypes.bool,
  steps: PropTypes.array,
  templatename: PropTypes.string,
  contexts: PropTypes.any,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
  typeResponse: PropTypes.string,
};

const Writing = () => {
  const { configuration } = useConfiguration();
  // eslint-disable
  const avatarImageUrl = useMemo(() => {
    if (configuration?.header?.livechatLogo?.livechatCustomAvatar && Local.livechatType.load()) {
      return (
        asset(configuration?.header?.livechatLogo?.livechatImageLink) || asset(configuration?.avatar?.response?.image)
      );
    }

    return asset(configuration?.avatar?.response?.image);
  }, [configuration?.header?.livechatLogo?.livechatCustomAvatar]);

  return (
    <Scroll>
      <RowInteraction>
        <AvatarContainer>
          <Avatar type={INTERACTION_TYPE.response} linkAvatarDependOnType={avatarImageUrl} />
        </AvatarContainer>
        <BubbleContainer>
          <DotLoader loading={true} size={10} margin={2} />
        </BubbleContainer>
      </RowInteraction>
    </Scroll>
  );
};

export const InteractionNotification = ({ notification }) => {
  const { text, iconName } = useNotificationHelper(notification);

  const renderHTML = (html) => {
    return { __html: html };
  };

  const canRender = useMemo(() => isDefined(text) && isDefined(iconName), [text, iconName]);

  return !canRender ? null : (
    <Scroll>
      <InChatNotification>
        <div className="icon">
          <Icon color="grey" icon={iconName} alt={''} />
        </div>
        <p dangerouslySetInnerHTML={renderHTML(text)} />
      </InChatNotification>
    </Scroll>
  );
};

InteractionNotification.propTypes = {
  notification: PropTypes.any,
};

Interaction.Notification = InteractionNotification;
Interaction.Writing = Writing;
