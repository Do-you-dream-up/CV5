import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { TabContext } from '../../contexts/TabContext';


/**
 * Render the content of a tab. The content can be forced into the page but
 * hidden using CSS to avoid unnecessary mounting.
 */
function Tab({ children, component, render, value, ...rest }) {

  const { should } = useContext(TabContext);
  const display = should(value);

  return render || display ? React.createElement(
    component, {...(render && !display && {style: {display: 'none'}}), ...rest}, children
  ) : null;
}


Tab.defaultProps = {
  component: 'div',
};


Tab.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  render: PropTypes.bool,
  value: PropTypes.string.isRequired,
};


export default Tab;
