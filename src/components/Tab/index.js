import { createElement, useContext } from 'react';

import PropTypes from 'prop-types';
import { TabContext } from '../../contexts/TabContext';

/**
 * Render the content of a tab. The content can be forced into the page but
 * hidden using CSS to avoid unnecessary mounting.
 */
function Tab({ children, component, render, value, ...rest }) {
  const { should } = useContext(TabContext);
  const display = should(value);

  return render || display
    ? createElement(component, { ...(render && !display && { style: { display: 'none' } }), ...rest }, children)
    : null;
}

Tab.defaultProps = {
  component: 'div',
};

Tab.propTypes = {
  children: PropTypes.any,
  component: PropTypes.elementType,
  render: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

export default Tab;
