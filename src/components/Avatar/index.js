import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Configuration from '../../tools/configuration';

import './index.scss';


class Avatar extends React.PureComponent {
  render() {
    const { type } = this.props;
    const classes = classNames('dydu-avatar', `dydu-avatar-${type}`);
    const styles = Configuration.get('avatar.styles');
    return <div className={classes} style={styles} />;
  }
}


Avatar.propTypes = {
  type: PropTypes.string,
};


export default Avatar;
