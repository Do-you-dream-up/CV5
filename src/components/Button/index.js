import classNames from 'classnames';
import React from 'react';

import './index.scss';


class Button extends React.PureComponent {
  render() {
    const { component, variant, ...properties } = this.props;
    const classes = classNames('dydu-button', `dydu-button-${variant}`);
    return React.createElement(component ? component : 'button', {...properties, className: classes});
  }
}


export default Button;
