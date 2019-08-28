import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';


/**
 * Avatar to display in the conversation. Usually next to the conversation
 * bubbles.
 *
 * A request avatar should be next to the user's input while a response avatar
 * should be next to its response.
 */
export default withStyles(styles)(class Avatar extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['request', 'response']).isRequired,
  };

  render() {
    const { classes, type } = this.props;
    return (
      <div className={classNames('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type])} />
    );
  }
});
