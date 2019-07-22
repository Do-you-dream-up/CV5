import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import { TabContext } from '../contexts/TabContext';


const styles = {
  root: {
  },
};


class Tab extends React.PureComponent {

  static contextType = TabContext;

  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    component: PropTypes.elementType,
    render: PropTypes.bool,
    value: PropTypes.string.isRequired,
  };

  render() {
    const { state: tabState } = this.context;
    const { children, classes, component='div', render, value, ...rest } = this.props;
    const display = value === tabState.current;
    return render || display ? React.createElement(
      component, {...(render && !display && {style: {display: 'none'}}), ...rest}, children
    ) : null;
  }
}


export default withStyles(styles)(Tab);
