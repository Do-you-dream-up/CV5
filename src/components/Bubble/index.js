import classNames from 'classnames';
import React from 'react';

import './index.scss';


class Bubble extends React.PureComponent {
  render() {
    const { type, ...properties } = this.props;
    const classes = classNames('dydu-bubble', `dydu-bubble-${type}`);
    return <div className={classes} {...properties}></div>;
  }
}


export default Bubble;
