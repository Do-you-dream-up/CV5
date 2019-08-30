import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from  './styles';
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
export default withConfiguration(withStyles(styles)(class Bubble extends React.PureComponent {

  static defaultProps = {
    actions: [],
    component: 'div',
  };

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      action: PropTypes.func.isRequired,
      text: PropTypes.string.isRequired,
    })),
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
    component: PropTypes.elementType,
    html: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['request', 'response']).isRequired,
  };

  render() {
    const { actions, classes, component, html, type } = this.props;
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
}));
