import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import PrettyHtml from  '../PrettyHtml';
import Progress from  '../Progress';
import useStyles from  './styles';


/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 */
export default function Bubble({ actions, children, className, component, hasExternalLink, html, thinking, type }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});

  return React.createElement(component, {className: c(
    'dydu-bubble', `dydu-bubble-${type}`, classes.base, classes[type], className,
  )}, (
    <>
      {thinking && <Progress className={c('dydu-bubble-progress', classes.progress)} />}
      <div tabIndex='-1' className={c('dydu-bubble-body', classes.body)}>
        {(children || html) && <PrettyHtml children={children} hasExternalLink={hasExternalLink} html={html} />}
        {actions && <div children={actions} className={c('dydu-bubble-actions', classes.actions)} />}
      </div>
    </>
  ));
}


Bubble.defaultProps = {
  component: 'div',
};


Bubble.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.element,
  className: PropTypes.string,
  component: PropTypes.elementType,
  hasExternalLink: PropTypes.bool,
  html: PropTypes.string,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
