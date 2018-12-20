import React from 'react';

import classNames from 'classnames';

import './index.scss';


class Avatar extends React.PureComponent {
  render() {
    const { type } = this.props;
    const classes = classNames('dydu-avatar', `dydu-avatar-${type}`);
    return <div className={classes}></div>
  }
}


export default Avatar;
