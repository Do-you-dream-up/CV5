import React from 'react';

import './index.scss';


class Button extends React.Component {
  render() {
    const { className, component, variant, ...properties } = this.props;
    const classes = ['dydu-button', {
      default: 'dydu-button-default',
      icon: 'dydu-button-icon'
    }[variant || 'default'], className].join(' ');
    return React.createElement(component ? component : 'button', {...properties, className: classes});
  }
}


export default Button;
