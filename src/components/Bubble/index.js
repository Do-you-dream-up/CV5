import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import useStyles from  './styles';
import Button from  '../Button';
import Progress from  '../Progress';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';


/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 *
 * The bubble can have clickable actions, appearing as buttons below its content.
 */
export default function Bubble({ actions, children, component, html, thinking, type }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});

  return React.createElement(component, {className: 'dydu-bubble'}, (
    <div className={classNames(`dydu-bubble-${type}`, classes.base, classes[type])}>
      {thinking && <Progress className={classes.progress} />}
      <div className="dydu-bubble-body">
        {children}
        {html && <div dangerouslySetInnerHTML={{__html: html}} />}
      </div>
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
  children: PropTypes.element,
  component: PropTypes.elementType,
  html: PropTypes.string,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
