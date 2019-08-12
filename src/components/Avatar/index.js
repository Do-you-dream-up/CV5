import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';


class Avatar extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['request', 'response']).isRequired,
  };

  render() {
    const { classes, type } = this.props;
    return (
      <div className={classNames('dydu-avatar', `dydu-avatar-${type}`, classes.base, classes[type])} />
    );
  }
}


export default withStyles(styles)(Avatar);
