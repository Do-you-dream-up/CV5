import React from 'react';

import classNames from 'classnames';

import './index.scss';


class Interaction extends React.Component {
  render() {
    const { className, text, type, ...properties } = this.props;
    const classes = classNames('dydu-interaction', `dydu-interaction-${type}`);
    return (
      <div className={classes} {...properties}>
        <div className="dydu-interaction-avatar"></div>
        <div className="dydu-interaction-content" dangerouslySetInnerHTML={{__html: text}}></div>
      </div>
    );
  }
}


export default Interaction;
