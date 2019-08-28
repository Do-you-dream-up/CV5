import PropTypes from 'prop-types';
import React from 'react';
import Configuration from '../tools/configuration';


const TABS = Configuration.get('tabs');
const TABS_SELECTED = TABS.selected || 0;
const TABS_VALUES = Array.isArray(TABS.values) ? TABS.values : [TABS.values];


export const TabContext = React.createContext();
export const TabProvider = class TabProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
  };

  state = {current: (TABS_VALUES[TABS_SELECTED] || {}).value};

  select = value => () => {
    this.setState({current: value});
  };

  should = value => value === this.state.current;

  render() {
    return <TabContext.Provider children={this.props.children} value={{
      select: this.select,
      should: this.should,
      state: this.state,
    }} />;
  }
};
