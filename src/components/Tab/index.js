import PropTypes from 'prop-types';
import React from 'react';
import { TabContext } from '../../contexts/TabContext';


/**
 * Render the content of a tab. The content can be forced into the page but
 * hidden using CSS to avoid unnecessary mounting.
 */
export default class Tab extends React.PureComponent {

  static contextType = TabContext;

  static defaultProps = {
    component: 'div',
  };

  static propTypes = {
    children: PropTypes.node,
    component: PropTypes.elementType,
    render: PropTypes.bool,
    value: PropTypes.string.isRequired,
  };

  render() {
    const { should } = this.context;
    const { children, component, render, value, ...rest } = this.props;
    const display = should(value);
    return render || display ? React.createElement(
      component, {...(render && !display && {style: {display: 'none'}}), ...rest}, children
    ) : null;
  }
}
