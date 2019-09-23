import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from  './styles';
import Button from  '../Button';
import { withConfiguration } from  '../../tools/configuration';


/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 *
 * The bubble can have clickable actions, appearing as buttons below its content.
 */
function Bubble({ actions, component, configuration, html, type }) {

  const classes = useStyles({configuration});

  return React.createElement(component, {className: 'dydu-bubble'}, (
    <div className={classNames(`dydu-bubble-${type}`, classes.base, classes[type])}>
      <div className="dydu-bubble-body" dangerouslySetInnerHTML={{__html: html}} />
      {actions.length > 0 && (
        <div className={classNames('dydu-bubble-actions', classes.actions)}>
          {actions.map((it, index) => (
            <Button children={it.text} key={index} onClick={it.action} />
          ))}
        </div>
      )}
    </div>
  ));
}


Bubble.defaultProps = {
  actions: [],
  component: 'div',
};


Bubble.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  })),
  configuration: PropTypes.object.isRequired,
  component: PropTypes.elementType,
  html: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};


export default withConfiguration(Bubble);
