import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './index.scss';


class Avatar extends React.PureComponent {
  render() {
    const { type } = this.props;
    const classes = classNames('dydu-avatar', `dydu-avatar-${type}`);
    return <div className={classes}></div>;
  }
}


Avatar.propTypes = {
  type: PropTypes.string,
};


export default Avatar;
