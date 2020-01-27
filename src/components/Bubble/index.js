import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import Progress from  '../Progress';
import useStyles from  './styles';


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

  return React.createElement(component, {className: c(
    'dydu-bubble', `dydu-bubble-${type}`, classes.base, classes[type],
  )}, (
    <>
      {thinking && <Progress className={c('dydu-bubble-progress', classes.progress)} />}
      <div className="dydu-bubble-body">
        {children}
        {html && <div dangerouslySetInnerHTML={{__html: html}} />}
      </div>
      {actions && (
        <div children={actions} className={c('dydu-bubble-actions', classes.actions)} />
      )}
    </>
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
