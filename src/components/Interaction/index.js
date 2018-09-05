import React from 'react';

import './index.scss';


class Interaction extends React.Component {
  render() {
    const { children, className, type, ...properties } = this.props;
    const classes = ['dydu-interaction', {
      request: 'dydu-interaction-request',
      response: 'dydu-interaction-response'
    }[type], className].join(' ');
    return (
      <div className={classes} {...properties}>
        <div className="dydu-interaction-avatar"></div>
        <div className="dydu-interaction-content" children={children}></div>
      </div>
    );
  }
}


export default Interaction;
