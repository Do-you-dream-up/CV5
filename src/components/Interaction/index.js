import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import sanitize from '../../tools/sanitize';
import { CAROUSSEL_TEMPLATE, PRODUCT_TEMPLATE, QUICK_REPLY } from '../../tools/template';
import Avatar from '../Avatar';
import Bubble from '../Bubble';
import Carousel from '../Carousel';
import Feedback from '../Feedback';
import Loader from '../Loader';
import Scroll from '../Scroll';
import useStyles from './styles';

/**
 * Build an interaction to display content within the conversation. An
 * interaction usually contains a single bubble but can contain one bubble
 * depending on the content. Interactions are split after the horizontal rule
 * HTML tag.
 */
export default function Interaction({
  askFeedback,
  carousel,
  children,
  className,
  history,
  scroll,
  secondary,
  steps,
  templatename,
  thinking,
  type,
}) {
  children = Array.isArray(children) ? children : [children];
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const [bubbles, setBubbles] = useState([]);
  const [hasLoader, setHasLoader] = useState(!!thinking);
  const [ready, setReady] = useState(false);
  const [hasExternalLink, setHasExternalLink] = useState(false);
  const hasAvatar = !!configuration.interaction.avatar[type];
  const { displayNameBot: avatarDisplayBot } = configuration.interaction;
  const { displayNameUser: avatarDisplayUser } = configuration.interaction;
  const NameUser = configuration.interaction.NameUser;
  const NameBot = configuration.interaction.NameBot;
  const { loader } = configuration.interaction;
  const [left, right] = Array.isArray(loader) ? loader : [loader, loader];
  const carouselTemplate = templatename === CAROUSSEL_TEMPLATE;
  const productTemplate = templatename === PRODUCT_TEMPLATE;
  const quickTemplate = templatename === QUICK_REPLY;
  const delay = Math.floor(Math.random() * (~~right - ~~left)) + ~~left;

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

  useEffect(() => {
    if (!ready && children) {
      setReady(true);
      if (productTemplate) {
        const bubble = {};
        children.map((el) => {
          if (typeof el === 'string') {
            bubble.text = el;
          }
          if (typeof el === 'object') {
            bubble.product = el;
          }
        });
        addBubbles([JSON.stringify(bubble)]);
      } else if (carouselTemplate) {
        /* if the interaction is a carousel template, this first divides and orders its content in 5 objects based on the product number (last character of property name), then creates a sortedArray with each product as a string*/
        children.map((el) => {
          const bubble = {};
          if (typeof el === 'string') {
            // bubble.text = el;
          }

          if (typeof el === 'object') {
            const list = [];
            for (let i = 1; i < 6; i++) {
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
                list.push(JSON.stringify(bubble));
              }
            }
            addBubbles(list);
          }
        });
      } else if (quickTemplate) {
        const bubble = {};
        children.map((el) => {
          if (typeof el === 'string') {
            bubble.text = el;
          }
          if (typeof el === 'object') {
            bubble.quick = el;
          }
        });
        addBubbles([JSON.stringify(bubble)]);
      } else {
        const _children = children.reduce(
          (accumulator, it) =>
            typeof it === 'string' ? [...accumulator, ...sanitize(it).split(/<hr.*?>/)] : [...accumulator, it],
          [],
        );

        if (typeof _children === String && _children[0].includes('target="_blank"')) {
          setHasExternalLink(true);
        }
        addBubbles(_children.filter((it) => it));
      }
    }
  }, [addBubbles, carouselTemplate, history, carousel, children, productTemplate, ready, templatename, quickTemplate]);

  return (
    (bubbles.length || hasLoader) && (
      <div
        className={c(
          'dydu-interaction',
          `dydu-interaction-${type}`,
          classes.base,
          classes[type],
          { [classes.barf]: carousel && bubbles.length },
          className,
        )}
      >
        {hasAvatar && (hasLoader || !(carousel || carouselTemplate)) && <Avatar type={type} />}
        <div className={c('dydu-interaction-wrapper', classes.wrapper)}>
          {type === 'request' && NameUser && !!avatarDisplayUser && (
            <span className={c(`dydu-name-${type}`, classes.nameRequest)}>{NameUser}</span>
          )}
          {type === 'response' && NameBot && !!avatarDisplayBot && (
            <span className={c(`dydu-name-${type}`, classes.nameResponse)}>{NameBot}</span>
          )}
          {bubbles.length > 0 &&
            React.createElement(carousel || carouselTemplate ? Carousel : 'div', {
              children: bubbles.map((it, index) => {
                const attributes = {
                  carousel: carousel,
                  component: scroll && !index ? Scroll : undefined,
                  history: history,
                  secondary: index === bubbles.length - 1 ? secondary : undefined,
                  step: steps ? (steps.length === 1 ? undefined : steps[index]) : undefined,
                  type: type,
                  [typeof it === 'string' ? 'html' : 'children']: it,
                };
                return (
                  <Bubble
                    className={classes.bubble}
                    hasExternalLink={hasExternalLink}
                    key={index}
                    templatename={templatename}
                    {...attributes}
                  />
                );
              }),
              className: c('dydu-interaction-bubbles', classes.bubbles),
              steps: steps,
              templatename: templatename,
            })}
          {hasLoader && <Loader className={classes.loader} scroll={scroll} />}
          {!hasLoader && askFeedback && <Feedback />}
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
  askFeedback: PropTypes.bool,
  carousel: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  className: PropTypes.string,
  history: PropTypes.bool,
  scroll: PropTypes.bool,
  secondary: PropTypes.object,
  steps: PropTypes.array,
  templatename: PropTypes.string,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
