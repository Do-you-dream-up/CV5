import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import sanitize from  '../../tools/sanitize';
import Avatar from  '../Avatar';
import Bubble from  '../Bubble';
import Carousel from  '../Carousel';
import Feedback from  '../Feedback';
import Loader from  '../Loader';
import Scroll from  '../Scroll';
import useStyles from  './styles';


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
  thinking,
  type,
}) {

  children = Array.isArray(children) ? children : [children];
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const [ bubbles, setBubbles ] = useState([]);
  const [ hasLoader, setHasLoader ] = useState(!!thinking);
  const [ ready, setReady ] = useState(false);
  const [ hasExternalLink, setHasExternalLink ] = useState(false);
  const hasAvatar = !!configuration.interaction.avatar[type];
  const { loader } = configuration.interaction;
  const [ left, right ] = Array.isArray(loader) ? loader : [loader, loader];
  const delay = Math.floor(Math.random() * (~~right - ~~left)) + ~~left;

  const addBubbles = useCallback(newBubbles => {
    if (thinking) {
      setTimeout(() => {
        if (carousel) {
          setBubbles(previous => [...previous, ...newBubbles]);
          setHasLoader(false);
        }
        else {
          const newBubble = newBubbles.shift();
          setBubbles(previous => [...previous, ...(newBubble ? [newBubble] : [])]);
          if (newBubbles.length) {
            addBubbles(newBubbles);
          }
          else {
            setHasLoader(false);
          }
        }
      }, delay);
    }
    else {
      setBubbles(newBubbles);
      setHasLoader(false);
    }
  }, [carousel, delay, thinking]);

  useEffect(() => {
    if (!ready && children) {
      setReady(true);
      let content = children;
      if (!carousel) {
        content = content.reduce((accumulator, it) => (
          typeof it === 'string' ? [...accumulator, ...sanitize(it).split('<hr>')] : [...accumulator, it]
        ), []);
      }
      if (carousel) {
        content = content.reduce((accumulator, it) => (
          typeof it === 'string' ? [...accumulator, ...sanitize(it).split('<hr>')] : [...accumulator, it]
        ), []);
      }
      if (typeof(children) === String && children[0].includes('target="_blank"')) {
        setHasExternalLink(true);
      }
      addBubbles(content.filter(it => it));
    }
  }, [addBubbles, carousel, children, ready]);

  return (bubbles.length || hasLoader) && (
    <div className={c(
      'dydu-interaction',
      `dydu-interaction-${type}`,
      classes.base,
      classes[type],
      {[classes.barf]: carousel && bubbles.length},
      className,
    )}>
      {hasAvatar && (hasLoader || !carousel) && <Avatar type={type} />}
      <div className={c('dydu-interaction-wrapper', classes.wrapper)}>
        {bubbles.length > 0 && React.createElement(
          carousel ? Carousel : 'div',
          {
            children: bubbles.map((it, index) => {
              const attributes = {
                component: scroll && !index ? Scroll : undefined,
                history: history,
                secondary: secondary,
                step: steps ? steps[index] : undefined,
                type: type,
                [typeof it === 'string' ? 'html' : 'children']: it,
              };
              return <Bubble className={classes.bubble} hasExternalLink={hasExternalLink} key={index} {...attributes} />;
            }),
            className: c('dydu-interaction-bubbles', classes.bubbles),
            history: history,
            steps: steps,
          },
        )}
        {hasLoader && <Loader className={classes.loader} scroll={scroll} />}
        {!hasLoader && askFeedback && <Feedback />}
      </div>
    </div>
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
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
