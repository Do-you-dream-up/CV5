import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useStyles from  './styles';
import Avatar from  '../Avatar';
import Bubble from  '../Bubble';
import Loader from  '../Loader';
import Scroll from  '../Scroll';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import { DialogContext } from  '../../contexts/DialogContext';
import sanitize from  '../../tools/sanitize';
import usePrevious from  '../../tools/hooks/previous';
import { Local } from '../../tools/storage';


/**
 * Build an interaction to display content within the conversation. An
 * interaction usually contains a single bubble but can contain one bubble
 * depending on the content. Interactions are split after the horizontal rule
 * HTML tag.
 */
export default function Interaction({ live, secondary, text, thinking, type }) {

  const { configuration } = useContext(ConfigurationContext);
  const { toggleSecondary } = useContext(DialogContext);
  const classes = useStyles({configuration});
  const [ bubbles, setBubbles ] = useState([]);
  const [ hasLoader, setHasLoader ] = useState(!!thinking);
  const [ ready, setReady ] = useState(false);
  const hasAvatar = !!configuration.interaction.avatar[type];
  const { loader } = configuration.interaction;
  const automaticSecondary = !!configuration.secondary.automatic;
  const hasSecondary = Local.get(Local.names.secondary);
  const [ left, right ] = Array.isArray(loader) ? loader : [loader, loader];
  const delay = Math.floor(Math.random() * (~~right - ~~left)) + ~~left;
  const previousText = usePrevious(text);
  const bubblesRef = useRef(bubbles);
  bubblesRef.current = bubbles;

  const addBubbles = useCallback(newBubbles => {
    if (thinking) {
      setTimeout(() => {
        setBubbles([...bubblesRef.current, newBubbles.shift()]);
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

  const addSecondary = useCallback(({ content, title, url }) => {
    if (content || title || url) {
      toggleSecondary(true, {body: sanitize(content), title, url})();
    }
  }, [toggleSecondary]);

  useEffect(() => {
    if (secondary && hasSecondary !== false && automaticSecondary) {
      addSecondary(secondary);
    }
  }, [addSecondary, automaticSecondary, hasSecondary, secondary]);

  useEffect(() => {
    if (text !== previousText && (!ready || live)) {
      setReady(true);
      addBubbles(sanitize(text).split('<hr>'));
    }
  }, [addBubbles, live, previousText, ready, text]);

  return (bubbles.length || hasLoader) && (
    <div className={classNames(
      'dydu-interaction', `dydu-interaction-${type}`, classes.base, classes[type],
    )}>
      {hasAvatar && <Avatar type={type} />}
      <div className={classNames('dydu-interaction-bubbles', classes.bubbles)}>
        {bubbles.map((it, index) => {
          const actions = secondary ? [{action: toggleSecondary(), text: 'Plus'}] : [];
          return <Bubble actions={actions} component={Scroll} html={it} key={index} type={type} />;
        })}
        {hasLoader && <Loader />}
      </div>
    </div>
  );
}


Interaction.propTypes = {
  live: PropTypes.bool,
  secondary: PropTypes.object,
  text: PropTypes.string.isRequired,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
