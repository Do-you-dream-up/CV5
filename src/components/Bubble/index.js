import React from 'react';

import './index.scss';


class Bubble extends React.Component {
  render() {
    const { children, className, type, ...properties } = this.props;
    const classes = ['dydu-bubble', {
      request: 'dydu-bubble-request',
      response: 'dydu-bubble-response'
    }[type], className].join(' ');
    return (
      <div className={classes} {...properties}>
        <div className="dydu-bubble-avatar"></div>
        <div className="dydu-bubble-content" children={children}></div>
      </div>
    );
  }
}


export default Bubble;
