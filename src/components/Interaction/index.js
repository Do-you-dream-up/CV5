import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import { DialogContext } from  '../../contexts/DialogContext';
import sanitize from  '../../tools/sanitize';
import { Local } from '../../tools/storage';
import Actions from  '../Actions';
import Avatar from  '../Avatar';
import Bubble from  '../Bubble';
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
  children,
  className,
  history,
  scroll,
  secondary,
  thinking,
  type,
}) {

  children = Array.isArray(children) ? children : [children];
  const { configuration } = useContext(ConfigurationContext);
  const { toggleSecondary } = useContext(DialogContext);
  const classes = useStyles({configuration});
  const [ bubbles, setBubbles ] = useState([]);
  const [ hasLoader, setHasLoader ] = useState(!!thinking);
  const [ ready, setReady ] = useState(false);
  const hasAvatar = !!configuration.interaction.avatar[type];
  const { loader } = configuration.interaction;
  const automaticSecondary = !!configuration.secondary.automatic;
  const [ left, right ] = Array.isArray(loader) ? loader : [loader, loader];
  const delay = Math.floor(Math.random() * (~~right - ~~left)) + ~~left;

  const addBubbles = useCallback(newBubbles => {
    if (thinking) {
      setTimeout(() => {
        const newBubble = newBubbles.shift();
        setBubbles(previous => [...previous, ...(newBubble ? [newBubble] : [])]);
        if (newBubbles.length) {
          addBubbles(newBubbles);
        }
        else {
          setHasLoader(false);
        }
      }, delay);
    }
    else {
      setBubbles(newBubbles);
      setHasLoader(false);
    }
  }, [delay, thinking]);

  const onToggle = useCallback(open => {
    toggleSecondary(open, {body: secondary.content, ...secondary})();
  }, [secondary, toggleSecondary]);

  useEffect(() => {
    if (secondary) {
      onToggle(Local.get(Local.names.secondary) || (!history && automaticSecondary));
    }
  }, [automaticSecondary, history, onToggle, secondary]);

  useEffect(() => {
    if (!ready && children) {
      setReady(true);
      const content = children.reduce((accumulator, it) => (
        typeof it === 'string' ? [...accumulator, ...sanitize(it).split('<hr>')] : [...accumulator, it]
      ), []);
      addBubbles(content.filter(it => it));
    }
  }, [addBubbles, children, ready]);

  return (bubbles.length || hasLoader) && (
    <div className={c(
      'dydu-interaction', `dydu-interaction-${type}`, classes.base, classes[type], className,
    )}>
      {hasAvatar && <Avatar type={type} />}
      <div className={c('dydu-interaction-bubbles', classes.bubbles)}>
        {bubbles.map((it, index) => {
          const actions = [...(secondary ? [{children: 'Plus', onClick: () => onToggle()}] : [])];
          const attributes = {
            actions: !!actions.length && <Actions actions={actions} />,
            component: scroll ? Scroll : undefined,
            type: type,
            [typeof it === 'string' ? 'html' : 'children']: it,
          };
          return <Bubble key={index} {...attributes} />;
        })}
        {hasLoader && <Loader className={classes.loader} scroll={scroll} />}
        {!hasLoader && askFeedback && <Feedback />}
      </div>
    </div>
  );
}


Interaction.defaultProps = {
  scroll: true,
};


Interaction.propTypes = {
  askFeedback: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  history: PropTypes.bool,
  scroll: PropTypes.bool,
  secondary: PropTypes.object,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
