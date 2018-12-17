import React from 'react';

import classNames from 'classnames';

import './index.scss';


class Button extends React.PureComponent {
  render() {
    const { className, component, variant, ...properties } = this.props;
    const classes = classNames('dydu-button', `dydu-button-${variant}`);
    return React.createElement(component ? component : 'button', {...properties, className: classes});
  }
}


export default Button;
