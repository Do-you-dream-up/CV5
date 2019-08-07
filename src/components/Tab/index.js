import PropTypes from 'prop-types';
import React from 'react';
import { TabContext } from '../../contexts/TabContext';


export default class Tab extends React.PureComponent {

  static contextType = TabContext;

  static propTypes = {
    children: PropTypes.node,
    component: PropTypes.elementType,
    render: PropTypes.bool,
    value: PropTypes.string.isRequired,
  };

  render() {
    const { should } = this.context;
    const { children, component='div', render, value, ...rest } = this.props;
    const display = should(value);
    return render || display ? React.createElement(
      component, {...(render && !display && {style: {display: 'none'}}), ...rest}, children
    ) : null;
  }
}
