import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from  './styles';
import Progress from  '../Progress';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';


/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 */
export default function Bubble({ actions, children, component, html, thinking, type }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});

  return React.createElement(component, {className: 'dydu-bubble'}, (
    <div className={c(`dydu-bubble-${type}`, classes.base, classes[type])}>
      {thinking && <Progress className={c('dydu-bubble-progress', classes.progress)} />}
      <div className="dydu-bubble-body">
        {children}
        {html && <div dangerouslySetInnerHTML={{__html: html}} />}
      </div>
      {actions && <div children={actions} className="dydu-bubble-actions" />}
    </div>
  ));
}


Bubble.defaultProps = {
  component: 'div',
};


Bubble.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.element,
  component: PropTypes.elementType,
  html: PropTypes.string,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
